import WebSocket from 'ws'
import logger from '../logger'
import TransactionsRelayer from './TransactionsRelayer'

export default class NewTransactionsController {
  relayer: TransactionsRelayer
  wss: WebSocket.Server

  constructor (relayer: TransactionsRelayer, wss: WebSocket.Server) {
    this.relayer = relayer
    this.wss = wss
  }

  start () {
    this.wss.on('connection', socket => {
      socket.on('message', (message: any) => {
        try {
          message = JSON.parse(message)

          if (message.type === 'send_transaction') {
            message.payload.forEach(
              (tx: any) => {
                this.relayer.relay(tx.address, tx.value)
              }
            )
          }
        } catch (err) {
          logger.error(err)
        }

        socket.close()
      })
    })
  }

  stop () {
  }
}
