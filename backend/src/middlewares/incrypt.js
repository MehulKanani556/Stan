import CryptoJS from 'crypto-js';

const FIXED_IV = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');
const SECRET_KEY = CryptoJS.enc.Utf8.parse(process.env.SECRET_KEY);


export const encryptData = (data) => {
    const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY, {
        iv: FIXED_IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString();

}

export const decryptData = (ciphertext) => {
    if (!ciphertext) return "";
    try {
        const decrypted = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY, {
            iv: FIXED_IV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

        return plaintext || "";
    } catch (e) {
        return "";
    }
}
