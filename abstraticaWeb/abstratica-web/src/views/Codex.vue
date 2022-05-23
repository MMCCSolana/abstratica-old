<template>
  <v-card>
    <TitleParallax text="Codex" />
    <v-card-text class="py-0 pl-0 pr-0">
      <div class="containerbg">
        <v-container fluid>
          <v-row class="mt-6 mb-6">
            <v-spacer></v-spacer>
            <v-col cols="12" lg="4" xl="4">
              <v-card
                class="ml-2 mr-2 mr-lg-0 ml-lg-0 mr-xl-0 ml-xl-0"
                height="925"
              >
                <v-card-title>
                  <v-card-text class="text-h6 pb-0"> Rarity </v-card-text>
                </v-card-title>
                <v-list-item v-for="item in rarityAttributes" :key="item.key">
                  <v-list-item-content class="ma-0 pa-0">
                    {{ item.tierDesc }}
                    <v-progress-linear
                      :value="item.rarity"
                      rounded
                      :color="getColorByType(item.type[0])"
                      height="25"
                    >
                      <template v-slot:default="{ value }">
                        <span class="rarity-text">
                          {{ value.toFixed(2) }}%
                        </span>
                      </template>
                    </v-progress-linear>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-col>

            <v-col cols="12" lg="6" xl="6">
              <v-card class="ml-2 mr-2 mr-lg-0 ml-lg-0 mr-xl-0 ml-xl-0">
                <v-card-title>
                  <v-card-text class="text-h6">
                    <span class="d-inline-flex pb-0">
                      Collectors Leaderboard
                    </span>

                    <v-text-field
                      class="search-textfield d-inline-flex float-right pa-0"
                      v-model="search"
                      hide-details
                      append-icon="mdi-magnify"
                      label="Search"
                    ></v-text-field>
                  </v-card-text>
                </v-card-title>
                <v-data-table
                  :headers="headers"
                  :items="leaderboards"
                  :options="leaderboardOptions"
                  :search="search"
                  :sort-by="'rank'"
                  item-key="mint"
                  @current-items="onFilterdItemChange"
                  height="770"
                  :loading="!metaReady || !collectors"
                  :footer-props="{
                    'items-per-page-options': [15],
                    'disable-items-per-page': true,
                  }"
                  class="leader-table"
                >
                  <template v-slot:header.rank="{ header }">
                    <span class="text-subtitle-1">
                      {{ header.text }}
                    </span>
                  </template>

                  <template v-slot:header.owner="{ header }">
                    <span class="text-subtitle-1">
                      {{ header.text }}
                    </span>
                  </template>

                  <template v-slot:header.owned="{ header }">
                    <span class="text-subtitle-1">
                      {{ header.text }}
                    </span>
                  </template>

                  <template v-slot:header.rating="{ header }">
                    <span class="text-subtitle-1">
                      {{ header.text }}
                    </span>
                  </template>

                  <template v-slot:item.rating="{ item }">
                    <v-icon color="yellow accent-4" size="22" class="pb-1">
                      mdi-star
                    </v-icon>
                    {{ item.rating }}
                  </template>

                  <template v-slot:item.owner="{ item }">
                    <template v-if="hasNaming(item.owner)">
                      {{ truncateOwnerAddress(item.owner) }}
                      <v-icon
                        size="18"
                        class="ml-2"
                        @click="copyToClipboard(item.owner)"
                      >
                        mdi-content-copy
                      </v-icon>

                      <!-- <i class="ml-4">
                        {{ getNamingDomain(item.owner) }}
                      </i> -->

                      <a
                        v-show="!!getTwitterHandle(item.owner)"
                        :href="twitterLink(getTwitterHandle(item.owner))"
                        target="_blank"
                        class="no-text-decor pl-2 account-id"
                      >
                        @{{ getTwitterHandle(item.owner) }}
                      </a>
                    </template>
                    <template v-else>
                      {{
                        item.owner ===
                        "F4ghBzHFNgJxV4wEQDchU5i7n4XWWMBSaq7CuswGiVsr"
                          ? "DigitalEyes"
                          : item.owner
                      }}
                      <v-icon
                        size="18"
                        class="ml-2"
                        @click="copyToClipboard(item.owner)"
                      >
                        mdi-content-copy
                      </v-icon>
                    </template>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
        </v-container>
      </div>
    </v-card-text>
    <AppFooter />
  </v-card>
</template>
<script>
import AppFooter from "../components/AppFooter.vue";
import TitleParallax from "../components/TitleParallax.vue";
import { mapActions, mapState } from "vuex";
import { decodeSymbolPair, getColowByMaterial, getRating } from "../lib/codex";
import { getAllRegisteredInfo } from "../lib/name-service";
import { getTwitterUrl, debounce } from "../lib/util";
const DisplayOwnerLength = 12;

