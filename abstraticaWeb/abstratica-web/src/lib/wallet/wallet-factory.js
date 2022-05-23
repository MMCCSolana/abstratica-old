/**
 *
 * @param {String} name wallet name
 * @param {String} network rpc server
 * @returns
 */
export default async function (name, network) {
  switch (name.toLowerCase()) {
    case "sollet":
      return new (await import("./sollet"))["SolletWalletAdapter"](network);
    case "phantom":
      return new (
        await import(
          /* webpackMode: "lazy" */
          "@solana/wallet-adapter-phantom"
        )
      )["PhantomWalletAdapter"]({ network });
    case "mathwallet":
      return new (
        await import(
          /* webpackMode: "lazy" */
          "@solana/wallet-adapter-mathwallet"
        )
      )["MathWalletProvider"]({ network });
    case "solong":
      return new (
        await import(
          /* webpackMode: "lazy" */
          "@solana/wallet-adapter-solong"
        )
      )["SolongProvider"]({ network });
    case "solflare":
      return new (
        await import(
          /* webpackMode: "lazy" */
          "@solana/wallet-adapter-solflare"
        )
      )["SolflareWalletAdapter"]({ network });
    default:
      throw new Error(`Wallet adapter not found ${name}`);
  }
}
