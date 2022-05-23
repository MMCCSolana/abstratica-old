<template>
  <div class="d-flex align-center justify-space-between">
    <div class="d-flex align-center">
      <v-img
        class="d-inline-flex"
        :src="src"
        :width="width"
        :height="height"
        contain
        aspect-ratio="1"
      ></v-img>
      <span class="d-inline-flex ml-3 grey--text text--lighten-4">{{
        name
      }}</span>
    </div>
    <v-btn
      text
      @click="$emit('connect', name)"
      :class="[
        disabled ? 'grey--text text--darken-2' : 'grey--text text--lighten-4',
      ]"
      :disabled="disabled"
    >
      {{ buttonText }}
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    buttonText: {
      type: String,
      default: "Connect",
    },
    src: String,
    disabled: Boolean,
    width: {
      type: String,
      default: "25",
    },
    height: {
      type: String,
      default: "25",
    },
  },
};
</script>
<style scoped lang="scss">
@import "../scss/global.scss";
@import "../scss/variables.scss";
</style>
