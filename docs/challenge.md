# Challenge

## Problem Description
A transaction should be sent by our relay node.

## Constraints
- you must start with a gas price dictated by Gelato
- you must give each attempt 3 blocks to get mined
- after the first attempt fails you can choose your gasPrice
- you must get the transaction mined as quickly as possible, without going too high above the initial gas price of the first attempt
- node should be able to recover from errors

## Requirements
Before presenting the steps it's important to refer that:
* transactions relay state should be persisted;
  - it may be persisted in a file or database (LevelDB, MongoDB or Redis);
  - this allows the node to recover from eventual problems;
* The library that listens for new blocks keep the event loop running and prevents nodejs program to stop
  - listening events triggers the creation of I/O operations and keeps the event loop waiting for their responses
* Assumption: the blockchain library allows to subscribe to an event that detects errors
  - on detecting an error the programs calls a function to restart the event
  - the restarting of an event should have a retry timeout to prevent node from abusing from hardware resources
* there are two actions that trigger node state changes
  - creating a new transaction to be relayed;
  - detecting a new block was mined;

## Creating a new transaction to be relayed

1. Get gelato gas price dictated by gelato;
2. Get current account nonce value;
3. Get last block mined id;
4. Persist transaction details + gas price + nonce + block id
5. Relay transaction;
6. Set transaction attempts field to one.

## New block mined
It is used a library to subscribe the event that detects a block has been mined (in the event payload the transactions hashes are provided)

1. Get pending transactions relayed;
2. For each pending transaction
  2.1. Check pending transaction hash is in the block
    2.1.1. If yes
      - updates transaction state as relayed;
      - update account nonce;
      - Relay all the pending transactions with the updated nonce;
        * this approach is very inneficient. We can discuss a better solution for this
    2.1.2. If not
      - Check if block id of the transaction attempt has reached the maximum of 3 blocks
        * If not it doesn't do nothing
        * If yes it attempts to relay the transaction again
          - The gas price is recalculated
          - It updates transaction state (last block id, gas price and attempts)
          - Relay transaction

## Recovering from errors
It loads the pending transactions and gets the blocks data that were mined since the node crashed.
This process should
  - update the transactions mined state
  - it should relay the pending transactions that meet the criteria of being waiting for more than 3 blocks.

## Last considerations
* Relaying again all the transactions with correct nonce is very inneficient and we should make the algorithm smarter.
* GasPrice calculator has to have in consideration the block mining time and the estimated gas price necessary to include the transaction in the block
  - https://ethgasstation.info/ provides a cool service that can help us calculate the best gas price to use in each attempt

