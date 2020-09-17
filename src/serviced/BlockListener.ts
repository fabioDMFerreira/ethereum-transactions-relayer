import logger from '../logger'
import TransactionContainer from './Transaction'

interface EventsListener {
  on: (message: string, callback: any) => any
  off: (message: string) => any
}

interface Relayer {
  retry: (tx: TransactionContainer) => void
  getPendingTransactions: () => TransactionContainer[]
}

export default class BlockListener {
  provider: EventsListener
  relayer: Relayer

  constructor (provider: EventsListener, relayer: Relayer) {
    this.provider = provider
    this.relayer = relayer
  }

  start () {
    this.provider.on('block', this.onBlockMined.bind(this))
  }

  stop () {
    this.provider.off('block')
  }

  onBlockMined (block: number) {
    logger.info(`Block ${block} mined`)

    const txs = this.relayer.getPendingTransactions()

    txs.forEach(tx => {
      if (tx.lastBlockAttempt && block - tx.lastBlockAttempt >= 3) {
        logger.warn(`retry ${tx.id} previouse block: ${tx.lastBlockAttempt} current block: ${block} last tx hash attempt: ${tx.previousTxHashAttempt}`)
        tx.lastBlockAttempt = block
        this.relayer.retry(tx)
      } else if (!tx.lastBlockAttempt) {
        tx.lastBlockAttempt = block
      }
    })
  }
}
