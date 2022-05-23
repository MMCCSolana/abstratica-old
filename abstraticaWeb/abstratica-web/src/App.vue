<template>
  <v-app>
    <v-app-bar app color="grey darken-4" dark flat>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        class="d-xs-block d-sm-block d-md-none d-lg-none d-xl-none"
      ></v-app-bar-nav-icon>
      <v-container fluid>
        <v-row>
          <v-col cols="5" sm="4" md="2" lg="2" xl="2">
            <div class="align-center d-flex fill-height">
              <v-img
                :alt="name"
                class="shrink ma-0 pa-0 d-none d-md-block d-lg-block d-xl-block"
                contain
                src="/logo_gradient.png"
                width="40"
              />
              <router-link
                :to="{ path: '/home' }"
                class="no-text-decor inherit-color"
              >
                <h4 class="app-name ml-sm-0 ml-xs-0 ml-md-2 ml-lg-2 ml-xl-2">
                  {{ name }}
                </h4>
              </router-link>
            </div>
          </v-col>

          <v-col xl="8" lg="8" md="8" sm="2" class="pa-0 align-center">
            <div
              class="
                text-center
                d-none d-md-block d-lg-block d-xl-block
                fill-height
              "
            >
              <v-tabs
                :value="currentTab"
                @change="onTabChange"
                grow
                centered
                center-active
                height="64"
                class="d-block fill-height nav-tabs mx-auto"
              >
                <template v-for="(item, i) in nav">
                  <v-tab
                    :disabled="item.disabled"
                    :key="i"
                    :to="!item.target ? item.path : ''"
                    :href="item.target ? item.href : ''"
                    :target="item.target || ''"
                  >
                    <template v-if="item.name == 'my collection'">
                      <v-badge
                        dark
                        :value="walletConnected && newMintBadge > 0"
                        inline
                        :content="newMintBadge"
                        color="secondary"
                      >
                        <!-- badge wrap cause inactive icon color to stay active -->
                        <v-icon
                          left
                          :class="[
                            'text-capitalize d-md-none d-lg-inline-block d-xl-inline-block mb-1',
                            currentView !== 'mycollection'
                              ? 'icon-inactive-fix'
                              : '',
                          ]"
                          >{{ item.icon }}</v-icon
                        >
                        {{ item.name }}
                      </v-badge>
                      <!-- newMintBadge > 0 && currentView !== 'mycollection' -->
                    </template>
                    <template v-else>
                      <v-icon
                        left
                        class="
                          text-capitalize
                          d-md-none d-lg-inline-block d-xl-inline-block
                          mb-1
                        "
                        >{{ item.icon }}</v-icon
                      >
                      {{ item.name }}
                    </template>
                  </v-tab>
                </template>
              </v-tabs>
            </div>
          </v-col>

          <v-col cols="7" sm="6" md="2" lg="2" xl="2">
            <WalletButton
              :lamports="lamports"
              :address="connectedWalletKey"
              :network="network"
              @connect="openWalletDialog"
              @disconnect="disconnectWallet"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <MintedStatus
      :minted="minted"
      :max="maxMint"
      v-show="1 == 0 && !$vuetify.breakpoint.mobile"
    />
    <v-btn
      class="mint-btn bn5"
      fab
      x-large
      dark
      fixed
      bottom
      right
      text
      :ripple="false"
      @click="onMintClicked"
    >
      <v-icon class="z-1000 bn5-icon">mdi-wallet-plus</v-icon>
    </v-btn>

    <SideDrawer v-model="drawer" :name="name" :nav="nav" />
    <v-main>
      <keep-alive>
        <router-view :app-name="name"></router-view>
      </keep-alive>
    </v-main>
    <MintDialog
      v-model="mintDialog"
      v-show="walletConnected"
      :minted="minted"
      :max="maxMint"
      :price="mintPriceLamports"
      :balance="walletLamports"
      :loading="submitingMint"
      :allowMint="allowMint"
      @mint="onMintRequest"
    />
    <WalletDialog v-model="walletDialog" @connect="onConnect" />
    <v-snackbar v-model="snackbar" top right :timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-app>
</template>
<script>
/* eslint-disable no-unused-vars */
import WalletDialog from "./components/WalletDialog.vue";
import WalletButton from "./components/WalletButton.vue";
import SideDrawer from "./components/SideDrawer.vue";
import walletFac from "./lib/wallet/wallet-factory";
import MintedStatus from "./components/MintedStatus.vue";
import MintDialog from "./components/MintDialog.vue";
import { network, networkConnection, creator } from "./lib/connection";
import { mapActions, mapGetters } from "vuex";
import { sleep, toDisplayAmount } from "./lib/util";
import { MAX_MINT, MINT_PRICE, ENABLE_MINT } from "./lib/settings";
import { createMintRequestTranscation } from "./lib/transaction";

var Wallet = null;

