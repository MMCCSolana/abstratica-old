<template>
  <v-footer dark>
    <v-container>
      <v-row dense class="text-center">
        <v-col>
          <span class="socials">
            <span class="ml-2 mr-2">
              <a href="https://twitter.com/AbstraticaNFT" target="_blank">
                <a href="https://twitter.com/AbstraticaNFT" target="_blank"
                  ><img src="/twitter.svg" alt="Twitter"
                /></a>
              </a>
            </span>
            <span class="ml-2 mr-2">
              <a href="https://discord.gg/yGDumwcD7M" target="_blank">
                <a href="https://discord.gg/yGDumwcD7M" target="_blank"
                  ><img width="35" src="/discord.svg" alt="Discord"
                /></a>
              </a>
            </span>
          </span>
        </v-col>
      </v-row>
      <v-row dense class="text-center">
        <v-col>
          <div class="poweredby">
            <b>Powered by:</b>

            <a class="poweredbylink" href="https://solana.com/" target="_blank">
              <img
                class="powerbylogo mr-1 ml-3 mb-1"
                src="/solana.svg"
                alt="Solana"
              />
              <span v-show="!isXs">Solana</span>
            </a>

            <a
              class="poweredbylink"
              href="https://metaplex.com/"
              target="_blank"
            >
              <img
                class="powerbylogoMetaplex mr-1 ml-4 mb-1"
                src="/metaplex.png"
                alt="Metaplex"
              /><span v-show="!isXs">Metaplex</span></a
            >

            <a
              class="poweredbylink"
              href="https://www.tensorflow.org/"
              target="_blank"
            >
              <img
                class="powerbylogoTensorFlow mb-1 ml-3"
                src="/tensorflow.svg"
                alt="TensorFlow"
              /><span v-show="!isXs">TensorFlow</span></a
            >
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  computed: {
    isXs() {
      return this.$vuetify.breakpoint.name === "xs";
    },
  },
};
</script>
<style scoped lang="scss">
.socials {
  margin-left: auto;
  margin-right: auto;
}
.poweredbylink {
  text-decoration: none;
  color: white;
}
.poweredby {
  margin-left: auto;
  margin-right: auto;
  font-size: 14px;
  font-family: $font-eyecandy;
  text-align: center;
  padding-top: 10px;
  // color: black;
}
.powerbylogo {
  height: 20px;
  widows: 20px;
  vertical-align: middle;
  border-style: none;
}
.powerbylogoMetaplex {
  height: 25px;
  widows: 25px;
  vertical-align: middle;
  border-style: none;
}
.powerbylogoTensorFlow {
  height: 28px;
  widows: 28px;
  vertical-align: middle;
  border-style: none;
}
</style>
