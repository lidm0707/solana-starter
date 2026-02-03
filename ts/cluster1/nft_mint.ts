import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import "dotenv/config";

import {
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import fs from "fs";

import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
const walletPath = process.env.SOLANA_WALLET;
if (!walletPath) {
  throw new Error("SOLANA_WALLET not set");
}
const wallet = JSON.parse(fs.readFileSync(walletPath, "utf-8"));
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());

const mint = generateSigner(umi);

(async () => {
  //https://gateway.irys.xyz/Cvr7TPEFjMeMcaGYe5cKRHt4BZkAkSmiFrh7Wz82QAy1
  let tx = createNft(umi, {
    mint,
    name: "MMMMMMMMMMMMMMMMMMMv2",
    symbol: "M&2",
    uri: "https://gateway.irys.xyz/FfVfA1MVtY9m7gfSATG9KWDDJRcMLHq6GphnzmAddrSt",
    sellerFeeBasisPoints: percentAmount(10),
  });
  let result = await tx.sendAndConfirm(umi);
  const signature = base58.encode(result.signature);

  console.log(
    `Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`,
  );

  console.log("Mint Address: ", mint.publicKey);
})();
