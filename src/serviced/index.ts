import WebSocket from 'ws'

import TransactionsRelayer from './TransactionsRelayer'

import { ethers } from 'ethers'
import TransactionsPool from './TransactionsPool'
import BlockListener from './BlockListener'
import NewTransactionsController from './NewTransactionsController'
import logger from '../logger'

interface Props {
  SIGNER_ADDRESS?: string
  SIGNER_PASSWORD?: string
  NODE_URI?: string
}

export default async (props: Props) => {
  const provider = new ethers.providers.JsonRpcProvider(props.NODE_URI)
  const signer = provider.getSigner(props.SIGNER_ADDRESS)
  await signer.unlock(props.SIGNER_PASSWORD || 'password')

  const pool = new TransactionsPool()
  const relayer = new TransactionsRelayer(provider, signer, pool)
  const blockLister = new BlockListener(provider, relayer)

  const wss = new WebSocket.Server({ port: 8888 })
  const newTransactionsController = new NewTransactionsController(relayer, wss)

  logger.log('Listening for new blocks...')
  blockLister.start()

  logger.log('Listening for new transactions on port ws://localhost:8888')
  newTransactionsController.start()
}
