<template>
  <div class="text-right">
    <template v-if="!connected">
      <v-btn
        :small="$vuetify.breakpoint.name === 'xs'"
        @click="$emit('connect')"
        outlined
      >
        <v-icon class="d-none d-md-block d-lg-block d-xl-block"
          >mdi-link</v-icon
        >
        <span class="mr-2 ml-2">Connect Wallet</span>
      </v-btn>
    </template>

    <template v-else>
      <v-menu
        transition="slide-y-transition"
        bottom
        :offset-y="true"
        z-index="10000"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="no-text-transform"
            outlined
            :small="$vuetify.breakpoint.name === 'xs'"
            v-bind="attrs"
            v-on="on"
          >
            <span class="d-flex">
              <v-img
                class="d-inline-flex mr-1"
                src="/solana.svg"
                height="16px"
                width="19px"
              ></v-img>
              <span class="d-inline-flex mr-2">{{ sol }}</span>
              <span class="d-inline-flex wallet-address">{{
                truncatedAddress
              }}</span>
            </span>
          </v-btn>
        </template>
        <v-list color="grey lighten-4">
          <v-list-item class="text-center">
            <v-list-item-title> Connected to {{ network }} </v-list-item-title>
          </v-list-item>
          <v-list-item class="text-center">
            <v-btn class="mx-auto" text @click="$emit('disconnect')">
              Disconnect
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </div>
</template>

<script>
import { toDisplayAmount } from "../lib/util";
export default {
  props: {
    lamports: Number,
    address: Object,
    network: String,
  },
  computed: {
    connected() {
      return !!this.address;
    },
    truncatedAddress() {
      return `${this.address?.toBase58()?.substr(0, 4)}...${this.address
        .toBase58()
        ?.substr(4 * -1, 4)}`;
    },
    sol() {
      return (
        !this.lamports ? "0.00" : toDisplayAmount(this.lamports).toFixed(2)
      ).toString();
    },
  },
};
</script>
<style scoped lang="scss">
@import "../scss/global.scss";
@import "../scss/variables.scss";

.wallet-address {
  text-decoration-style: dashed;
  font-style: italic;
}
</style>
