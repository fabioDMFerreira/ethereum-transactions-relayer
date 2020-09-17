import dotenv from 'dotenv'
import cli from './cli'
import logger from './logger'
import serviced from './serviced'

logger.setDebug(true)

dotenv.config()

if (process.argv.length < 3) {
  showCommandSyntax()
  exit()
}

const [, , program, ...args] = process.argv

switch (program) {
  case 'cli': {
    if (args.length < 2) {
      showCliCommandSyntax()
      exit()
    }

    logger.log('Starting cli...')
    const [address, value, times] = args
    cli({ address, value: +value, times: +times })
    break
  }
  case 'service': {
    const errors = validateServiceArgs(process.env)
    if (errors.length) {
      console.log('Fix next issues on .env file:')
      console.log(errors.join('\n'))
      exit()
    }

    logger.log('Starting service...')
    serviced({
      SIGNER_ADDRESS: process.env.SIGNER_ADDRESS,
      SIGNER_PASSWORD: process.env.SIGNER_PASSWORD,
      NODE_URI: process.env.NODE_URI
    })
    break
  }
  default: {
    showCommandSyntax()
  }
}

process.on('SIGTERM', () => {
  console.log('SIGTERM')
  exit()
})

process.on('SIGKILL', () => {
  console.log('SIGKILL')
  exit()
})

process.on('SIGINT', () => {
  console.log('SIGINT')
  exit()
})

function showCliCommandSyntax () {
  console.log('npm run cli <address> <eth_amount> <times>?')
}

function showCommandSyntax () {
  console.log('npm run <cli|service> <...args>')
}

function exit () {
  console.log('Stopping application...')
  process.exit()
}

function validateServiceArgs (env: any) {
  return ['SIGNER_ADDRESS', 'SIGNER_PASSWORD', 'NODE_URI'].reduce(
    (final, key) => {
      if (!env[key]) {
        final.push(`${key} is required`)
      }

      return final
    }, [] as string[]
  )
}

// import { ethers } from 'ethers'

// const provider = new ethers.providers.JsonRpcProvider();

// (async () => {
//   const block = await provider.getBlockNumber()

//   console.log({ block })

//   const signer = provider.getSigner('0x83cc2375B78b41e4fC1372cD2D495A58b6eFAa33')

//   console.log({ signer })

//   await signer.unlock('ipsum')

//   const balance = await provider.getBalance('0x83cc2375B78b41e4fC1372cD2D495A58b6eFAa33')

//   console.log({ balance: ethers.utils.formatEther(balance) })

//   const tx = await signer.sendTransaction({
//     to: '0xb12518b62cDE20fBfc6Fd2D627ECa6b80cB71E32',
//     value: ethers.utils.parseEther('0.001'),
//     nonce: 6
//   })

//   console.log({ tx })

//   provider.once(tx.hash, transaction => {
//     console.log('tx mined', transaction)
//   })

//   provider.on('block', blockNumber => {
//     console.log('block', blockNumber, 'mined')
//   })

//   provider.on('error', (err) => {
//     console.log({ err })
//   })
// })()
