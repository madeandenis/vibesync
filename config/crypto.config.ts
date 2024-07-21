import { config } from 'dotenv';
config();

interface ICryptoConfig {
    crypto_key: string
    crypto_iv: string
}

const CryptoConfig: ICryptoConfig = {
    crypto_key: process.env.CRYPTO_KEY!,
    crypto_iv: process.env.CRYPTO_IV!
};

export default CryptoConfig;
