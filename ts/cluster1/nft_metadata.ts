import "dotenv/config";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
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
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure
    const image =
      "https://gateway.irys.xyz/DUjGSXAsNwTSyMDeSJSdrDCWKxrr9ktTxMdYB2pVSA9t";
    const metadata = {
      name: "MMMMMMMMMMMMMMMMMMMM",
      symbol: "?",
      description: "?",
      image: image,
      attributes: [{ trait_type: "?", value: "?" }],
      properties: {
        files: [
          {
            type: "image/png",
            uri: "?",
          },
        ],
      },
      creators: [],
    };

    const metadataFile = createGenericFile(
      Buffer.from(JSON.stringify(metadata)),
      "metadata.json",
      { contentType: "application/json" },
    );

    const myUri = await umi.uploader.upload([metadataFile]);
    //  'https://gateway.irys.xyz/7FdYTKCSJRFAy3g42veyAPaUjMVhQHzDn9gjxrmnZoCJ'

    console.log("Your metadata URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
