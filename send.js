import Web3 from "web3";
import dotenv from "dotenv";
import minimist from "minimist";

const transactionValueETH = '0.0000000001';
const tipInGWei = '1';
const priority = 'slow';

dotenv.config();

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
    const baseFeePerGas = (await (web3.eth.getBlock("pending"))).baseFeePerGas;
    const tipForMiner = web3.utils.toWei(tipInGWei, 'gwei');
    const max = Number(tipForMiner) + baseFeePerGas;
    tx.gas = await web3.eth.estimateGas(tx);
    tx.maxFeePerGas = max;
    tx.maxPriorityFeePerGas = tipForMiner;

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


const args = minimist(process.argv.slice(2));
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
