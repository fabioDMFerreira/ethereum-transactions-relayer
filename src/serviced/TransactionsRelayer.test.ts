import TransactionsRelayer from './TransactionsRelayer'

function getRelayerStubDependencies () {
  const eventListener = {
    once: jest.fn()
  }
  const signer = {
    sendTransaction: jest.fn()
  }
  const pool = {
    getTransactions: jest.fn(),
    add: jest.fn(),
    mined: jest.fn()
  }

  return {
    eventListener, signer, pool
  }
}

describe('TransactionsRelayer', () => {
  it('sendTransaction should call signer sendTransaction', () => {
    const { signer, eventListener, pool } = getRelayerStubDependencies()

    const relayer = new TransactionsRelayer(eventListener, signer, pool)

    relayer.sendTransaction('test', 0.01)

    expect(signer.sendTransaction).toBeCalledTimes(1)
  })

  it('addTransactionMinerListener should call eventListener once', () => {
    const { signer, eventListener, pool } = getRelayerStubDependencies()

    const relayer = new TransactionsRelayer(eventListener, signer, pool)

    relayer.addTransactionMinedListener('lorem')

    expect(eventListener.once).toBeCalledTimes(1)
  })

  it('getPendingTransactions should call pool getTransactions', () => {
    const { signer, eventListener, pool } = getRelayerStubDependencies()

    const relayer = new TransactionsRelayer(eventListener, signer, pool)

    relayer.getPendingTransactions()

    expect(pool.getTransactions).toBeCalledTimes(1)
  })
})
