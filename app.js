import express from 'express';
import bodyParser from 'body-parser';
import {createTransaction} from "./send.js";


const app = express();
import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: 'user-service'},
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'combined.log'}),
    ],
});

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post('/create', async (req, res) => {
    const network = req.body.network;
    const projectId = req.body.project;
    const fromAddress = req.body.from;
    const toAddress = req.body.to;
    const privateKey = req.body.key;
    const data = req.body.data;
    if (!network || network === '')
        return res.status(400).json({message: "Network is required"});
    if (!projectId || projectId === '')
        return res.status(400).json({message: "Infura project id is required"});
    if (!fromAddress || fromAddress === '')
        return res.status(400).json({message: "From address is required"});
    if (!toAddress || toAddress === '')
        return res.status(400).json({message: "To address is required"});
    if (!privateKey || privateKey === '')
        return res.status(400).json({message: "Private key is required"});

    try {
        return await performCall(network, projectId, fromAddress, toAddress, privateKey, data, false, res);
    } catch (e) {
        console.log("caught first error: " + e);
        try {
            console.log("trying again...");
            return await performCall(network, projectId, fromAddress, toAddress, privateKey, data, true, res);
        } catch (err) {
            console.log("caught second error: " + err);
            logger.log({
                level: 'error',
                message: 'Transaction error. data: ' + data + ' Message: ' + err.toString()
            });
            return res.status(500).json({message: err.toString()});
        }
    }

});


async function performCall(network, projectId, fromAddress, toAddress, privateKey, data, shouldAddToGas, res) {

    logger.log({
        level: 'info',
        message: 'New transaction request. data: ' + data
    });
    const result = await createTransaction(network, projectId, fromAddress, toAddress, privateKey, data, shouldAddToGas);
    res.status(200).json(result);
    logger.log({
        level: 'info',
        message: 'Transaction completed successfully. data: ' + data
    });

}

app.listen(8000);
