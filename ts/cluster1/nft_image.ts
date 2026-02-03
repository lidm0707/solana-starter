import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import "dotenv/config";

import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";
import fs from "fs";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");
const walletPath = process.env.SOLANA_WALLET;
if (!walletPath) {
  throw new Error("SOLANA_WALLET not set");
}
const wallet = JSON.parse(fs.readFileSync(walletPath, "utf-8"));
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    //1. Load image
    //2. Convert image to generic file.
    //3. Upload image
    //Your image URI:  https://gateway.irys.xyz/DUjGSXAsNwTSyMDeSJSdrDCWKxrr9ktTxMdYB2pVSA9t

    const imageBuffer = await readFile("../assets/generug.png");
    const image = createGenericFile(imageBuffer, "generug.png", {
      contentType: "image/png",
    });

    const [myUri] = await umi.uploader.upload([image]);
    console.log("Your image URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