export default {
  components: { AppFooter, TitleParallax },
  async activated() {
    this.collectors = await this.getCollectorData();
    if (!this.leaderboards || this.leaderboards.length < 1)
      await this.refreshLeaderboards();
  },
  watch: {
    async metaReady(state) {
      if (state) {
        await this.refreshLeaderboards();
      }
    },
  },
  computed: {
    ...mapState({
      rarity: (s) => s.rarity || [],
      abs: (s) => s.abs || [],
      metaReady: (s) => s.metaReady,
    }),
    rarityAttributes() {
      return this.rarity
        .map((r) => {
          const decoded = decodeSymbolPair(r.type);
          return {
            tierDesc: `${decoded[0].mat || "Plain"}  ${decoded[0].type} + ${
              decoded[1].mat || "Plain"
            } ${decoded[1].type}`,
            type: r.type,
            rarity: r.rarity,
            rating: r.rating,
          };
        })
        .sort((a, b) => a.rarity - b.rarity);
    },
  },
  data: () => ({
    headers: [
      {
        text: "Rank",
        sortable: true,
        value: "rank",
        align: "center",
      },
      {
        text: "Owner",
        sortable: true,
        value: "owner",
        filterable: true,
      },
      {
        text: "Owned",
        sortable: true,
        value: "owned",
      },
      {
        text: "Collection rating",
        sortable: true,
        value: "rating",
      },
    ],
    leaderboardOptions: {
      itemsPerPage: 15,
    },
    search: null,
    leaderboards: [],
    collectors: [],
    loadedNaming: [],
  }),

  methods: {
    ...mapActions(["getCollectorData"]),
    refreshLeaderboards() {
      const sortedCollectors = [];
      for (let index = 0; index < this.collectors.length; index++) {
        const collector = this.collectors[index];
        const mintInfo = this.abs.filter(
          (a) => collector.mints.findIndex((m) => a.mint === m) !== -1
        );
        collector.rating = mintInfo
          .reduce((acc, a) => (acc += getRating(a.rank)), 0)
          .toFixed(0);
        sortedCollectors.push(collector);
      }
      sortedCollectors.sort((a, b) => b.rating - a.rating);
      for (let index = 0; index < sortedCollectors.length; index++) {
        const collector = sortedCollectors[index];
        collector.rank = index + 1;
      }
      this.leaderboards = sortedCollectors;
    },
    // WIP
    async onFilterdItemChange(items) {
      // const workItems = items.filter(
      //   (i) => this.loadedNaming.findIndex((l) => l.owner === i.owner) === -1
      // );
      // for (let index = 0; index < workItems.length; index++) {
      //   const item = workItems[index];
      //   debounce(() => {
      //     console.log("in debounce");
      //     getAllRegisteredInfo(item.owner, true)
      //       .then((r) => {
      //         console.log("feched");
      //         const naming = r;
      //         naming.owner = item.owner;
      //         this.loadedNaming.push(naming);
      //       })
      //       .catch((e) => {});
      //   }, 111)();
      // }
    },
    truncateOwnerAddress(owner) {
      return `${owner.substr(0, DisplayOwnerLength)}... ${owner.substr(
        DisplayOwnerLength * -1,
        DisplayOwnerLength
      )}`;
    },
    hasNaming(owner) {
      const naming = this.loadedNaming.find((n) => n.owner === owner);
      return naming?.domain || naming?.twitter;
    },
    getNamingDomain(owner) {
      return this.loadedNaming.find((n) => n.owner === owner)?.domain;
    },
    getTwitterHandle(owner) {
      return this.loadedNaming.find((n) => n.owner === owner)?.twitter;
    },
    twitterLink(twitterHandle) {
      return getTwitterUrl(twitterHandle);
    },
    getColowByMat(mat) {
      return getColowByMaterial(mat);
    },
    getColorByType(type) {
      switch (type) {
        case "E":
          return "purple lighten-4";
        case "D":
          return "amber accent-2";
        case "C":
          return "blue-grey lighten-2";
        case "B":
          return "brown lighten-2";
        case "A":
          return "grey lighten-1";
      }
    },
    copyToClipboard(text) {
      var dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = text;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
    },
  },
};
</script>
<style scoped lang="scss">
@import "../scss/global.scss";
@import "../scss/variables.scss";

.containerbg {
  background-image: url("/bg/main.jpg");
  background-position: top;
  /* background-size: 100%; */
  background-size: cover;
  max-width: 1900px;
  min-height: 600px;
  // width: 100%;
  // height: 100%;
}
.explore-welcome {
  padding-top: 25px;
  max-width: 750px;
  text-align: center;
  font-weight: 300;
  font-size: 48px;
  line-height: 70px;
  text-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  margin-left: auto;
  margin-right: auto;
  text-transform: uppercase;
  padding-bottom: 30px;
  font-family: "Raleway", sans-serif;
}
.empty-row {
  height: 300px;
}
.rarity-text {
  font-weight: 400;
  font-size: 1em;
  line-height: 1.75rem;
  letter-spacing: 0.009375em !important;
  font-family: "Roboto", sans-serif !important;
}
.search-textfield {
  width: 200px;
}
.leader-table {
  ::v-deep .v-data-footer .v-data-footer__pagination {
    font-size: 1rem !important;
    font-weight: normal;
    line-height: 1.75rem;
    letter-spacing: 0.009375em !important;
    font-family: "Roboto", sans-serif !important;
    margin: 10px;
  }
}
</style>
