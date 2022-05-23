import { Keypair, SystemProgram } from "@solana/web3.js";

/**
 * craft NFT mint request transaction
 * @param {Connection} connection connection
 * @param {PublicKey} buyerKey
 * @param {PublicKey} adminKey
 * @param {Number} lamports price in lamports
 */
export async function createMintRequestTranscation(
  connection,
  buyerKey,
  adminKey,
  lamports
) {
  const newNonceAccount = Keypair.generate();

  const createNonceAccountParams = {
    authorizedPubkey: adminKey,
    fromPubkey: buyerKey,
    lamports: lamports,
    noncePubkey: newNonceAccount.publicKey,
  };

  const transaction = SystemProgram.createNonceAccount(
    createNonceAccountParams
  );

  // add small SOL ix to admin to find this transaction by getConfirmedSignaturesForAddress
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: buyerKey,
      lamports: 1000,
      toPubkey: adminKey,
    })
  );
  transaction.feePayer = buyerKey;
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash("max")
  ).blockhash;
  transaction.partialSign(newNonceAccount);
  // to be signed
  return transaction;
}
