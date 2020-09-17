interface WebSocket {
  onopen: (event: any) => void,
  send: (message: string) => void
}
export default class NewTransactionCli {
  ws: WebSocket

  constructor (ws: WebSocket) {
    this.ws = ws
  }

  send (address: string, value: number, times: number) {
    const message: any[] = []

    while (times-- > 0) {
      message.push({ address, value })
    }

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({
        type: 'send_transaction',
        payload: message
      }))
    }
  }
}
