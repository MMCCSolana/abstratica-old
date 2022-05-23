<template>
  <v-card>
    <TitleParallax text="My Collection" />
    <v-card-text class="py-0 pl-0 pr-0">
      <div class="containerbg">
        <v-container fluid>
          <v-row
            v-if="isConnected && ownedAbs.length > 0"
            class="mt-10 mb-10 ml-1 mr-1"
          >
            <v-col
              class=""
              v-for="item in collection"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              xl="2"
              :key="item.metadata"
            >
              <v-lazy>
                <ArtPreview
                  :src="item.uri"
                  :name="item.name"
                  :mint="item.mint"
                  :metadata="item.metadata"
                  :isNew="item.isNew"
                />
              </v-lazy>
            </v-col>
          </v-row>
          <v-row
            no-gutters
            class="empty-row"
            v-else-if="isConnected && ownedAbs.length < 1"
          >
            <v-col align-self="center">
              <div class="text-center justify-center page-message">
                <h1>You don't have any Abstratica arts :(</h1>
              </div>
            </v-col>
          </v-row>
          <v-row no-gutters class="empty-row" v-else>
            <v-col align-self="center">
              <div class="text-center justify-center page-message">
                <h1>Please connect wallet to see your collection.</h1>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-card-text>
    <AppFooter />
  </v-card>
</template>

<script>
import ArtPreview from "../components/ArtPreview.vue";
import AppFooter from "../components/AppFooter.vue";
import TitleParallax from "../components/TitleParallax.vue";
import { createResourceUrl } from "../lib/util";
import { mapGetters, mapActions } from "vuex";

export default {
  components: { ArtPreview, AppFooter, TitleParallax },

  data() {
    return {};
  },
  computed: {
    ...mapGetters(["ownedAbs", "isConnected", "newMeta"]),
    collection() {
      const ordered = [...this.ownedAbs];
      for (let index = 0; index < ordered.length; index++) {
        const item = ordered[index];
        item.isNew = this.isNewMetaAccount(item.metadata);
      }
      ordered.sort((a, b) => (a.isNew ? -1 : a.name.localeCompare(b.name)));
      return ordered;
    },
  },
  methods: {
    ...mapActions(["refreshTokens"]),
    toArweaveUrl(dataId) {
      return createResourceUrl(dataId);
    },
    isNewMetaAccount(metadata) {
      return !!this.newMeta.find((n) => n === metadata);
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
</style>
