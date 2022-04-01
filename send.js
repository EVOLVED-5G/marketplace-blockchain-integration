const Web3 = require("web3");
const transactionValueETH = '0.000000001';
const feeInGWei = '5';
const priority = 'slow';

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
        from: "0x" + fromAddress,
        to: "0x" + toAddress,
        value: web3.utils.toWei(transactionValueETH),
        schedule: priority
    };

    if (data)
        tx.data = "0x" + Buffer.from(data, 'utf8').toString('hex');
    // Assigning the right amount of gas
    tx.gas = await web3.eth.estimateGas(tx);
    tx.maxFeePerGas = web3.utils.toWei(feeInGWei, 'gwei');
    tx.maxPriorityFeePerGas = web3.utils.toWei(feeInGWei, 'gwei');

    // console.log("base fee: " + baseFee + "\n");
    // console.log("gas price: " + gasPrice + "\n");
    // console.log("gas: " + tx.gas + "\n");
    // console.log("max fee per gas: " + tx.maxFeePerGas + "\n");
    // console.log("max priority gas price: " + tx.maxPriorityFeePerGas + "\n");

    // Sending the transaction to the network
    const receipt = await web3.eth
        .sendTransaction(tx)
        .once("transactionHash", (txhash) => {
            let link = "https://";
            if (network !== "mainnet")
                link += network + ".";
            link += "etherscan.io/tx/" + txhash;
            const response = {
                tx: tx,
                link: link
            }
            process.stdout.write(JSON.stringify(response));
        });
}

require("dotenv").config();
const args = require('minimist')(process.argv.slice(2));
const network = args['network'].trim();
if (!network)
    throw new Error('Network not specified!');
const projectId = args['project'].trim();
if (!projectId)
    throw new Error('Project not specified!');
const fromAddress = args['from'].trim();
if (!fromAddress)
    throw new Error('From Address not specified!');
const toAddress = args['to'].trim();
if (!toAddress)
    throw new Error('To Address not specified!');
const privateKey = args['key'].trim();
if (!privateKey)
    throw new Error('Private Key not specified!');
const data = args['data'].trim();

main();
