<template>
  <v-dialog v-model="show" :transition="false">
    <div class="dialog-overlay d-flex" @click="overlayClicked($event)" overlay>
      <div class="dialog-blur justify-center align-center d-flex" overlay>
        <v-container class="dialog-container mb-15">
          <v-row>
            <v-col>
              <div class="d-flex align-center justify-space-between">
                <div class="d-inline-flex grey--text text--lighten-4">
                  <h4 class="pl-4 font-weight-medium font-eyecandy">
                    Connect Wallet
                  </h4>
                </div>
                <div class="pr-2 d-flex-inline float-right">
                  <v-btn
                    icon
                    class="grey--text text--lighten-1"
                    @click="show = false"
                  >
                    <v-icon> mdi-close</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
          <div class="pa-8">
            <v-row justify="center" align-content="center" align="center">
              <v-col cols="12" class="option-bborder">
                <WalletOption
                  name="Phantom"
                  src="/phantom.svg"
                  @connect="$emit('connect', $event)"
                />
              </v-col>
            </v-row>

            <v-row justify="center" align-content="center" align="center">
              <v-col cols="12" class="option-bborder">
                <WalletOption
                  name="Sollet"
                  src="/solana-green.svg"
                  @connect="$emit('connect', $event)"
                />
              </v-col>
            </v-row>

            <v-row justify="center" align-content="center" align="center">
              <v-col cols="12" class="option-bborder">
                <WalletOption
                  name="Solflare"
                  src="/solflare.svg"
                  @connect="$emit('connect', $event)"
                />
              </v-col>
            </v-row>

            <!-- <v-row justify="center" align-content="center" align="center">
              <v-col cols="12" class="option-bborder">
                <WalletOption
                  name="Solong"
                  src="/solong.png"
                  @connect="$emit('connect', $event)"
                />
              </v-col>
            </v-row>

            <v-row justify="center" align-content="center" align="center">
              <v-col cols="12" class="option-bborder">
                <WalletOption
                  name="Mathwallet"
                  src="/mathwallet.svg"
                  @connect="$emit('connect', $event)"
                />
              </v-col>
            </v-row> -->

            <v-row justify="center" align-content="center" align="center">
              <v-col cols="12" class="option-bborder">
                <WalletOption
                  name="Ledger"
                  src="/ledger.svg"
                  :disabled="true"
                />
              </v-col>
            </v-row>
          </div>
        </v-container>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import WalletOption from "./WalletOption.vue";
export default {
  components: { WalletOption },
  props: {
    value: Boolean,
  },
  mounted() {
    // fix window computed not working correctly on first load
    // MAGIC: this issue is not happening on prod build
    this.$forceUpdate();
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  methods: {
    onConnect(type) {
      console.log(type);
    },
    overlayClicked(event) {
      // console.log(event);
      if ([...event.srcElement.attributes].find((a) => a.name === "overlay"))
        this.show = false;
    },
  },
};
</script>
<style scoped lang="scss">
@import "../scss/global.scss";
@import "../scss/variables.scss";

.dialog-overlay {
  background-color: rgba(29, 38, 58, 0.7);
  // min-height: 920px;
  z-index: 100;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  position: fixed;
}

/* slightly transparent fallback */
.dialog-blur {
  background-color: rgba(29, 38, 58, 0.95);
  position: relative;
  overflow: hidden;
  align-items: center;
  flex: 1 1 0%;
}

/* if backdrop support: very transparent and blurred */
@supports (
  (-webkit-backdrop-filter: blur(2em)) or (backdrop-filter: blur(2em))
) {
  .dialog-blur {
    background-color: rgba(29, 38, 40, 0.4);
    -webkit-backdrop-filter: blur(50px);
    backdrop-filter: blur(50px);
  }
}

.dialog-container {
  max-width: 500px;
  width: 450px;
  max-height: 500px;
  height: 300px;
}
.option-bborder {
  border-bottom-width: 0.5px;
  border-bottom-style: solid;
  border-bottom-color: rgba(134, 134, 134, 0.5);
}
</style>