export default {
  name: "App",
  components: {
    WalletDialog,
    WalletButton,
    SideDrawer,
    MintedStatus,
    MintDialog,
  },
  computed: {
    ...mapGetters(["minted", "connectedWallet", "isConnected", "newMintBadge"]),

    lamports() {
      return this.accountInfo?.lamports || 0;
    },
    walletSol() {
      return toDisplayAmount(this.accountInfo?.lamports || 0);
    },
    walletLamports() {
      return this.accountInfo?.lamports || 0;
    },
    walletConnected() {
      return this.isConnected;
    },
    currentView() {
      return (this.$route.name || "").toLowerCase();
    },
    network() {
      return network;
    },
    maxMint() {
      return MAX_MINT;
    },
    mintPriceLamports() {
      return MINT_PRICE;
    },
    allowMint() {
      return ENABLE_MINT;
    },
    mintPriceSol() {
      return toDisplayAmount(this.mintPriceLamports);
    },
    connectedWalletKey() {
      return this.connectedWallet;
    },
  },
  async created() {
    await this.loadAbs();
    // await this.startPollingNewMint();
  },
  // clean up
  beforeDestroy() {
    if (this.newMintPoolingHandle) clearInterval(this.newMintPoolingHandle);
  },
  data: () => ({
    name: "Abstratica",
    // wallet
    accountChangeHandle: 0,
    accountInfo: null,

    mintDialog: false,
    submitingMint: false,

    // component stuff
    snackbar: false,
    snackbarMessage: "",
    // snackbarType: "primary", // default color looks too ugly
    drawer: false,
    walletDialog: false,

    nav: [
      {
        name: "home",
        disabled: false,
        path: "/home",
        icon: "mdi-home",
      },
      {
        name: "my collection",
        disabled: false,
        path: "/collection",
        icon: "mdi-image-multiple",
      },
      {
        name: "explore",
        disabled: false,
        path: "/explore",
        icon: "mdi-compass",
      },
      {
        name: "codex",
        disabled: false,
        path: "/codex",
        icon: "mdi-book-open-page-variant",
      },
      {
        name: "marketplace",
        disabled: false,
        target: "_blank",
        href: "https://digitaleyes.market/collections/Abstratica",
        icon: "mdi-shopping",
      },
    ],
    newMintPollInterval: 5000,
    newMintPoolingHandle: 0,
    isPooling: false,
    previousTab: "/home",
    currentTab: "/home",
    allowTabs: ["/home", "/explore", "/codex", "/collection"],
  }),
  methods: {
    ...mapActions(["loadAbs", "connect", "disconnect", "refreshTokens"]),
    async startPollingNewMint() {
      this.newMintPoolingHandle = setInterval(async () => {
        if (!this.walletConnected || this.isPooling) return;
        await this.updateWalletSpl();
      }, this.newMintPollInterval);
    },
    async updateWalletSpl() {
      this.isPooling = true;
      try {
        await this.refreshTokens();
      } catch (e) {
        await sleep(2000);
        console.log("update wallet info error");
      } finally {
        this.isPooling = false;
      }
    },
    updateSolBalance(info) {
      this.accountInfo.lamports = info.lamports;
    },
    async onConnect(walletName) {
      Wallet = await walletFac(walletName, network);

      Wallet.on("connect", async () => await this.onWalletConnectCb());
      Wallet.on("disconnect", this.onWalletDisconnectCb);
      Wallet.on("error", (e) => {
        if (e.name == "WalletNotFoundError") {
          this.showSnackBar(`Could not connect to ${walletName}`);
        }
        console.log("wallet connect canceled");
      });

      Wallet.connect();
    },
    async onWalletConnectCb() {
      try {
        this.connect(Wallet.publicKey);
        this.accountChangeHandle = networkConnection.onAccountChange(
          Wallet.publicKey,
          this.updateSolBalance
        );

        // no need to wait for this
        this.accountInfo = await networkConnection.getAccountInfo(
          this.connectedWalletKey
        );
        this.showSnackBar("Wallet connected.", "success");
        this.walletDialog = false;
      } catch {
        console.log("wallet connect canceled");
      }
    },
    onWalletDisconnectCb() {
      networkConnection.removeAccountChangeListener(this.accountChangeHandle);
      this.disconnect();
      this.showSnackBar("Wallet disconnected.", "success");
      this.mintDialog = false;
    },
    openWalletDialog() {
      this.walletDialog = true;
    },
    disconnectWallet() {
      Wallet.disconnect();
      this.disconnect();
    },

    showSnackBar(message, type = "primary") {
      this.snackbar = true;
      this.snackbarMessage = message;
      // this.snackbarType = type;
    },
    onResize() {
      this.drawer = false;
    },
    onMintClicked() {
      if (!this.walletConnected) {
        this.walletDialog = true;
        return;
      }
      this.mintDialog = true;
    },
    async onTabChange(clickedTab) {
      // console.log(clickedTab);
      const isAllow =
        this.allowTabs.findIndex(
          (t) => t.toLowerCase() === clickedTab.toLowerCase()
        ) !== -1;
      this.currentTab = clickedTab;
      await this.$nextTick();
      if (!isAllow) this.currentTab = this.previousTab;
      else this.previousTab = this.currentTab;
    },

    async onMintRequest() {
      if (!this.allowMint) return;
      // craft tran
      this.submitingMint = true;
      try {
        const trans = await createMintRequestTranscation(
          networkConnection,
          this.connectedWalletKey,
          creator,
          this.mintPriceLamports
        );

        const signed = await Wallet.signTransaction(trans);
        // console.log(trans);
        const confirmed = await networkConnection.sendRawTransaction(
          signed.serialize(),
          {
            skipPreflight: true,
            preflightCommitment: "confirmed",
          }
        );

        this.showSnackBar(
          `Transaction sent: ${confirmed.substring(0, 16)}...`,
          "success"
        );
      } finally {
        this.submitingMint = false;
      }
    },
  },
};
</script>
<style scoped lang="scss">
@import "./scss/global.scss";
@import "./scss/variables.scss";
@import "./scss/effects.scss";

.nav-tabs {
  max-width: 800px;
}
.nav-tabs {
  ::v-deep .v-tabs-bar {
    background-color: $abs-dark-bg !important;
  }
}

.icon-inactive-fix {
  color: rgba(255, 255, 255, 0.6);
}

.mint-btn {
  background: transparent !important;
  box-shadow: 0 !important;
}
</style>
