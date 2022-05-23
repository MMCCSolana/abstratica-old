export function decodeSymbol(sym) {
  if (sym === "B") return "Bronze";
  if (sym === "C") return "Silver";
  if (sym === "D") return "Golden";
  if (sym === "E") return "Solana";
  return null;
}

export function getColowByMaterial(mat) {
  switch (mat) {
    case "Bronze":
      return "brown lighten-1";
    case "Silver":
      return "blue-grey darken-1";
    case "Golden":
      return "amber accent-3";
    case "Solana":
      return "purple accent-2";
  }
  return "";
}

export function decodeSymbolPair(symbol) {
  if (!symbol) return [];
  return [
    {
      type: "frame",
      mat: decodeSymbol(symbol[0]),
    },
    {
      type: "reflection",
      mat: decodeSymbol(symbol[1]),
    },
  ];
}

export function getRating(rank) {
  return rank * 1.76;
}
