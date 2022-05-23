<template>
  <v-card tile>
    <TitleParallax :text="name" :height="150" />
    <template>
      <v-card-text class="containerbg ma-0 pa-0 pt-2">
        <v-container>
          <v-row class="ma-0 ma-md-2 ma-lg-2 ma-xl-2">
            <v-col cols="12" xs="12" sm="8" md="7" lg="6" xl="6">
              <template v-if="loaded && !err">
                <v-hover>
                  <template v-slot="{ hover }">
                    <v-card
                      elevation="4"
                      max-height="540"
                      max-width="540"
                      class="ml-auto mb-4"
                    >
                      <v-img
                        :src="imgBase64"
                        :alt="name"
                        elevation="4"
                        aspect-ratio="1"
                        class="align-end text-right"
                        :gradient="
                          hover
                            ? 'to bottom, rgba(0,0,0,0) 88%, rgba(0,0,0,.6)'
                            : ''
                        "
                      >
                        <v-card-title v-show="hover" class="pr-2 pb-2">
                          <a
                            :download="downloadFilename"
                            :href="imgBase64"
                            class="white--text ma-1 ml-auto no-text-decor"
                          >
                            <v-icon size="28" color="white">
                              mdi-download
                            </v-icon>
                          </a>
                          <a
                            :href="rawImgUrl"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="white--text ml-4 no-text-decor"
                          >
                            <v-icon size="28" color="yellow">
                              mdi-download
                            </v-icon>
                          </a>
                        </v-card-title>
                      </v-img>
                    </v-card>
                  </template>
                </v-hover>
              </template>
              <template v-else>
                <v-responsive
                  class="mx-auto mb-4"
                  max-height="540"
                  max-width="540"
                  :aspect-ratio="1"
                >
                  <v-sheet :color="`grey lighten-5`">
                    <v-skeleton-loader
                      ref="previewSkeleton"
                      max-height="540"
                      max-width="540"
                      :class="[
                        'mx-auto ma-1',
                        $vuetify.breakpoint.mobile
                          ? 'skeleton-img-xs'
                          : 'skeleton-img',
                      ]"
                      type="image"
                    ></v-skeleton-loader>
                  </v-sheet>
                </v-responsive>
              </template>
            </v-col>
            <v-col cols="12" xs="12" sm="12" md="5" lg="5" xl="5">
              <template v-if="loaded && !err">
                <v-card elevation="4" class="mb-6">
                  <v-card-title>
                    <v-card-text class="d-flex align-center text-h6 pb-0">
                      {{ this.name }}

                      <span class="d-flex align-center ml-auto">
                        <span class="d-none d-sm-flex text-overline mr-2">
                          View on
                        </span>
                        <v-chip
                          class="pa-2"
                          label
                          small
                          outlined
                          link
                          :href="solScanAccount(metadata)"
                          target="_blank"
                        >
                          Solscan
                        </v-chip>
                      </span>
                    </v-card-text>
                    <v-card-subtitle class="text-caption no-word-break pb-0">
                      {{ this.erc.description }}
                    </v-card-subtitle>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <!-- <h4 class="ma-2">{{ this.erc.description }}</h4> -->
                    <div class="pa-2">
                      <div class="text-overline font-weight-bold">Owner:</div>

                      <a
                        class="no-text-decor link-color"
                        :href="solScanAccount(owner)"
                        target="_blank"
                      >
                        <span class="account-id">
                          {{ displayOwner }}
                        </span>
                      </a>

                      <a
                        v-show="!!namingData && namingData.twitter"
                        :href="twitterLink"
                        target="_blank"
                        class="no-text-decor pl-2 account-id"
                      >
                        {{ !!namingData ? `@${namingData.twitter}` : "" }}
                      </a>

                      <v-icon
                        size="18"
                        class="ml-1"
                        @click="copyToClipboard(owner)"
                      >
                        mdi-content-copy
                      </v-icon>
                    </div>

                    <div class="pa-2">
                      <div class="text-overline font-weight-bold">Mint:</div>
                      <a
                        class="no-text-decor link-color"
                        :href="solScanAccount(mint)"
                        target="_blank"
                      >
                        <span class="account-id">
                          {{ mint }}
                        </span>
                      </a>
                      <v-icon
                        size="18"
                        class="ml-1"
                        @click="copyToClipboard(mint)"
                      >
                        mdi-content-copy
                      </v-icon>
                    </div>
                    <div class="pa-2">
                      <div class="text-overline font-weight-bold">
                        Attributes:
                      </div>

                      <template v-if="!isPlain">
                        <v-chip
                          v-for="(attr, i) in attributes"
                          :key="i"
                          outlined
                          small
                          class="ma-1"
                          v-show="!!attr.mat"
                          :color="getColowByMat(attr.mat)"
                        >
                          {{ attr.mat }} {{ attr.type }}
                        </v-chip>
                      </template>
                      <template v-else>
                        <span class="account-id"> None </span>
                      </template>
                    </div>
                    <div class="pa-2">
                      <div class="text-overline font-weight-bold d-inline-flex">
                        Rarity rating:
                      </div>
                      <span class="pl-1 account-id d-inline-flex">
                        {{ rarity }}%
                      </span>

                      <div
                        class="
                          text-overline
                          font-weight-bold
                          d-inline-flex
                          ml-12
                        "
                      >
                        RANK:
                      </div>
                      <span class="pl-1 account-id d-inline-flex">
                        {{ rank }}
                      </span>
                    </div>
                  </v-card-text>
                </v-card>
              </template>
              <template v-else>
                <v-skeleton-loader
                  elevation="4"
                  class="mx-auto ma-1"
                  type="article, list-item-three-line, list-item-three-line, list-item-two-line, card-heading"
                ></v-skeleton-loader>
              </template>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </template>
    <AppFooter />
  </v-card>
