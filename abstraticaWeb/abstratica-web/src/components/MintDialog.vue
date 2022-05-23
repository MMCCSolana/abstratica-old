<template>
  <v-dialog
    transition="dialog-bottom-transition"
    v-model="show"
    max-width="450"
  >
    <template v-slot:default="dialog">
      <v-card>
        <v-card-title> {{ title }} </v-card-title>
        <v-card-subtitle> {{ minted }} / {{ max }} </v-card-subtitle>
        <v-card-text>
          <template v-if="!loading">
            <div class="text-h6 pl-6 pr-6 pb-5 text-center">
              <div class="d-inline-flex align-center">
                <v-btn
                  v-if="canMint"
                  @click="onMint"
                  outlined
                  class="d-inline-flex ml-4"
                  :disabled="!canMint"
                >
                  Mint For &nbsp;{{ priceUi }}
                  <v-img
                    class="d-inline-flex ml-1"
                    src="/solana.svg"
                    height="16px"
                    width="19px"
                  ></v-img>
                </v-btn>
                <v-btn
                  v-else
                  :disabled="true"
                  class="d-inline-flex ml-4"
                  outlined
                >
                  {{ mintButtonText }}
                </v-btn>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="text-center pb-6">
              <v-progress-circular indeterminate></v-progress-circular>
            </div>
          </template>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="justify-end card-bg">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
            </template>
            <span
              >{{ priceUi }} SOL is {{ priceLamportFormated }} lamports</span
            >
          </v-tooltip>

          <v-spacer></v-spacer>
          <v-btn text @click="dialog.value = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import { toDisplayAmount } from "../lib/util";

export default {
  props: {
    value: Boolean,
    minted: Number,
    max: {
      type: Number,
      default: 4200,
    },
    price: {
      type: Number,
      default: 1,
    },
    balance: {
      type: Number,
      require: true,
    },
    title: {
      type: String,
      default: "Mint Abstratica",
    },
    allowMint: {
      type: Boolean,
      default: false,
    },
    loading: Boolean,
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
    priceLamportFormated() {
      return this.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    priceUi() {
      return toDisplayAmount(this.price);
    },
    mintButtonText() {
      if (!this.allowMint) return "DISABLED";
      if (this.balance < this.price) return "Insufficient SOL";
      if (this.minted >= this.max) return "Limit reached";
      return "Mint";
    },
    canMint() {
      if (!this.allowMint) return false;
      if (this.balance < this.price) return false;
      if (this.minted >= this.max) return false;
      return true;
    },
  },
  methods: {
    overlayClicked(event) {
      // console.log(event);
      if ([...event.srcElement.attributes].find((a) => a.name === "overlay"))
        this.show = false;
    },
    onMint() {
      if (!this.canMint) return;
      this.$emit("mint");
    },
  },
};
</script>
<style scoped lang="scss">
@import "../scss/global.scss";
@import "../scss/variables.scss";
.card-bg {
  background: #fafafa;
}
</style>
