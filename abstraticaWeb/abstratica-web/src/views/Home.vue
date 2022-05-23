<template>
  <v-card>
    <TitleParallax text="AI generative arts on Solana" />
    <v-card-text class="py-0 pl-0 pr-0">
      <div class="containerbg">
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <div class="text-center justify-center welcome mb-10 mt-10">
                <h1>Welcome to {{ appName }}</h1>
              </div>
            </v-col>
          </v-row>
          <v-row dense class="mb-5">
            <v-col
              xl="4"
              lg="4"
              md="3"
              class="d-none d-md-flex d-lg-flex d-xl-flex"
            ></v-col>
            <v-col xl="4" lg="4" md="6" xs="12">
              <SampleShowcase />
            </v-col>
            <v-col
              xl="4"
              lg="4"
              md="3"
              class="d-none d-md-flex d-lg-flex d-xl-flex"
            ></v-col>
          </v-row>
          <v-row>
            <v-col> </v-col>
          </v-row>
        </v-container>
      </div>
    </v-card-text>
    <AppFooter />
  </v-card>
</template>

<script>
import SampleShowcase from "../components/SampleShowcase.vue";
import AppFooter from "../components/AppFooter.vue";
import TitleParallax from "../components/TitleParallax.vue";
export default {
  components: { SampleShowcase, AppFooter, TitleParallax },
  props: {
    wallet: {
      type: String,
      required: false,
    },
    appName: {
      type: String,
      default: "SampleApp",
    },
    ready: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      samples: [
        "sample1.png",
        "sample2.png",
        "sample3.png",
        "sample4.png",
        "sample5.png",
        "sample6.png",
        "sample7.png",
        "sample8.png",
      ],
    };
  },
  computed: {
    walletConnected() {
      return !!this.wallet;
    },
  },
  methods: {},
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
  width: 100%;
  height: 100%;
}

.welcome {
  font-family: $font-eyecandy;
  text-align: center;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}
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
