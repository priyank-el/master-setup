import aes from "../utils/aes";
import redisClient from "../utils/redisHelper";

import * as Jwt from 'jsonwebtoken';
import { AdminTokenPayload, UserTokenPayload, UserTokenRole } from "./models";

const config = require("config");

const _generateAccessToken = async (payload: string, role: UserTokenRole | UserTokenRole[]) => {
    return Jwt.sign({ sub: payload, aud: role }, config.get("JWT_ACCESS_SECRET"), { expiresIn: config.get("JWT_ACCESS_TIME") });
}

const _generateRefreshToken = async (payload: string) => {
    return Jwt.sign({ sub: payload, aud: UserTokenRole.refreshToken }, config.get("JWT_ACCESS_SECRET"), { expiresIn: config.get("JWT_REFRESH_TIME") });
}

const encryptPayload = (data: object) => {
    let encryptedData = aes.encrypt(JSON.stringify(data), config.get("OUTER_KEY_USER"))
    let payload = aes.encrypt(encryptedData, config.get("OUTER_KEY_PAYLOAD"))
    return { data: encryptedData, payload: payload }
}

const decryptPayload = (payload: string) => {
    let decryptedPayload = aes.decrypt(payload, config.get("OUTER_KEY_PAYLOAD"))
    let decryptedData = aes.decrypt(decryptedPayload, config.get("OUTER_KEY_USER"))
    return { data: JSON.parse(decryptedData), decryptedPayload }
}

const generateUserAccessToken = async (payload: UserTokenPayload) => {
    let encryptPayloadData = encryptPayload(payload)
    const accessToken = await _generateAccessToken(encryptPayloadData.payload, UserTokenRole.accessToken);
    const refreshToken = await _generateRefreshToken(encryptPayloadData.payload);

    let data = { accessToken, refreshToken };
    await redisClient.set(payload.userId, JSON.stringify(data));
    return data;
}

const deleteAccessToken = async (userId: string) => {
    await redisClient.del(userId);
}

const login = async (userId: string, pushToken: string | undefined, otp: any) => {
    let encryptedPayload = encryptPayload({ userId: userId, type: UserTokenRole.loginToken })

    const accessToken = await _generateAccessToken(encryptedPayload.payload, UserTokenRole.loginToken);
    await redisClient.set(encryptedPayload.data, JSON.stringify({
        createdAt: Date.now(),
        userId: userId,
        pushToken: pushToken,
        accessToken: accessToken,
        otp: otp,
        verify: false,
        type: UserTokenRole.loginToken,
    }));
    return { accessToken };
}

const register = async (user_data: any, otp: any) => {
    let encryptedPayload = encryptPayload({ email: user_data.email, type: UserTokenRole.registerToken })

    const accessToken = await _generateAccessToken(encryptedPayload.payload, UserTokenRole.registerToken);
    await redisClient.set(encryptedPayload.data, JSON.stringify({
        createdAt: Date.now(),
        accessToken: accessToken,
        userData: user_data,
        otp: otp,
        verify: false,
        type: UserTokenRole.registerToken,
    }));
    return { accessToken };
}

const forgetPassword = async (userId: string, otp: any) => {
    let encryptedPayload = encryptPayload({ userId: userId, type: UserTokenRole.resetPasswordToken })

    const accessToken = await _generateAccessToken(encryptedPayload.payload, UserTokenRole.resetPasswordToken);
    await redisClient.set(encryptedPayload.data, JSON.stringify({
        createdAt: Date.now(),
        userId: userId,
        accessToken: accessToken,
        otp: otp,
        verify: false,
        type: UserTokenRole.resetPasswordToken,
    }));
    return { accessToken };
}

const getDataUsingPayload = async (payload: string) => {
    let decrypted = decryptPayload(payload)
    let data = await redisClient.get(decrypted.decryptedPayload);
    if (data) return JSON.parse(data)
}

const removeDataUsingPayload = async (payload: string) => {
    let decrypted = decryptPayload(payload)
    await redisClient.del(decrypted.decryptedPayload);
}

const updateDataUsingPayload = async (payload: string, updateData: object) => {
    let decrypted = decryptPayload(payload)
    let data = await redisClient.get(decrypted.decryptedPayload);
    if (!data) {
        throw Error('Verification data not found!')
    }

    let updatedData = {
        ...JSON.parse(data),
        ...updateData,
    }
    await redisClient.set(decrypted.decryptedPayload, JSON.stringify(updatedData));
}

const generateAdminAccessToken = async (payload: AdminTokenPayload) => {
    let encryptPayloadData = encryptPayload(payload)
    const accessToken = await _generateAccessToken(encryptPayloadData.payload, UserTokenRole.adminAccessToken);
    const refreshToken = await _generateAccessToken(encryptPayloadData.payload, UserTokenRole.adminAccessToken);
    const data = { accessToken, refreshToken }
    await redisClient.lpush(payload.userId, JSON.stringify(data))
    return data;
}

const adminLogout = async (userId: string, accessToken: string) => {
    try {
        let tokens: string[] = await redisClient.lrange(userId, 0, -1);
        let index = tokens.findIndex(value => JSON.parse(value).accessToken.toString() === accessToken);

        if (index > -1) {
            const element = tokens[index];
            if (element) {
                await redisClient.lrem(userId, 1, element);
            }
        }
    } catch (error) {
        console.error('Error occurred:', error);
    }
};


export default {
    encryptPayload,
    decryptPayload,
    generateUserAccessToken,
    getDataUsingPayload,
    updateDataUsingPayload,
    removeDataUsingPayload,
    deleteAccessToken,
    login,
    register,
    forgetPassword,
    generateAdminAccessToken,
    adminLogout,
}
