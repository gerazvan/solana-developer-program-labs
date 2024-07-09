import 'dotenv/config';

import {clusterApiUrl, Connection} from '@solana/web3.js';
import {getExplorerLink, getKeypairFromEnvironment} from '@solana-developers/helpers';
import {createMint} from "@solana/spl-token";

const COMMITMENT = "confirmed";
const CLUSTER = "devnet";
const SECRET_KEY_ENV_VARIABLE = "SECRET_KEY";
const ADDRESS_TYPE = "address";

const connection = new Connection(clusterApiUrl(CLUSTER), COMMITMENT);
const keypair = getKeypairFromEnvironment(SECRET_KEY_ENV_VARIABLE);

const main = async () => {

    console.log(`Account: ${getExplorerLink(ADDRESS_TYPE, keypair.publicKey.toString(), CLUSTER)}`);

    const tokenMint = await createMint(
        connection,
        keypair,
        keypair.publicKey,
        null,
        9,
    );

    console.log(`Token mint: ${getExplorerLink(ADDRESS_TYPE, tokenMint.toString(), CLUSTER)}`);

}

main()