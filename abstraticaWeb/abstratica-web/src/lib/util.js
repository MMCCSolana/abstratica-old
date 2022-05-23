import { network } from "./connection";
const SolscanTemplate = "https://solscan.io/account/{id}?";

export const SolDecimals = 9;
export function toDisplayAmount(amount, decimals) {
  return amount / 10 ** (decimals || SolDecimals);
}

export function toNativeAmount(amount, decimals) {
  return amount * 10 ** decimals;
}

export const DefaultArweaveUrl = "https://arweave.net/";

export const createResourceUrl = (resourceId) => {
  return `${DefaultArweaveUrl}${resourceId}`;
};

export function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

export function getSolscanUrl(id) {
  if (network === "mainnet-beta") {
    return SolscanTemplate.replace("{id}", id);
  }
  return SolscanTemplate.replace("{id}", id) + `cluster=${network}`;
}

export function getTwitterUrl(handle) {
  return `https://twitter.com/${handle}`;
}

export function cleanControlChar(value) {
  return value.replace(
    // eslint-disable-next-line no-control-regex
    /[\u0000-\u001F\u007F-\u009F]/g,
    ""
  );
}

export function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    if (!map.has(key)) {
      map.set(key, [item]);
    } else {
      map.get(key).push(item);
    }
  });
  return map;
}
export function debounce(fn, delay) {
  var timeoutID = null;
  return function () {
    clearTimeout(timeoutID);
    var args = arguments;
    var that = this;
    timeoutID = setTimeout(function () {
      fn.apply(that, args);
    }, delay);
  };
}
