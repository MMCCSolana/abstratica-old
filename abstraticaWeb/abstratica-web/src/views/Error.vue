<template>
  <v-overlay :absolute="absolute" :opacity="1" :value="1">
    <div>
      <h4 class="page-message">
        {{ message }}
      </h4>
    </div>
    <v-btn color="orange lighten-2" @click="overlay = false"> Home </v-btn>
  </v-overlay>
</template>

<script>
export default {
  props: {
    message: String,
  },
};
</script>
<style scoped lang="scss">
@import "../scss/global.scss";
@import "../scss/variables.scss";
</style>
