import { networkConnection, creator } from "../connection";
import { programIds } from "./ids.js";
import {
  MAX_CREATOR_LEN,
  MAX_NAME_LENGTH,
  MAX_SYMBOL_LENGTH,
  MAX_URI_LENGTH,
} from "./data-specs.js";
import { decodeMetadata } from "./metadata";
import { MetadataKey } from "./datalayout.js";

export async function loadAbsOptimized() {
  const filter = {
    filters: [
      {
        memcmp: {
          offset:
            1 + // key
            32 + // update auth
            32 + // mint
            4 + // name string length
            MAX_NAME_LENGTH + // name
            4 + // uri string length
            MAX_URI_LENGTH + // uri
            4 + // symbol string length
            MAX_SYMBOL_LENGTH + // symbol
            2 + // seller fee basis points
            1 + // whether or not there is a creators vec
            4 + // creators vec length
            0 * MAX_CREATOR_LEN,
          bytes: creator.toBase58(),
        },
      },
    ],
  };

  const decodedMeta = (
    await getProgramAccountsOptimized(programIds().metadata, filter)
  )
    .filter(
      (a) =>
        a.account.data[0] === MetadataKey.MetadataV1Key &&
        a.account.owner === programIds().metadata.toBase58()
    )
    .map((m) => {
      return {
        decodedData: decodeMetadata(m.account.data),
        metadata: m.pubkey,
      };
    });
  return decodedMeta;
}

// connection: Connection,
// programId: StringPublicKey,
// configOrCommitment?: any,

async function getProgramAccountsOptimized(programId, configOrCommitment) {
  const extra = {};
  let commitment;
  //   let encoding;

  if (configOrCommitment) {
    if (typeof configOrCommitment === "string") {
      commitment = configOrCommitment;
    } else {
      commitment = configOrCommitment.commitment;
      //   encoding = configOrCommitment.encoding;

      if (configOrCommitment.dataSlice) {
        extra.dataSlice = configOrCommitment.dataSlice;
      }

      if (configOrCommitment.filters) {
        extra.filters = configOrCommitment.filters;
      }
    }
  }

  const args = networkConnection._buildArgs(
    [programId.toBase58()],
    commitment,
    "base64",
    extra
  );
  const unsafeRes = await networkConnection._rpcRequest(
    "getProgramAccounts",
    args
  );
  //   console.log(unsafeRes);
  const data = unsafeRes.result.map((item) => {
    return {
      account: {
        // TODO: possible delay parsing could be added here
        data: Buffer.from(item.account.data[0], "base64"),
        executable: item.account.executable,
        lamports: item.account.lamports,
        // TODO: maybe we can do it in lazy way? or just use string
        owner: item.account.owner,
      },
      pubkey: item.pubkey,
    };
  });

  return data;
}
