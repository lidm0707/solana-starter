import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint } from "@solana/spl-token";
import fs from "fs";
import "dotenv/config";
const walletPath = process.env.SOLANA_WALLET;
if (!walletPath) {
  throw new Error("SOLANA_WALLET not set");
}
const wallet = JSON.parse(fs.readFileSync(walletPath, "utf-8"));
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
  try {
    // Start here
    const mint = await createMint(
      connection,
      keypair,
      keypair.publicKey,
      null,
      6,
    );
    console.log(`Successfully created a mint ${mint}`);
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
