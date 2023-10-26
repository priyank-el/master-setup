import { Request, Response } from "express"
import { AppStrings } from "../../utils/appStrings";
import commonUtils from "../../utils/commonUtils";
import redisClient from "../../utils/redisHelper";
import Auth from "../../auth";
import { JwtPayload, TokenExpiredError, VerifyErrors } from "jsonwebtoken";
import { AdminTokenPayload, UserTokenPayload, UserTokenRole } from "../../auth/models";

const config = require("config")
const jwt = require('jsonwebtoken')

async function _verifyJwtToken(jwtToken: string, role: UserTokenRole | UserTokenRole[]): Promise<JwtPayload> {
    return new Promise<JwtPayload>((resolve, reject) => {
        jwt.verify(
            jwtToken,
            config.get("JWT_ACCESS_SECRET"),
            { audience: role },
            async (error: VerifyErrors, payload: JwtPayload) => {
                if (error) {
                    if (error instanceof TokenExpiredError) {
                        return reject(AppStrings.TOKEN_EXPIRED);
                    }
                }
                if (payload.sub) {
                    return resolve(payload)
                }
                return reject(AppStrings.INVALID_SESSION);
            })
    })
}

async function _verifyUserToken(authHeader: string, role: UserTokenRole | UserTokenRole[]): Promise<UserTokenPayload> {
    let tokens = authHeader.split(' ') ?? []
    if (tokens.length <= 1) {
        throw AppStrings.INVALID_TOKEN;
    }
    const token = tokens[1]
    return _verifyJwtToken(token, role)
        .then(async payload => {
            let decrypted = Auth.decryptPayload(payload.sub)
            let payloadData: UserTokenPayload = decrypted.data
            let data = await redisClient.get(payloadData.userId)

            if (data) {
                let parsedData = JSON.parse(data)
                let isValidToken = parsedData.accessToken.toString() == token.toString()
                    || parsedData.refreshToken.toString() == token.toString()
                if (isValidToken) return payloadData
            }

            throw AppStrings.INVALID_SESSION;
        })
}

async function verifyAccessToken(req: Request, res: Response, next: Function) {
    let token = req.headers?.authorization ?? "";

    return _verifyUserToken(token, UserTokenRole.accessToken)
        .then((decodedPayload) => {
            res.locals.payload = decodedPayload
            next();
        }).catch((err: any) => {
            return commonUtils.sendError(req, res, { message: err }, 401);
        })
}

async function verifyRefreshToken(req: Request, res: Response, next: Function) {
    let token = req.headers?.authorization ?? "";
    return _verifyUserToken(token, UserTokenRole.refreshToken)
        .then((decodedPayload) => {
            res.locals.payload = decodedPayload
            next();
        }).catch((err: any) => {
            return commonUtils.sendError(req, res, { message: err }, 401);
        })
}

async function verifyAuthToken(req: any, res: Response, next: Function) {
    let tokens = req.headers?.authorization?.split(' ') ?? []

    if (tokens.length <= 1) {
        return commonUtils.sendError(req, res, { message: AppStrings.INVALID_TOKEN }, 401);
    }
    const token = tokens[1]

    return _verifyJwtToken(token, [UserTokenRole.registerToken, UserTokenRole.resetPasswordToken, UserTokenRole.loginToken])
        .then(async payload => {
            let data = await Auth.getDataUsingPayload(payload.sub)
            if (data?.accessToken.toString() == token.toString()) {
                return { payload: payload.sub, data: data }
            }
            throw AppStrings.INVALID_SESSION;
        })
        .then((payloadData) => {
            res.locals.payload = payloadData
            next();
        }).catch((err: any) => {
            return commonUtils.sendError(req, res, { message: err }, 401);
        })
}

async function verifyAdminAccessToken(req: Request, res: Response, next: Function) {
    let tokens = req.headers?.authorization?.split(' ') ?? []
    if (tokens.length <= 1) {
        return commonUtils.sendError(req, res, { message: AppStrings.INVALID_TOKEN }, 401);
    }
    const token = tokens[1]
    return _verifyJwtToken(token, UserTokenRole.adminAccessToken)
        .then(async payload => {
            let decrypted = Auth.decryptPayload(payload.sub)
            let payloadData: AdminTokenPayload = decrypted.data

            let tokens: string[] = await redisClient.lrange(payloadData.userId, 0, -1)
            let index = tokens.findIndex(value => JSON.parse(value).accessToken.toString() == token)
            if (index > -1) return payloadData

            throw AppStrings.INVALID_SESSION;
        }).then((decodedPayload) => {
            res.locals.payload = decodedPayload
            next();
        }).catch((err: any) => {
            return commonUtils.sendError(req, res, { message: err }, 401);
        })
}

export default {
    verifyAccessToken,
    verifyRefreshToken,
    verifyAuthToken,
    verifyAdminAccessToken,
}
