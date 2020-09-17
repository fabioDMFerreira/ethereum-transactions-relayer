import { Server, WebSocket } from 'mock-socket'
import NewTransactionCli from './NewTransactionCli'

describe('NewTransactionCli', () => {
  it('should send transactions through websocket connection', (done) => {
    const fakeURL = 'ws://localhost:8080'
    const mockServer = new Server(fakeURL)

    const mockClient = new WebSocket(fakeURL)

    const actualServer: any[] = []
    const expectedServer = [JSON.stringify({
      type: 'send_transaction',
      payload: [
        { address: 'test', value: 0.1 },
        { address: 'test', value: 0.1 },
        { address: 'test', value: 0.1 }
      ]
    })]

    const actualClient: any[] = []
    const expectedClient = [
      'tx mined'
    ]

    mockServer.on('connection', socket => {
      socket.on('message', message => {
        actualServer.push(message)

        socket.send('tx mined')
      })
    })

    mockClient.onmessage = (message: any) => {
      actualClient.push(message.data)
    }

    const cli = new NewTransactionCli(mockClient)

    cli.send('test', 0.1, 3)

    setTimeout(() => {
      expect(actualServer).toEqual(expectedServer)
      expect(actualClient).toEqual(expectedClient)
      done()
    }, 100)
  })
})
