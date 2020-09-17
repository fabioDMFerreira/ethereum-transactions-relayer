import BlockListener from './BlockListener'
import TransactionContainer from './Transaction'

function getStubDependencies (pendingTransactions: TransactionContainer[] = []) {
  const eventListener = {
    on: jest.fn(),
    off: jest.fn()
  }
  const relayer = {
    retry: jest.fn((tx: TransactionContainer) => { }),
    getPendingTransactions: jest.fn(() => pendingTransactions)
  }

  return {
    eventListener,
    relayer
  }
}

describe('BlockListener', () => {
  it('start should attach listener to catch new blocks', () => {
    const { eventListener, relayer } = getStubDependencies()
    const blockListener = new BlockListener(eventListener, relayer)

    blockListener.start()

    expect(eventListener.on).toHaveBeenCalledTimes(1)
    expect(eventListener.on.mock.calls[0][0]).toEqual('block')
  })

  it('stop should dettach listener to catch new blocks', () => {
    const { eventListener, relayer } = getStubDependencies()
    const blockListener = new BlockListener(eventListener, relayer)

    blockListener.stop()

    expect(eventListener.off).toHaveBeenCalledTimes(1)
    expect(eventListener.off.mock.calls[0][0]).toEqual('block')
  })

  describe('onBlockMined', () => {
    it('should not retry to relay transactions if there is no pending transaction', () => {
      const { eventListener, relayer } = getStubDependencies()
      const blockListener = new BlockListener(eventListener, relayer)

      blockListener.onBlockMined(1)

      expect(relayer.getPendingTransactions).toBeCalledTimes(1)
      expect(relayer.retry).toBeCalledTimes(0)
    })

    it('should not retry to relay transactions if a transaction does not have last attempt block', () => {
      const { eventListener, relayer } = getStubDependencies([new TransactionContainer('test', 0.1, 1)])
      const blockListener = new BlockListener(eventListener, relayer)

      blockListener.onBlockMined(1)

      expect(relayer.getPendingTransactions).toBeCalledTimes(1)
      expect(relayer.retry).toBeCalledTimes(0)
    })

    it('should not retry to relay transactions if a transaction last attempt block was one of the last 3 blocks', () => {
      const tx = new TransactionContainer('test', 0.1, 1)
      tx.lastBlockAttempt = 1
      const { eventListener, relayer } = getStubDependencies([tx])
      const blockListener = new BlockListener(eventListener, relayer)

      blockListener.onBlockMined(2)

      expect(relayer.getPendingTransactions).toBeCalledTimes(1)
      expect(relayer.retry).toBeCalledTimes(0)
    })

    it('should retry to relay transactions if a transaction last attempt block was far from 3 blocks ago', () => {
      const tx = new TransactionContainer('test', 0.1, 1)
      tx.lastBlockAttempt = 1
      const { eventListener, relayer } = getStubDependencies([tx])
      const blockListener = new BlockListener(eventListener, relayer)

      blockListener.onBlockMined(4)

      expect(relayer.getPendingTransactions).toBeCalledTimes(1)
      expect(relayer.retry).toBeCalledTimes(1)
    })
  })
})
