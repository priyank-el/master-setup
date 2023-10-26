var crypto = require('crypto');

var PKCS7Encoder = {};

const PKCS7Encoder_decode = function (text: any) {
    var pad = text[text.length - 1];

    if (pad < 1 || pad > 16) {
        pad = 0;
    }

    return text.slice(0, text.length - pad);
};

const PKCS7Encoder_encode = function (text: any) {
    var blockSize = 16;
    var textLength = text.length;

    var amountToPad = blockSize - (textLength % blockSize);

    var result = new Buffer(amountToPad);
    result.fill(amountToPad);

    return Buffer.concat([text, result]);
};

function generateString(length: any) {
    if (length === 0) {
        throw new Error('Zero-length randomString is useless.');
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789';
    let objectId = '';
    const bytes = crypto.randomBytes(length);

    for (let i = 0; i < bytes.length; ++i) {
        objectId += chars[bytes.readUInt8(i) % chars.length];
    }

    return objectId;
}

const encrypt = function (text: string, key: any) {
    key = key.split("-").join("").trim()
    const encoded = PKCS7Encoder_encode(Buffer.from(text));
    const iv = generateString(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    cipher.setAutoPadding(false);
    const cipheredMsg = Buffer.concat([cipher.update(encoded), cipher.final()]);
    return iv + cipheredMsg.toString('base64');
};

const decrypt = function (text: string, key: any) {
    const iv = text.toString().substring(0, 16);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    decipher.setAutoPadding(false);
    let deciphered = Buffer.concat([decipher.update(text.replace(iv.toString(), ""), 'base64'), decipher.final()]);
    deciphered = PKCS7Encoder_decode(deciphered);
    return deciphered.toString();
};

export default {
    decrypt,
    encrypt,
    PKCS7Encoder_encode,
    PKCS7Encoder_decode
}
