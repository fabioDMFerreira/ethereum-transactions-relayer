import { ethers } from 'ethers'
import logger from '../logger'
import TransactionContainer, { RelayAttempt } from './Transaction'

type TransactionResponse = ethers.providers.TransactionResponse
type TransactionRequest = ethers.providers.TransactionRequest
type TransactionReceipt = ethers.providers.TransactionReceipt

interface EventListener {
  once: (message: string, callback: any) => any
}

interface Signer {
  sendTransaction: (txRequest: TransactionRequest) => Promise<TransactionResponse>
}

interface Pool {
  getTransactions: () => TransactionContainer[]
  add: (tx: TransactionContainer) => void
  mined: (hash: string, gasUsed: string, blockNumber: number) => void
}

export default class TransactionsRelayer {
  eventListener: EventListener
  signer: Signer
  pool: Pool

  constructor (eventListener: EventListener, signer: Signer, pool: Pool) {
    this.eventListener = eventListener
    this.signer = signer
    this.pool = pool
  }

  async relay (to: string, value: number) {
    try {
      const txResponse = await this.sendTransaction(to, value)

      const tx = new TransactionContainer(to, value, txResponse.nonce)

      const txAttempt = buildRelayAttempt(txResponse)

      tx.addAttempt(txAttempt)

      this.pool.add(tx)

      this.addTransactionMinedListener(txResponse.hash)
    } catch (err) {
      handleSendTransactionError(err)
    }
  }

  sendTransaction (to: string, value: number, options: any = {}) {
    return this.signer.sendTransaction({
      to,
      value: ethers.utils.parseEther(value.toString()),
      ...options
    })
  }

  async retry (tx: TransactionContainer) {
    try {
      const txResponse = await this.sendTransaction(tx.to, tx.value, { nonce: tx.nonce })

      const txAttempt = buildRelayAttempt(txResponse)

      tx.addAttempt(txAttempt)

      this.addTransactionMinedListener(txResponse.hash)
    } catch (err) {
      handleSendTransactionError(err)
    }
  }

  addTransactionMinedListener (txHash: string) {
    this.eventListener.once(txHash, this.onTransactionMined.bind(this))
  }

  onTransactionMined (receipt: TransactionReceipt) {
    this.pool.mined(receipt.transactionHash, receipt.gasUsed.toString(), receipt.blockNumber)
  }

  getPendingTransactions () {
    return this.pool.getTransactions()
  }
}

function buildRelayAttempt (txResponse: TransactionResponse): RelayAttempt {
  return {
    hash: txResponse.hash,
    gasPrice: txResponse.gasPrice.toString(),
    gasLimit: txResponse.gasLimit.toString(),
    block: txResponse.blockNumber
  }
}

function handleSendTransactionError (err: Error) {
  logger.error(`message ${err.message}`)
}
