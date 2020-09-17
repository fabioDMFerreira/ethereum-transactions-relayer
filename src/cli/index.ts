import WebSocket from 'ws'
import NewTransactionCli from './NewTransactionCli'

interface Props {
  address: string,
  value: number,
  times: number
}

export default async (props: Props) => {
  const ws = new WebSocket('ws://localhost:8888')

  const cli = new NewTransactionCli(ws)

  cli.send(props.address, props.value, props.times)
}
