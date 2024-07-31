import 'dotenv/config';

import { clusterApiUrl, Connection } from '@solana/web3.js';
import { getExplorerLink, getKeypairFromEnvironment } from '@solana-developers/helpers';
import { bundlrStorage, keypairIdentity, Metaplex, NftWithToken, toMetaplexFile } from '@metaplex-foundation/js';
import * as fs from 'fs';

interface NftData {
    name: string;
    symbol: string;
    description: string;
    sellerFeeBasisPoints: number;
    imageFile: string;
}

const COMMITMENT = 'confirmed';
const CLUSTER = 'devnet';
const SECRET_KEY_ENV_VARIABLE = 'SECRET_KEY';
const ADDRESS_TYPE = 'address';

const DEVNET_BUNDLR = 'https://devnet.bundlr.network';

const connection = new Connection(clusterApiUrl(CLUSTER), COMMITMENT);
const keypair = getKeypairFromEnvironment(SECRET_KEY_ENV_VARIABLE);

console.log(`Account: ${getExplorerLink(ADDRESS_TYPE, keypair.publicKey.toString(), CLUSTER)}`);

const main = async () => {
    const metaplex = new Metaplex(connection)
        .use(keypairIdentity(keypair))
        .use(bundlrStorage({ address: DEVNET_BUNDLR, providerUrl: connection.rpcEndpoint }));

    const nftData: NftData = {
        name: 'Solana Developer Program NFT',
        symbol: 'slnrg',
        description: 'Solana Developer Program NFT',
        sellerFeeBasisPoints: 0,
        imageFile: 'logo-comets.png',
    };

    const metadataURI = await uploadMetadata(metaplex, nftData);
    const nftDetails = await createNft(metaplex, metadataURI, nftData);

    console.log('Successfully created NFT', nftDetails.address);
};

const uploadMetadata = async (metaplex: Metaplex, nftData: NftData): Promise<string> => {
    console.log('Uploading metadata...');

    const buffer = fs.readFileSync(nftData.imageFile);
    const metaplexImage = toMetaplexFile(buffer, nftData.imageFile);
    const imageUri = await metaplex.storage().upload(metaplexImage);

    console.log(`Uploaded image: ${imageUri}`);

    const { uri } = await metaplex.nfts().uploadMetadata({
        name: nftData.name,
        symbol: nftData.symbol,
        description: nftData.description,
        image: imageUri,
    });

    console.log(`Successfully uploaded NFT metadata: ${uri}`);

    return uri;
};

const createNft = async (metaplex: Metaplex, metadataURI: string, nftData: NftData): Promise<NftWithToken> => {
    console.log('Creating NFT');

    const { nft } = await metaplex.nfts().create({
        uri: metadataURI,
        name: nftData.name,
        symbol: nftData.symbol,
        sellerFeeBasisPoints: nftData.sellerFeeBasisPoints,
    });

    console.log(`NFT address: ${getExplorerLink(ADDRESS_TYPE, nft.address.toString(), CLUSTER)}`);

    return nft;
};

main()
    .then(() => {
        console.log('Finished successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });