import Vuex from "vuex";
import Vue from "vue";
import { getMetadataByMint } from "../lib/metadata-helper/metadata";
import { networkConnection, TOKEN_PROGRAM_ID } from "../lib/connection";
import { sleep, cleanControlChar, groupBy } from "../lib/util";
import { loadAbsOptimized } from "../lib/metadata-helper/metadata2";
import getCollectors from "../api/collectors";

Vue.use(Vuex);

// IMPORTANT keep data simple
export default new Vuex.Store({
  state: {
    metaReady: false,
    abs: [],
    rarity: [],
    // ownedMint: [],
    ownedAbs: [],
    connectedWallet: null,
    newMeta: [],
    newMintBadge: 0,
  },
  getters: {
    metaReady: (s) => s.metaReady,
    minted: (state) => {
      return state.abs?.length || 0;
    },
    // ownedMint: (s) => s.ownedMint,
    ownedAbs: (s) => s.ownedAbs || [],
    newMintBadge: (s) => s.newMeta.length || 0,
    newMeta: (s) => s.newMeta || [],
    connectedWallet: (s) => s.connectedWallet,
    isConnected: (s) => !!s.connectedWallet,
  },
  mutations: {
    metaReady(state) {
      state.metaReady = true;
    },
    setAbs(state, payload) {
      state.abs = payload;
    },
    setRarity(state, payload) {
      state.rarity = payload;
    },
    addAbs(state, payload) {
      state.abs.push(...(Array.isArray(payload) ? payload : [payload]));
    },
    setConnectedWallet(state, wallet) {
      state.connectedWallet = wallet;
    },
    setOwnedAbs(state, payload) {
      const updateData = Array.isArray(payload) ? payload : [payload];
      state.ownedAbs = updateData;
    },
    addOwnedAbs(state, payload) {
      const updateData = Array.isArray(payload) ? payload : [payload];
      state.ownedAbs.push(...updateData);
    },
    addNewMeta(state, payload) {
      const updateData = Array.isArray(payload) ? payload : [payload];
      state.newMeta.push(...updateData);
    },
    clearNewMeta(state) {
      state.newMeta.splice(0);
    },
    removeNewMeta(state, metaAccount) {
      const i = state.newMeta.findIndex((n) => n === metaAccount);
      if (i > -1) state.newMeta.splice(i, 1);
    },
  },
  actions: {
    async connect({ commit, dispatch }, payload) {
      commit("setConnectedWallet", payload);
      await dispatch("refreshTokens");
    },
    disconnect({ commit }) {
      commit("setConnectedWallet", null);
      // commit("setOwnedMint", []);
      commit("setOwnedAbs", []);
      commit("clearNewMeta");
    },
    // TODO: add rebounce
    async refreshTokens({ commit, getters, state }) {
      if (!getters.isConnected) {
        commit("setOwnedAbs", []);
        return;
      }

      const { value } = await networkConnection.getParsedTokenAccountsByOwner(
        getters.connectedWallet,
        { programId: TOKEN_PROGRAM_ID }
      );

      // get token with NFT signature
      const nft = value
        .map((t) => {
          return t.account.data;
        })
        .map((d) => {
          return {
            mint: d.parsed?.info?.mint,
            amount: parseInt(d.parsed?.info?.tokenAmount?.amount),
            decimals: parseInt(d.parsed?.info?.tokenAmount?.decimals),
          };
        })
        .filter((m) => m.amount === 1 && m.decimals === 0);

      // check NFT against current all abs
      // console.log(nft);
      const currentMetaCheck = checkCurrentMeta(state.abs, nft);
      // not found in current all abs
      const notFound = currentMetaCheck.filter((c) => c.foundIdx === -1);
      // console.log(notFound);
      // check if notFound is actually abs
      const newAbs = [];
      for (let index = 0; index < notFound.length; index++) {
        const newToken = notFound[index];
        const newMeta = await getMetadataByMint(newToken.mint);
        if (newMeta)
          newAbs.push({
            metadata: newMeta.metadata.toBase58(),
            name: newMeta.name,
            uri: newMeta.uri,
            mint: newMeta.mint.toBase58(),
            symbol: newMeta.symbol,
          });
        await sleep(1000);
      }

      if (newAbs.length > 0) {
        commit(
          "addNewMeta",
          newAbs.map((a) => a.metadata)
        );
      }
      //push new abs meta
      commit("addAbs", newAbs);
      // reconstruct current owned abs
      commit("setOwnedAbs", [
        ...currentMetaCheck
          .filter((c) => c.foundIdx > -1)
          .map((c) => state.abs[c.foundIdx]),
        ...newAbs,
      ]);
    },
    // main load data
    async loadAbs({ commit, dispatch }) {
      // const abs2 = await loadAbsOptimized();
      // return;
      const abs = (await loadAbsOptimized())
        .filter((a) => {
          return a.decodedData.data?.name && a.decodedData.data?.uri;
        })
        .map((a) => {
          return {
            name: cleanControlChar(a.decodedData.data.name),
            uri: cleanControlChar(a.decodedData.data.uri),
            mint: a.decodedData.mint.toBase58(),
            nonceOrder: a.decodedData.mint._bn.words[1],
            metadata: a.metadata,
            symbol: cleanControlChar(a.decodedData.data.symbol),
          };
        });

      const rarity = await dispatch("calculateRarityData", abs);

      // attach rarity
      for (let index = 0; index < abs.length; index++) {
        const absItem = abs[index];
        absItem.rarity = rarity.find((r) => r.type === absItem.symbol).rarity;
      }
      // re-order by rarity & mint nonce
      abs.sort((a, b) => {
        if (a.rarity - b.rarity !== 0) {
          return a.rarity - b.rarity;
        }
        return a.nonceOrder - b.nonceOrder;
      });
      // attach rank number
      for (let index = 0; index < abs.length; index++) {
        const absItem = abs[index];
        absItem.rank = index + 1;
      }
      commit("setRarity", rarity);
      commit("setAbs", abs);
      commit("metaReady");
    },

    calculateRarityData(context, metadata) {
      const groupedBySymbol = groupBy(metadata, (t) => t.symbol);
      const groupedData = [];
      for (const entry of groupedBySymbol.entries()) {
        const rarityData = {
          type: entry[0],
          count: entry[1].length,
          rarity: (entry[1].length / metadata.length) * 100,
        };
        // rarityData.rating = (100 - rarityData.rarity) * 76;
        groupedData.push(rarityData);
      }
      return groupedData;
    },

    async getCollectorData() {
      return await getCollectors();
    },
  },
});

function checkCurrentMeta(abs, tokenData) {
  return tokenData.map((n) => {
    return {
      mint: n.mint,
      foundIdx: abs.findIndex((a) => {
        return a.mint === n.mint;
      }),
    };
  });
}