</template>

<script>
import AppFooter from "../components/AppFooter.vue";
import TitleParallax from "../components/TitleParallax.vue";
import { getNFTOwner } from "../lib/metadata-helper/metadata";
import axios from "axios";
import { getSolscanUrl, getTwitterUrl, createResourceUrl } from "../lib/util";
import { decodeSymbolPair, getColowByMaterial } from "../lib/codex";
import { getAllRegisteredInfo } from "../lib/name-service";
import { mapState } from "vuex";
import { RawImg } from "../lib/data/untouched";

const DisplayOwnerLength = 12;

export default {
  components: { AppFooter, TitleParallax },

  async activated() {
    this.err = false;
    // metadata
    this.loaded = false;
    // this.$vuetify.goTo(5, { offset: 25 });
    // elem may not be rendered & throw undefined error
    await this.loadPieceData();
    //TODO: fix this forget scroll of previous page
    // this.$vuetify.goTo(this.$refs.previewSkeleton || this.$refs.previewImg, {
    //   offset: 25,
    // });
  },
  watch: {},
  computed: {
    ...mapState({
      abs: (s) => s.abs || [],
    }),
    rarity() {
      return (
        this.abs.find((a) => a.metadata === this.metadata)?.rarity || 0
      ).toFixed(2);
    },
    rank() {
      return this.abs.find((a) => a.metadata === this.metadata)?.rank || 0;
    },
    imgBase64() {
      return `data:${this.downloadFileType.contentType};base64,${this.imgData}`;
    },
    displayOwner() {
      if (this.namingData?.domain) return this.namingData.domain;
      if (!this.namingData?.twitter) return this.owner;
      // return shorter version if has twitter
      return `${this.owner.substr(
        0,
        DisplayOwnerLength
      )}... ${this.owner.substr(DisplayOwnerLength * -1, DisplayOwnerLength)}`;
    },
    twitterLink() {
      return getTwitterUrl(this.namingData?.twitter);
    },
    downloadFileType() {
      if (this.symbol[1] === "A")
        return { ext: ".jpeg", contentType: "image/jpeg" };
      return { ext: ".gif", contentType: "image/gif" };
    },
    downloadFilename() {
      return `${this.name.replace(/\s/g, "_").replace(/\./g, "")}${
        this.downloadFileType.ext
      }`;
    },
    isPlain() {
      return this.symbol === "AA";
    },
    attributes() {
      return decodeSymbolPair(this.symbol);
    },
    rawImgUrl() {
      if (!this.ercSrc) return "";
      const rawUrl = RawImg.find(
        (r) =>
          r.arErc === this.ercSrc.substring(this.ercSrc.lastIndexOf("/") + 1)
      );
      if (!rawUrl) return "";
      return createResourceUrl(rawUrl.arImg);
    },
  },

  props: {
    metadata: String,
  },
  data() {
    return {
      err: false,
      name: null,
      ercSrc: null,
      mint: null,
      owner: null,
      erc: null,
      loaded: false,
      symbol: null,
      namingData: null,
      // rating: 0,
      imgData: null,
    };
  },
  methods: {
    async loadImgData() {
      if (this.err) return;
      const { data } = await axios.get(this.erc?.image, {
        responseType: "arraybuffer",
      });
      this.imgData = Buffer.from(data, "binary").toString("base64");
      // console.log(this.imgData);
    },
    async loadPieceData() {
      await this.loadMeta();
      await this.loadImgData();
      await this.reverseLookNaming();
      this.loaded = true;
    },
    solScanAccount(url) {
      return getSolscanUrl(url);
    },

    async loadMeta() {
      try {
        const { nftOwner, name, uri, mint, symbol } = await getNFTOwner(
          this.metadata
        );
        if (!mint) {
          // not abs stuff
          this.err = true;
          return;
        }
        this.owner = this.cleanString(nftOwner);
        this.name = this.cleanString(name);
        this.ercSrc = this.cleanString(uri);
        this.mint = this.cleanString(mint);
        this.symbol = this.cleanString(symbol);
        this.erc = (await axios.get(uri)).data;
        // console.log(ownerData);
      } catch (e) {
        console.log(e);
        this.err = true;
        // console.log(e);
      }
    },
    cleanString(s) {
      // eslint-disable-next-line no-control-regex
      return s.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
    },
    async reverseLookNaming() {
      if (!this.owner) return;
      this.namingData = await getAllRegisteredInfo(this.owner);
    },
    copyToClipboard(text) {
      var dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = text;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
    },
    getColowByMat(mat) {
      return getColowByMaterial(mat);
    },
  },
};
</script>
<style scoped lang="scss">
@import "../scss/global.scss";
@import "../scss/variables.scss";

.skeleton-img {
  ::v-deep div {
    height: 540px !important;
  }
}
.skeleton-img-xs {
  ::v-deep div {
    height: 435px !important;
  }
}
.no-word-break {
  word-break: keep-all;
}
.link-color {
  color: #616161;
}
.containerbg {
  background-image: url("/bg/main.jpg");
  background-position: top;
  /* background-size: 100%; */
  background-size: cover;
  // max-width: 1900px;
  // width: 100%;
  min-height: 650px;
}
.account-id {
  font-size: 0.8rem !important;
  font-weight: 400 !important;
  line-height: 1.25rem;
  letter-spacing: 0.0333333333em !important;
  font-family: "Roboto", sans-serif !important;
}
</style>
