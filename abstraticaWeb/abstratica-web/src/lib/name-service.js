import { networkConnection } from "./connection";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import {
  getHandleAndRegistryKey,
  getHashedName,
  getNameAccountKey,
  NameRegistryState,
  NAME_PROGRAM_ID,
  getFilteredProgramAccounts,
} from "@solana/spl-name-service";

export const SolDomainExtention = "sol";
// Address of the SOL TLD
export const SOL_TLD_AUTHORITY = new PublicKey(
  "58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx"
);

export const PROGRAM_ID = new PublicKey(
  "jCebN34bUfdeUYJT13J1yG16XWQpt5PDx6Mse9GUqhR"
);

export async function getAllRegisteredInfo(wallet, twitterOnly = false) {
  return {
    twitter: await getTwitterHandle(wallet),
    domain: twitterOnly ? null : await getUserDomains(wallet),
  };
}
export async function getTwitterHandle(wallet) {
  try {
    const walletKey = new PublicKey(wallet);
    const reg = await getHandleAndRegistryKey(networkConnection, walletKey);

    if (!reg) return null;
    return `${reg[0]}`;
  } catch (e) {
    // console.log("unable to get Twittler handle");
  }
  return null;
}
export async function getUserDomains(wallet) {
  try {
    const walletKey = new PublicKey(wallet);
    const domains = await findOwnedNameAccountsForUser(walletKey);
    if (!domains || domains.length == 0) return null;
    // just take the first one
    const name = await performReverseLookup(networkConnection, domains[0]);
    if (!name) return null;
    return `${name}.${SolDomainExtention}`;
  } catch (e) {
    // console.log(e);
    // console.log("unable to get domain handle");
  }
  return null;
}

export async function performReverseLookup(connection, nameAccount) {
  let [centralState] = await PublicKey.findProgramAddress(
    [PROGRAM_ID.toBuffer()],
    PROGRAM_ID
  );
  let hashedReverseLookup = await getHashedName(nameAccount.toBase58());
  let reverseLookupAccount = await getNameAccountKey(
    hashedReverseLookup,
    centralState
  );

  let name = await NameRegistryState.retrieve(connection, reverseLookupAccount);
  if (!name.data) {
    throw new Error("Could not retrieve name data");
  }
  let nameLength = new BN(name.data.slice(0, 4), "le").toNumber();
  return name.data.slice(4, 4 + nameLength).toString();
}

async function findOwnedNameAccountsForUser(userAccount) {
  const filters = [
    {
      memcmp: {
        offset: 32,
        bytes: userAccount.toBase58(),
      },
    },
  ];
  const accounts = await getFilteredProgramAccounts(
    networkConnection,
    NAME_PROGRAM_ID,
    filters
  );
  return accounts.map((a) => a.publicKey);
}
