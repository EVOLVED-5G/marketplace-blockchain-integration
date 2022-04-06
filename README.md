# ETH Transaction sender

## Intro

This project makes use of the [Web3 Javascript Library](https://github.com/ChainSafe/web3.js), and a given project on [Infura](https://infura.io/), which is a third-party service that allows interaction with the Ethereum network via the web3 library.

## Prerequisites

`NodeJS version 14` (or newer) is required.

## Project setup

This is a fairly simple nodejs project. In order to build it, just `cd` into the project directory and run:

```bash
npm install
```

Then, you are ready to use the `send.js` script.

## Usage

This script is designed to be called from the command line.
Example:

```bash

node send.js --network=rinkeby --project=123 --from=456 --to=789 --key=asdf1234 --data="Test data"
```

### Arguments explanation

`network`

Defines the Ethereum network. Can be one of `mainnet`, `rinkeby`, `ropsten`, `kovan`, `goerli`

<hr>

`project` - **required**

Defines the project id on thge [Infura](https://infura.io/) service.

<hr>

`from` - **required**

Defines the Ethereum address of the sender. **Note**: the address must not contain the `0x` starting part, this is added from the script itself.

<hr>

`to` - **required**

Defines the Ethereum address of the receiver. **Note**: the address must not contain the `0x` starting part, this is added from the script itself.

<hr>

`key` - **required**

Defines the Ethereum sender address private key. This is needed for the `web3` library, in order to sign the transaction.

<hr>

`data` - **optional**

Optional parameter. Defines any arbitrary data that will be added as additional payload to the transaction. Can be a note from the sender, a greeting, or anything else.
