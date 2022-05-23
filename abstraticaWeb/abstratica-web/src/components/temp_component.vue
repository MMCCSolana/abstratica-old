<template>
  <v-dialog v-model="show" transition="dialog-top-transition" max-width="600">
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
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
