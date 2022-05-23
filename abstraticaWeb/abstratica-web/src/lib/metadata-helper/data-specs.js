export const MAX_NAME_LENGTH = 32;

export const MAX_SYMBOL_LENGTH = 10;

export const MAX_URI_LENGTH = 200;

export const MAX_CREATOR_LIMIT = 5;

export const MAX_CREATOR_LEN = 32 + 1 + 1;
export const MAX_METADATA_LEN =
  1 +
  32 +
  32 +
  MAX_NAME_LENGTH +
  MAX_SYMBOL_LENGTH +
  MAX_URI_LENGTH +
  MAX_CREATOR_LIMIT * MAX_CREATOR_LEN +
  2 +
  1 +
  1 +
  198;
