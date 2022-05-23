<template>
  <v-card>
    <TitleParallax text="Abstratica Gallery" />
    <v-card-text class="py-0 pl-0 pr-0">
      <div class="containerbg">
        <v-container fluid>
          <v-row class="mt-1">
            <v-spacer></v-spacer>
            <v-col cols="4" sm="4" md="4" lg="2" xl="2">
              <v-text-field
                v-model="nameFilter"
                label="Filter"
                clearable
              ></v-text-field>
            </v-col>
            <v-col
              class="mr-1 mr-sm-4 mr-md-6 mr-lg-12 mr-xl-12"
              cols="4"
              sm="4"
              md="4"
              lg="2"
              xl="2"
            >
              <v-select
                v-model="sortBy"
                :items="sortOptions"
                label="Sort by"
              ></v-select>
            </v-col>
          </v-row>
          <v-row
            v-if="sortedAbs.length > 0"
            class="mt-0 mb-10 ml-0 mr-0 ml-lg-4 mr-lg-4 ml-xl-4 mr-xl-4"
          >
            <v-col
              v-for="item in sortedAbs"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              xl="2"
              :key="item.metadata"
            >
              <v-lazy
                :options="{
                  threshold: 0.65,
                }"
                transition="fade-transition"
              >
                <ArtPreview
                  :src="item.uri"
                  :name="item.name"
                  :mint="item.mint"
                  :metadata="item.metadata"
                />
              </v-lazy>
            </v-col>
          </v-row>
          <v-row no-gutters class="empty-row" v-else>
            <v-col v-show="metaReady" align-self="center">
              <div class="text-center justify-center page-message">
                <h1>Be the first to own Abstratica.</h1>
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
import { createResourceUrl, shuffleArray } from "../lib/util";
import { mapState, mapGetters } from "vuex";
import debounce from "debounce";

export default {
  components: { ArtPreview, AppFooter, TitleParallax },
  props: {},
  data() {
    return {
      sortOptions: ["Random", "Rank: Low to High", "Rank: High to Low"],
      sortBy: "Random",
      nameFilter: null,
      nameFilterRebounced: null,
    };
  },
  created() {
    this.filterDebounce = debounce(this.setNameFilter, 700, false);
  },
  watch: {
    nameFilter(value) {
      this.filterDebounce();
    },
  },
  computed: {
    ...mapGetters(["metaReady"]),
    ...mapState({
      abs: (s) => s.abs || [],
    }),
    sortedAbs() {
      const cloned = [...this.abs].filter(
        (a) =>
          !this.nameFilterRebounced ||
          a.name.toLowerCase().includes(this.nameFilterRebounced.toLowerCase())
      );

      if (this.sortBy === "Rank: High to Low") {
        cloned.sort((a, b) => a.rank - b.rank);
        return cloned;
      }
      if (this.sortBy === "Rank: Low to High") {
        cloned.sort((a, b) => b.rank - a.rank);
        return cloned;
      }
      // default
      shuffleArray(cloned);
      return cloned;
    },
  },
  methods: {
    setNameFilter() {
      this.nameFilterRebounced = this.nameFilter;
    },
    toArweaveUrl(dataId) {
      return createResourceUrl(dataId);
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
