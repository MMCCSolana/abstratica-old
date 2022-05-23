<template>
  <v-card dark flat tile>
    <v-parallax
      :src="dynamicSrc"
      gradient="to bottom, rgba(0,0,0,.8), rgba(0,0,0,.44)"
      :height="height"
    >
      <v-overlay value="true" absolute>
        <v-container class="pt-4">
          <v-row dense class="">
            <v-col cols="12">
              <h1 class="slogan-text grey--text text--lighten-4">
                {{ text }}
              </h1>
            </v-col>
          </v-row>
        </v-container>
      </v-overlay>
    </v-parallax>
  </v-card>
</template>

<script>
const Extention = ".jfif";
const Prefix = "abs";
const Folder = "bg";

export default {
  mounted() {
    // fix incomplete occasionally incomplete image load
    this.$nextTick(() => {
      this.$forceUpdate();
    });
  },
  created() {
    // should match with bg count
    this.seed = this.getRandomInt(1, 18);
  },
  data() {
    return { seed: 0 };
  },
  props: {
    text: String,
    height: { type: Number, default: 350 },
  },
  computed: {
    dynamicSrc() {
      return `/${Folder}/${Prefix}${this.seed}${Extention}`;
    },
  },
  methods: {
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min);
    },
  },
};
</script>
<style scoped lang="scss">
@import "../scss/global.scss";
@import "../scss/variables.scss";

.slogan-text {
  // @extend .solana-text-color;
  padding-top: 25px;
  max-width: 750px;
  text-align: center;
  font-size: 48px;
  font-weight: 300;
  line-height: 70px;
  text-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  margin-left: auto;
  margin-right: auto;
  text-transform: uppercase;
  padding-bottom: 30px;
  font-family: "Raleway", sans-serif;
}
</style>
