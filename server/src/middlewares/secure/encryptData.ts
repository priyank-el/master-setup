import { Request, Response } from "express"
import crypto = require("crypto");

const config = require("config")

const API_KEY_ENC = config.get("API_KEY_ENC")
const API_ENCRYPT_VI_KEY = config.get("API_ENCRYPT_VI_KEY")

async function encryptedDataResponse(data: any) {
    console.log("object");
    const cipher = crypto.createCipheriv("aes-256-cbc", API_KEY_ENC, API_ENCRYPT_VI_KEY);
    const message = JSON.stringify(data);
    let encryptedData = cipher.update(message, "utf-8", "base64");
    encryptedData += cipher.final("base64");

    const mac = crypto.createHmac('sha256', API_KEY_ENC)
        .update(Buffer.from(Buffer.from(API_ENCRYPT_VI_KEY).toString("base64") + encryptedData, "utf-8").toString())
        .digest('hex');

    return {
        'mac': mac,
        'value': encryptedData
    };
}

async function EncryptData(req: Request, res: Response, data: any) {
    return await encryptedDataResponse(data);
}

async function encryptedDataRequest(req: Request, res: Response, next: any) {
    const data = req.body;
    const API_KEY_ENC = req.query.API_KEY_ENC as string
    const API_ENCRYPT_VI_KEY = req.query.API_ENCRYPT_VI_KEY as string

    if (!API_KEY_ENC || !API_ENCRYPT_VI_KEY) {
        return res.status(400).send({
            message: "API_KEY_ENC and API_ENCRYPT_VI_KEY are required"
        })
    }

    try {
        const cipher = crypto.createCipheriv("aes-256-cbc", API_KEY_ENC.trim(), API_ENCRYPT_VI_KEY.trim());
        const message = JSON.stringify(data);
        let encryptedData = cipher.update(message, "utf-8", "base64");
        encryptedData += cipher.final("base64");

        const mac = crypto.createHmac('sha256', API_KEY_ENC)
            .update(Buffer.from(Buffer.from(API_ENCRYPT_VI_KEY).toString("base64") + encryptedData, "utf-8").toString())
            .digest('hex');
        return res.status(200).send({
            'mac': mac,
            'value': encryptedData
        })
    } catch (error) {
        return error;
    }
}


export default {
    EncryptedData: EncryptData,
    encryptedDataResponse: encryptedDataResponse,
    encryptedDataRequest: encryptedDataRequest
}
