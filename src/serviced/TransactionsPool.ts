import logger from '../logger'
import TransactionContainer from './Transaction'

export default class TransactionsPool {
  txs: TransactionContainer[]

  constructor (txs:TransactionContainer[] = []) {
    this.txs = txs
  }

  add (tx: TransactionContainer) {
    this.txs.push(tx)
    logger.info(`tx container ${tx.id} added`)
  }

  remove (id: string) {
    this.txs = this.txs.filter(tx => tx.id !== id)

    logger.info(`tx container ${id} removed from pool. Remaining ${this.txs.length}`)
  }

  mined (hash: string, gasUsed: string, block: number) {
    const tx = this.txs.find(tx => {
      return tx.attempts.some(attempt => attempt.hash === hash)
    })

    if (tx) {
      tx.mined(hash, gasUsed, block)
      logger.info(`tx container ${tx.id} mined ${JSON.stringify({ hash, gasUsed, block })}`)
      this.remove(tx.id)
    }
  }

  getTransactions () {
    return this.txs
  }
}
