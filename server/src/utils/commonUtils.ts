import { AppConstants } from "./appConstants";
import { NextFunction, Request, Response } from "express";
import encryptedData from "../middlewares/secure/encryptData";
import { FileFilterCallback } from 'multer'
import decryptedData from "../middlewares/secure/decryptData";
import verifyToken from "../middlewares/validations";
import otpGenerator from 'otp-generator';
const AreaCode = require("../components/location/models/areaModel");

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void
import moment = require("moment");
import multer = require("multer");
const config = require("config");

const path = require('path')
const os = require('os')
const md5 = require("md5");

const fs = require("fs");
const crypto = require('crypto');

const getRootDir = () => path.parse(process.cwd()).root
const getHomeDir = () => os.homedir()
const getPubDir = () => "./public"


function formatDate(date: moment.MomentInput) {
    return moment(date).format(AppConstants.DATE_FORMAT)
}

async function sendSuccess(req: Request, res: Response, data: any, statusCode = 200) {
    if (req.headers.env === "test") {
        return res.status(statusCode).json(data)
    }

    let encData = await encryptedData.EncryptedData(req, res, data)
    return res.status(statusCode).send(encData)
}

async function sendAdminSuccess(req: Request, res: Response, data: any, statusCode = 200) {
    return res.status(statusCode).send(data)
}

async function sendAdminError(req: Request, res: Response, data: any, statusCode = 422) {
    return res.status(statusCode).send(data)
}

async function sendError(req: Request, res: Response, data: any, statusCode = 422) {
    // if (req.headers.env === "test") {
    //     return res.status(statusCode).send(data)
    // }

    // let encData = await encryptedData.EncryptedData(req, res, data)
    return res.status(statusCode).send(data)
}

function getCurrentUTC(format = AppConstants.DATE_FORMAT, addMonth: any = null, addSeconds: number = 0) {
    // console.log(moment.utc(new Date()).format("YYYY-MM-DD HH:mm:ss"));
    if (addMonth != null) {
        return moment.utc(new Date()).add(addMonth, 'M').format(format);
    } else if (addSeconds > 0) {
        return moment.utc(new Date()).add(addSeconds, 'seconds').format(format);
    } else {
        return moment.utc(new Date()).add().format(format);
    }
}

function formattedErrors(err: any) {
    let transformed: any = {};
    Object.keys(err).forEach(function (key, val) {
        transformed[key] = err[key][0];
    })
    return transformed
}

export const fileStorage = multer.diskStorage({
    destination: (request: Request, file: any, callback: DestinationCallback): void => {
        callback(null, './src/uploads/images')
    },

    filename: (req: Request, file: any, callback: FileNameCallback): void => {
        callback(null, md5(file.originalname) + '-' + Date.now() + path.extname(file.originalname))
    }
})
export const categoryFileStorage = multer.diskStorage({
    destination: (request: Request, file: any, callback: DestinationCallback): void => {
        callback(null, './uploads/category')
    },

    filename: (req: Request, file: any, callback: FileNameCallback): void => {
        callback(null, md5(file.originalname) + '-' + Date.now() + path.extname(file.originalname))
    }
})

export const fileFilter = (request: Request, file: any, callback: FileFilterCallback): void => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/webp' ||
        file.mimetype === 'image/svg+xml'
    ) {
        callback(null, true)
    } else {
        // callback(null, false)
        callback(new Error('Only .png, .jpg and .jpeg .webp .svg format allowed!'));

    }
}

const uploadImage = (req: Request, res: Response, next: NextFunction) => {
    const upload = multer({
        storage: fileStorage,
        fileFilter: fileFilter
    }).single('image')

    upload(req, res, (err: any) => {
        if (err) {
            return sendError(req, res, err)
        }
        next()
    })
}

