import { programIds } from "./ids.js";
import { PublicKey } from "@solana/web3.js";
import { deserializeUnchecked } from "borsh";
import { METADATA_SCHEMA, Metadata } from "./datalayout.js";
import { networkConnection, creator } from "../connection";

export const METADATA_PREFIX = "metadata";

export async function getNFTOwner(metadata) {
  const { name, uri, mint, symbol, royalties } = await getMetadata(
    networkConnection,
    metadata
  );

  const holders = await networkConnection.getTokenLargestAccounts(mint);
  if (!holders || holders.value.length < 1) {
    throw new Error("invalid mint");
  }
  const { address: splAccount } = holders.value[0];

  const parsedAccountInfo = await networkConnection.getParsedAccountInfo(
    splAccount
  );
  return {
    nftOwner: parsedAccountInfo?.value?.data?.parsed?.info?.owner,
    name,
    uri,
    mint: mint.toBase58(),
    symbol,
    royalties: royalties,
  };
}

export async function getMetadata(connection, publicKey) {
  publicKey = typeof publicKey == Object ? publicKey : new PublicKey(publicKey);
  const accountData = await connection.getAccountInfo(publicKey);
  if (accountData?.owner?.toBase58() !== programIds().metadata.toBase58())
    // throw new Error("Account is not owned by Metadata program");
    return null;

  const decoded = decodeMetadata(accountData.data);
  // do not display other NFT
  if (decoded.updateAuthority.toBase58() !== creator.toBase58()) return null;
  return {
    metadata: publicKey,
    name: decoded.data.name,
    uri: decoded.data.uri,
    mint: decoded.mint,
    symbol: decoded.data.symbol,
    royalties: decoded.data.sellerFeeBasisPoints,
  };
}

export async function getMetadataByMint(tokenMint) {
  const mint =
    typeof tokenMint === "string" ? new PublicKey(tokenMint) : tokenMint;

  return await getMetadata(networkConnection, await getMetadataAccount(mint));
}

/**
 * Get metadata account address derived from Metadata program and token mint address
 * @param {PublicKey} tokenMint token mint address
 * @returns {PublicKey} derived metadata account address
 */
async function getMetadataAccount(tokenMint) {
  const PROGRAM_IDS = programIds();

  return (
    await findProgramAddress(
      [
        Buffer.from(METADATA_PREFIX),
        PROGRAM_IDS.metadata.toBuffer(),
        tokenMint.toBuffer(),
      ],
      PROGRAM_IDS.metadata
    )
  )[0];
}

/**
 * Decode encoded metadata
 * @param {Buffer} buffer
 * @returns {Metadata} decoded metadata
 */
export const decodeMetadata = (buffer) => {
  const metadata = deserializeUnchecked(METADATA_SCHEMA, Metadata, buffer);
  return metadata;
};

const findProgramAddress = async (seeds, programId) => {
  const key =
    "pda-" +
    seeds.reduce((agg, item) => agg + item.toString("hex"), "") +
    programId.toString();
  let cached = localStorage.getItem(key);
  if (cached) {
    const value = JSON.parse(cached);

    return [new PublicKey(value.key), parseInt(value.nonce)];
  }

  const result = await PublicKey.findProgramAddress(seeds, programId);

  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        key: result[0].toBase58(),
        nonce: result[1],
      })
    );
  } catch {
    // ignore
  }

  return result;
};
