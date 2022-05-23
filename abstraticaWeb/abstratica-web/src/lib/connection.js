import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

export const creator = new PublicKey(process.env.VUE_APP_CREATOR);
export const network = process.env.VUE_APP_NETWORK;
export const networkConnection = process.env.VUE_APP_CUSTOM_RPC
  ? new Connection(process.env.VUE_APP_CUSTOM_RPC)
  : new Connection(clusterApiUrl(network));
// export const networkConnection = new Connection("https://free.rpcpool.com");

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

export let TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