const routeArray = (array_: any, prefix: any, isAdmin: Boolean = false) => {
    // path: "", method: "post", controller: "",validation: ""(can be array of validation),
    // isEncrypt: boolean (default true), isPublic: boolean (default false)
    console.log("comin inside");
    isAdmin = false
    array_.forEach((route: any) => {
        const method = route.method as "get" | "post" | "put" | "delete" | "patch";
        const path = route.path;
        const controller = route.controller;
        const validation = route.validation;
        let middlewares = [];
        const isEncrypt = route.isEncrypt === undefined ? false : route.isEncrypt;
        const isPublic = route.isPublic === undefined ? false : route.isPublic;
        if (isEncrypt) {
            middlewares.push(decryptedData.DecryptedData);
        }
        if (!isPublic) {
            if (isAdmin) {
                // middlewares.push(route.authMiddleware ?? verifyToken.verifyAdminAccessToken);
            } else {
                middlewares.push(route.authMiddleware ?? verifyToken.verifyAccessToken);
            }
        }
        if (validation) {
            if (Array.isArray(validation)) {
                middlewares.push(...validation);
            } else {
                middlewares.push(validation);
            }
        }
        middlewares.push(controller);
        prefix[method](path, ...middlewares);
    })

    return prefix;
}
export const deleteSingleFile = async (file: any, filepath: string) => {
    try {
        const filename = path.basename(file);
        //filepath = 'uploads/images/'
        if (fs.existsSync(filepath + filename) && filename != '') {
            await fs.unlinkSync(filepath + filename);
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log("unlink single file : ", e);
        return false;
    }
}
export const deleteMultipleFile = async (files: any, location: any) => {
    await Promise.all(
        files.map(async (file: any) => {
            try {
                const filename = path.basename(file);
                if (fs.existsSync(location + filename) && filename != '') {
                    await fs.unlinkSync(location + filename);
                    return true;
                } else {
                    return false;
                }
            } catch (e) {

            }
        })
    )

}
export const fileStoragePdf = multer.diskStorage({
    destination: (request: Request, file: Express.Multer.File, callback: DestinationCallback): void => {
        callback(null, './uploads')
    },

    filename: (req: Request, file: Express.Multer.File, callback: FileNameCallback): void => {
        // if(destination=="./uploads"){callback(null, "logo"+ path.extname(file.originalname))}
        callback(null, file.originalname + path.extname(file.originalname))
    }
})
export const commonFileStorage = (destination: any) => multer.diskStorage({
    destination: (request: Request, file: any, callback: DestinationCallback): void => {
        callback(null, destination)
    },

    filename: (req: Request, file: any, callback: FileNameCallback): void => {
        if (destination == "./uploads/images") {
            callback(null, "logo" + path.extname(file.originalname))
        }
        callback(null, md5(file.originalname) + '-' + Date.now() + path.extname(file.originalname))
    }
})

export const fileFilterPdf = (request: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
    if (
        file.mimetype === 'application/pdf'
    ) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}

async function generateRandomString(length: number) {
    const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
    return randomBytes.toString('hex').slice(0, length);
}


function generateOtpCode() {
    const otp: string = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
    })
    return otp
}

async function getAreaCodesStateCity(code: any) {
    const areaData = await AreaCode.findOne({ area_code: Number(code) });
    return areaData?.area_name;
}

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
}

function formatConversation(conversation: any) {
    return {
        chatId: conversation.chatId,
        receiverId: conversation.receiverId,
        senderId: conversation.senderId,
        type: conversation.type,
        lastMessage: conversation.messages.length > 0 ? conversation.messages[0].message : null,
        lastMessageCreatedAt: conversation.messages.length > 0 ? conversation.messages[0].createdAt : null,
    };
}

async function base64toFile(base64String: string, filePath: string, callback: any) {
    const base64Data = base64String.replace(/^data:[A-Za-z-+/]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const folderPath = path.dirname(filePath);
    fs.mkdirSync(folderPath, { recursive: true });
    fs.writeFile(filePath, buffer, (error: any) => {
        if (error) {
            callback(error);
        } else {
            callback(null, filePath);
        }
    });
}

function ticketNumGenrate() {
    return Number((Math.random() * (9999999999 - 1000000000) + 1000000000).toFixed());
}

export default {
    getCurrentUTC,
    sendSuccess,
    sendError,
    formattedErrors,
    getRootDir,
    getHomeDir,
    getPubDir,
    formatDate,
    uploadImage,
    routeArray,
    sendAdminSuccess,
    sendAdminError,
    deleteSingleFile,
    deleteMultipleFile,
    categoryFileStorage,
    commonFileStorage,
    fileStoragePdf,
    fileFilterPdf,
    generateRandomString,
    generateOtpCode,
    uuidv4,
    formatConversation,
    base64toFile,
    ticketNumGenrate,
    getAreaCodesStateCity
}
