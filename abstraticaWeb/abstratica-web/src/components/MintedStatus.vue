<template>
  <v-chip class="position border" outlined elevation="1">
    <span class="text blend">{{ minted || 0 }} / {{ max || 4200 }}</span>
  </v-chip>
</template>

<script>
export default {
  props: {
    minted: Number,
    max: Number,
  },
};
</script>
<style scoped lang="scss">
@import "../scss/global.scss";
@import "../scss/variables.scss";
.border {
  border: 0 !important;
}
.position {
  position: fixed;
  bottom: 100px;
  right: 8px;
  // color: black;
  background: transparent;
  z-index: 4;
}
.text {
  font-weight: 500;
  font-size: 1em;
}
.blend {
  color: black;
  mix-blend-mode: screen;
}
</style>
