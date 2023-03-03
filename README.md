# ETH Transaction sender

## Intro

This project makes use of the [Web3 Javascript Library](https://github.com/ChainSafe/web3.js), and a given project on [Infura](https://infura.io/), which is a third-party service that allows interaction with the Ethereum network via the web3 library.

## Prerequisites

`NodeJS version 14` (or newer) is required.

## Project setup

### Setting the `.env` file

First, make a copy of the `.env.example` file, and rename it to `.env`:

```bash
cp .env.example .env
```

This is a fairly simple nodejs project. In order to build it, just `cd` into the project directory and run:

```bash
npm install
```

Then, run `npm run start` in order to initiate the server.

## Usage

This script is designed to be called as a web API, via express (listening port: `8000`).

### Arguments explanation

`network` - **required**

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

## Docker Deployment

The app can be instantly deployed via Docker. Just run

```bash
docker-compose up --build
```

And the docker container will be built and run. The app will then be available via
[localhost:8000](http://localhost:8000)

**Notice:** The `docker-compose.yml` file assumes that an external docker network (`docker_evolved5g_net`) has already been set up.
So, you either need to have the Evolved5g-Pilot project initialized, or just create an external network:

```bash
docker network create docker_evolved5g_net
```
