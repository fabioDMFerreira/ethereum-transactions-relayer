import { v4 as uuidv4 } from 'uuid'

export type TransactionStatus = 'pending' | 'mined'

export interface TransactionReceipt {
  hash: string,
  gasUsed: string,
  block: number
}

export interface RelayAttempt {
  hash: string,
  gasPrice: string,
  gasLimit: string,
  block?: number
}

export default class TransactionContainer {
  id: string
  status: TransactionStatus
  to: string
  value: number
  nonce: number
  attempts: RelayAttempt[]
  lastBlockAttempt?: number
  lastGasPriceAttempt?: string
  previousTxHashAttempt?: string
  receipt?: TransactionReceipt

  constructor (to: string, value: number, nonce: number) {
    this.id = uuidv4()
    this.to = to
    this.value = value
    this.nonce = nonce
    this.status = 'pending'
    this.attempts = []
  }

  addAttempt (attempt: RelayAttempt) {
    this.lastGasPriceAttempt = attempt.gasPrice
    this.lastBlockAttempt = attempt.block
    this.previousTxHashAttempt = attempt.hash

    this.attempts.push(attempt)
  }

  mined (hash: string, gasUsed: string, block: number) {
    this.status = 'mined'
    this.receipt = {
      hash,
      gasUsed,
      block
    }
  }
}
