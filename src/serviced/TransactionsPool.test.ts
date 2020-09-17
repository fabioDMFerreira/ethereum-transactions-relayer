import TransactionContainer from './Transaction'
import TransactionsPool from './TransactionsPool'

describe('TransactionsPool', () => {
  it('add should append a transaction to collection', () => {
    const pool = new TransactionsPool()

    pool.add(new TransactionContainer('test', 0.01, 1))

    expect(pool.txs).toHaveLength(1)
  })

  it('remove should remove transaction from collection', () => {
    const tx = new TransactionContainer('test', 0.01, 1)
    const txsCollection = [tx]

    const pool = new TransactionsPool(txsCollection)

    expect(pool.txs).toHaveLength(1)

    pool.remove(tx.id)

    expect(pool.txs).toHaveLength(0)
  })

  it('getTransactions should return the transactions in collection', () => {
    const tx = new TransactionContainer('test', 0.01, 1)
    const txsCollection = [tx]

    const pool = new TransactionsPool(txsCollection)

    expect(pool.getTransactions()).toEqual(txsCollection)
  })

  it('mined should transaction status and remove from collection if transaction hash belongs to transaction container', () => {
    const tx = new TransactionContainer('test', 0.01, 1)
    tx.addAttempt({
      hash: 'lorem',
      gasLimit: '1',
      gasPrice: '1',
      block: 1
    })
    const txsCollection = [tx]

    const pool = new TransactionsPool(txsCollection)

    pool.mined('lorem', '1', 1)

    expect(tx.status).toEqual('mined')
    expect(pool.txs).toHaveLength(0)
  })
})
