import { getExplorerLink, getKeypairFromEnvironment } from '@solana-developers/helpers';
import { createMemoInstruction } from '@solana/spl-memo';
import {
    clusterApiUrl,
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
} from '@solana/web3.js';
import 'dotenv/config';

const CLUSTER = "devnet";
const SECRET_KEY_ENV_VARIABLE = "SECRET_KEY";
const ADDRESS_TYPE = "address";
const TRANSACTION_TYPE = "transaction";

const TRANSFER_AMOUNT = 0.05 * LAMPORTS_PER_SOL;

const RECIPIENT_ADDRESS = "3gCH9PVy4M76F9gMZbQ4P3NdBdEZYiSfTbKtM1fiDNSC";

const main = async () => {

    const connection = new Connection(clusterApiUrl(CLUSTER));
    const sender = getKeypairFromEnvironment(SECRET_KEY_ENV_VARIABLE);
    const recipient = new PublicKey(RECIPIENT_ADDRESS);

    console.log(`Explorer link: ${getExplorerLink(ADDRESS_TYPE, sender.publicKey.toString(), CLUSTER)}`);

    const transaction = new Transaction();

    const transferInstruction = SystemProgram.transfer({
        fromPubkey: sender.publicKey,
        toPubkey: recipient,
        lamports: TRANSFER_AMOUNT,
    });

    transaction.add(transferInstruction);

    const memoInstruction = createMemoInstruction("Test message");

    transaction.add(memoInstruction);

    const transferTxSig = await sendAndConfirmTransaction(connection, transaction, [sender]);

    console.log(`Transfer transaction: ${getExplorerLink(TRANSACTION_TYPE, transferTxSig.toString(), CLUSTER)}`)

}

main()