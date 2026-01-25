import {
  Commitment,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";

import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import fs from "fs";
import "dotenv/config";
const walletPath = process.env.SOLANA_WALLET;
if (!walletPath) {
  throw new Error("SOLANA_WALLET not set");
}
const wallet = JSON.parse(fs.readFileSync(walletPath, "utf-8"));
// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("BtSHMurnijBHbQtEReLKNCVm79mS4zuji3FtyktpcCK8");

// Recipient address
const to = new PublicKey("FdUzBqV6nCKgmeLm4XLRt2Sdj38iE5Uz6RaXofqYrhd");

(async () => {
  try {
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey,
    );

    // Get the token account of the toWallet address, and if it does not exist, create it
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to,
    );

    // Transfer the new token to the "toTokenAccount" we just created
    await transfer(
      connection,
      keypair,
      fromTokenAccount.address,
      toTokenAccount.address,
      keypair.publicKey,
      1000000,
    );
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
