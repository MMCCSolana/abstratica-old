import { PublicKey } from "@solana/web3.js";
export const MetadataKey = {
  UninitializedKey: 0,
  MetadataV1Key: 4,
  EditionV1Key: 1,
  MasterEditionV1Key: 2,
  MasterEditionV2Key: 6,
  EditionMarkerKey: 7,
};
export const MetaplexKey = {
  Uninitialized: 0,
  OriginalAuthorityLookupV1: 1,
  BidRedemptionTicketV1: 2,
  StoreV1: 3,
  WhitelistedCreatorV1: 4,
  PayoutTicketV1: 5,
  SafetyDepositValidationTicketV1: 6,
  AuctionManagerV1: 7,
  PrizeTrackingTicketV1: 8,
};
export class MasterEditionV1 {
  constructor(args) {
    this.key = MetadataKey.MasterEditionV1Key;
    this.supply = args.supply;
    this.maxSupply = args.maxSupply;
    this.printingMint = args.printingMint;
    this.oneTimePrintingAuthorizationMint =
      args.oneTimePrintingAuthorizationMint;
  }
}
export class MasterEditionV2 {
  constructor(args) {
    this.key = MetadataKey.MasterEditionV2Key;
    this.supply = args.supply;
    this.maxSupply = args.maxSupply;
  }
}
export class EditionMarker {
  constructor(args) {
    this.key = MetadataKey.EditionMarkerKey;
    this.ledger = args.ledger;
  }
  //   editionTaken(edition) {
  //     const editionOffset = edition % EDITION_MARKER_BIT_SIZE;
  //     const indexOffset = Math.floor(editionOffset / 8);
  //     if (indexOffset > 30) {
  //       throw Error("bad index for edition");
  //     }
  //     const positionInBitsetFromRight = 7 - (editionOffset % 8);
  //     const mask = Math.pow(2, positionInBitsetFromRight);
  //     const appliedMask = this.ledger[indexOffset] & mask;
  //     return appliedMask != 0;
  //   }
}
export class Edition {
  constructor(args) {
    this.key = MetadataKey.EditionV1Key;
    this.parent = args.parent;
    this.edition = args.edition;
  }
}
export class Creator {
  constructor(args) {
    this.address = args.address;
    this.verified = args.verified;
    this.share = args.share;
  }
}
export class Data {
  constructor(args) {
    this.name = args.name;
    this.symbol = args.symbol;
    this.uri = args.uri;
    this.sellerFeeBasisPoints = args.sellerFeeBasisPoints;
    this.creators = args.creators;
  }
}
export class Metadata {
  constructor(args) {
    this.key = MetadataKey.MetadataV1Key;
    this.updateAuthority = args.updateAuthority;
    this.mint = args.mint;
    this.data = args.data;
    this.primarySaleHappened = args.primarySaleHappened;
    this.isMutable = args.isMutable;
  }
}
export class CreateMetadataArgs {
  constructor(args) {
    this.instruction = 0;
    this.data = args.data;
    this.isMutable = args.isMutable;
  }
}
export class UpdateMetadataArgs {
  constructor(args) {
    this.instruction = 1;
    this.data = args.data ? args.data : null;
    this.updateAuthority = args.updateAuthority
      ? new PublicKey(args.updateAuthority)
      : null;
    this.primarySaleHappened = args.primarySaleHappened;
  }
}
export class CreateMasterEditionArgs {
  constructor(args) {
    this.instruction = 10;
    this.maxSupply = args.maxSupply;
  }
}
export class MintPrintingTokensArgs {
  constructor(args) {
    this.instruction = 9;
    this.supply = args.supply;
  }
}
export class Store {
  constructor(args) {
    this.key = MetaplexKey.StoreV1;
    this.public = args.public;
    this.auctionProgram = args.auctionProgram;
    this.tokenVaultProgram = args.tokenVaultProgram;
    this.tokenMetadataProgram = args.tokenMetadataProgram;
    this.tokenProgram = args.tokenProgram;
  }
}
export const METADATA_SCHEMA = new Map([
  [
    CreateMetadataArgs,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["data", Data],
        ["isMutable", "u8"], // bool
      ],
    },
  ],
  [
    UpdateMetadataArgs,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["data", { kind: "option", type: Data }],
        ["updateAuthority", { kind: "option", type: "pubkey" }],
        ["primarySaleHappened", { kind: "option", type: "u8" }],
      ],
    },
  ],
  [
    CreateMasterEditionArgs,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["maxSupply", { kind: "option", type: "u64" }],
      ],
    },
  ],
  [
    MintPrintingTokensArgs,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["supply", "u64"],
      ],
    },
  ],
  [
    MasterEditionV1,
    {
      kind: "struct",
      fields: [
        ["key", "u8"],
        ["supply", "u64"],
        ["maxSupply", { kind: "option", type: "u64" }],
        ["printingMint", "pubkey"],
        ["oneTimePrintingAuthorizationMint", "pubkey"],
      ],
    },
  ],
  [
    MasterEditionV2,
    {
      kind: "struct",
      fields: [
        ["key", "u8"],
        ["supply", "u64"],
        ["maxSupply", { kind: "option", type: "u64" }],
      ],
    },
  ],
  [
    Edition,
    {
      kind: "struct",
      fields: [
        ["key", "u8"],
        ["parent", "pubkey"],
        ["edition", "u64"],
      ],
    },
  ],
  [
    Data,
    {
      kind: "struct",
      fields: [
        ["name", "string"],
        ["symbol", "string"],
        ["uri", "string"],
        ["sellerFeeBasisPoints", "u16"],
        ["creators", { kind: "option", type: [Creator] }],
      ],
    },
  ],
  [
    Creator,
    {
      kind: "struct",
      fields: [
        ["address", "pubkey"],
        ["verified", "u8"],
        ["share", "u8"],
      ],
    },
  ],
  [
    Metadata,
    {
      kind: "struct",
      fields: [
        ["key", "u8"],
        ["updateAuthority", "pubkey"],
        ["mint", "pubkey"],
        ["data", Data],
        ["primarySaleHappened", "u8"],
        ["isMutable", "u8"], // bool
      ],
    },
  ],
  [
    EditionMarker,
    {
      kind: "struct",
      fields: [
        ["key", "u8"],
        ["ledger", [31]],
      ],
    },
  ],
]);
