<template>
  <v-navigation-drawer v-model="show" temporary dark app>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="solana-text-color app-name">
          <h2>
            {{ name.toUpperCase() }}
          </h2>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>
    <v-list nav>
      <v-list-item-group v-model="group">
        <v-list-item
          v-for="(item, i) in nav"
          :key="i"
          link
          :to="item.path"
          :disabled="item.disabled"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.name.toUpperCase() }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    value: Boolean,
    nav: Array,
    name: String,
  },
  data() {
    return { group: null };
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
  methods: {},
};
</script>
<style scoped lang="scss">
@import "../scss/global.scss";
@import "../scss/variables.scss";
</style>
