<template>
  <v-card elevation="4" outlined class="ma-0 ma-md-1 ma-lg-1 ma-xl-1">
    <v-img
      :src="srcUrl"
      aspect-ratio="1"
      @load="onLoaded"
      @error="onError"
      @click="onDetailClicked"
      class="white--text align-end cursor"
      :gradient="loaded ? 'to bottom, rgba(0,0,0,0) 80%, rgba(0,0,0,.6)' : ''"
    >
      <template v-slot:placeholder>
        <v-row
          class="fill-height ma-0 grey lighten-4"
          align="center"
          justify="center"
        >
          <v-progress-circular
            indeterminate
            color="grey lighten-1"
          ></v-progress-circular>
        </v-row>
      </template>
      <v-card-title v-show="loaded" class="pb-5 pb-sm-3 pb-md-3">
        {{ name }}
        <v-chip
          v-show="isNew"
          label
          color="yellow"
          class="ma-1 ml-2"
          x-small
          :ripple="false"
          >New</v-chip
        >
      </v-card-title>
    </v-img>
  </v-card>
</template>

<script>
// https://github.com/vuetifyjs/vuetify/issues/4983#issuecomment-477442050
import axios from "axios";
import { sleep } from "../lib/util";
import retry from "async-retry";
import { mapMutations } from "vuex";

export default {
  props: {
    src: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    mint: {
      type: String,
      require: true,
    },
    metadata: {
      type: String,
      require: true,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.observer = new IntersectionObserver((entries) => {
      const image = entries[0];
      if (image.isIntersecting) {
        this.intersected = true;
        this.observer.disconnect();
      }
    });

    this.observer.observe(this.$el);
  },
  watch: {
    intersected: async function (newValue) {
      if (!this.erc && newValue && !this.loadingErc) {
        // prevent multiple calls
        this.loadingErc = true;
        this.erc = await this.tryGetErcFromCache(this.src);
        // slow down a bit to avoid 500
        await sleep(1000);
        this.ready = true;
      }
    },
  },
  data() {
    return {
      loadingErc: false,
      loaded: false,
      observer: null,
      intersected: false,
      erc: null,
      ready: false,
    };
  },
  computed: {
    srcUrl() {
      return this.ready ? this.erc?.image : "";
    },
  },
  methods: {
    ...mapMutations(["removeNewMeta"]),
    async tryGetErcFromCache(src) {
      const id = src.substring(src.lastIndexOf("/") + 1);
      const erc = localStorage.getItem(id);
      if (erc) {
        // console.log("found from cache");
        return JSON.parse(erc);
      }
      const { data } = await retry(
        async () => {
          return await axios.get(src);
        },
        {
          minTimeout: 500,
          factor: 1.5,
          onRetry: () => {
            // logger.logError(e, ``);
          },
        }
      );
      localStorage.setItem(id, JSON.stringify(data));
      return data;
    },
    onDetailClicked() {
      if (!this.loaded) return;
      if (this.isNew) {
        this.removeNewMeta(this.metadata);
      }
      this.$router.push({
        name: "NFTDetail",
        params: { metadata: this.metadata },
      });
    },
    onLoaded() {
      this.loaded = true;
    },
    onError() {
      // reload
      this.ready = false;
      this.ready = true;
    },
    calculateImgHeight() {
      if (this.$vuetify.breakpoint.width < 400) return "350px";
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "450px";
        case "sm":
          return "450px";
        case "md":
          return "300px";
        case "lg":
          return "300px";
        case "xl":
          return "300px";
      }
      return "500px";
    },
  },
  destroyed() {
    this.observer.disconnect();
  },
};
</script>
<style scoped lang="scss">
@import "../scss/global.scss";

.cursor {
  cursor: pointer;
}
</style>
