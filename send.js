import Web3 from "web3";
import dotenv from "dotenv";

const transactionValueETH = '0.0000000001';
const tipInGWei = '1.5';
const priority = 'slow';

dotenv.config();

export async function createTransaction(network, projectId, fromAddress, toAddress, privateKey, data) {
    // Configuring the connection to an Ethereum node
    const web3 = new Web3(
        new Web3.providers.HttpProvider(
            `https://${network}.infura.io/v3/${projectId}`
        )
    );
    // A nonce is basically the number of transactions that have been performed from a particular account address.
    const accountNonce =
        '0x' + (await web3.eth.getTransactionCount("0x" + fromAddress) + 1).toString(16)
    // Creating a signing account from a private key
    const signer = web3.eth.accounts.privateKeyToAccount(
        privateKey
    );
    web3.eth.accounts.wallet.add(signer);
    // Creating the transaction object
    const tx = {
        nonce: accountNonce,
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
    return new Promise(function (resolve, reject) {
        web3.eth
            .sendTransaction(tx)
            .once("transactionHash", (txhash) => {
                let link = "https://";
                if (network !== "mainnet")
                    link += network + ".";
                link += "etherscan.io/tx/" + txhash;
                resolve({
                    tx: tx,
                    link: link
                });
            }).catch(err => {
            reject(err);
        });
    });
}
