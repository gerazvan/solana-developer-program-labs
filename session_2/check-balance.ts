import 'dotenv/config';

import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';
import { airdropIfRequired, getKeypairFromEnvironment } from '@solana-developers/helpers';
import bs58 from 'bs58';

const connection = new Connection(clusterApiUrl('devnet'));

console.log({
    url: connection.rpcEndpoint,
});

const keypair = getKeypairFromEnvironment('SECRET_KEY');

let publicKey = keypair.publicKey;
console.log({
    keypair: bs58.encode(keypair.secretKey),
    publicKey: publicKey.toBase58(),
});

const requestAirdrop = async () => {
    await airdropIfRequired(connection, publicKey, 2 * LAMPORTS_PER_SOL, 0.5 * LAMPORTS_PER_SOL);
};

const main = async () => {
    // await requestAirdrop();
    const balance = await connection.getBalance(publicKey);
    const balanceInSol = balance / LAMPORTS_PER_SOL;
    console.log({
        balance,
        balanceInSol,
    });
};

main().then(() => console.log('✅ Finished!'));