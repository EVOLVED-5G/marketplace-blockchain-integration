import express from 'express';
import bodyParser from 'body-parser';
import {createTransaction} from "./send.js";


const app = express();


app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.post('/create', async (req, res) => {
    const network = req.body.network;
    const projectId = req.body.projectId;
    const fromAddress = req.body.fromAddress;
    const toAddress = req.body.toAddress;
    const privateKey = req.body.privateKey;
    const data = req.body.data;
    if(!network || network === '')
        return res.status(400).json({message: "Network is required"});
    if(!projectId || projectId === '')
        return res.status(400).json({message: "Infura project id is required"});
    if(!fromAddress || fromAddress === '')
        return res.status(400).json({message: "From address is required"});
    if(!toAddress || toAddress === '')
        return res.status(400).json({message: "To address is required"});
    if(!privateKey || privateKey === '')
        return res.status(400).json({message: "Private key is required"});

    const result = await createTransaction(network, projectId, fromAddress, toAddress, privateKey, data);
    res.status(200).json(result);
});

app.listen(8000);
