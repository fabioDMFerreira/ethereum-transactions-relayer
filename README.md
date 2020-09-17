# Ethereum Transactions Relayer

Service
* Relay transactions to ethereum node
* Retry relaying pending transactions after 3 blocks

CLI
* Asks service to relay multiple transactions

## Usage

Run your ethereum node locally. Be sure your node exposes an RPC API on `https://localhost:8545`.

Create `.env` file on the root of project
```
SIGNER_ADDRESS=0x83cc2375B78b41e4fC1372cD2D495A58b6eFAa33
SIGNER_PASSWORD=ipsum
NODE_URI=https://localhost:8545
```

Start service
```
npm run service
```

Send transactions
```
npm run cli <to_address> <ether value> <times>
```
**Times** allow to send more than one transaction per command.

## TODO
* Manage ethereum node connection gracefully and recover from connection errors;
* Persist transactions pool on LevelDB;
* Fetch pending transactions in database and retry;
* Use default gas price provided by network;
* Calculate new gas price after the first transaction attempt.
* Show transactions mined in realtime on client
