const Web3 = require("web3");

async function main() {
  // Configuring the connection to an Ethereum node
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${network}.infura.io/v3/${projectId}`
    )
  );
  // Creating a signing account from a private key
  const signer = web3.eth.accounts.privateKeyToAccount(
    privateKey
  );
  web3.eth.accounts.wallet.add(signer);
  // Creating the transaction object
  const tx = {
    from: fromAddress,
    to: toAddress,
    value: web3.utils.toWei("0.0000001")
  };

  if(data)
    tx.data = "0x" + Buffer.from(data, 'utf8').toString('hex');
  // Assigning the right amount of gas
  tx.gas = await web3.eth.estimateGas(tx);

  // Sending the transaction to the network
  const receipt = await web3.eth
    .sendTransaction(tx)
    .once("transactionHash", (txhash) => {
      //console.log(`Mining transaction ...`);
      console.log(`https://${network}.etherscan.io/tx/${txhash}`);
    });
  // The transaction is now on chain!
  //console.log(`Mined in block ${receipt.blockNumber}`);
}

require("dotenv").config();
const args = require('minimist')(process.argv.slice(2));
const network = args['network'];
if(!network)
  throw new Error('Network not specified!');
const projectId = args['project'];
if(!projectId)
  throw new Error('Project not specified!');
const fromAddress = args['from'];
if(!fromAddress)
  throw new Error('From Address not specified!');
const toAddress = args['to'];
if(!toAddress)
  throw new Error('To Address not specified!');
const privateKey = args['key'];
if(!privateKey)
  throw new Error('Private Key not specified!');
const data = args['data'];

main();