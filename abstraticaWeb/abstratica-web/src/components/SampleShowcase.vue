<template>
  <v-card elevation="4" width="500" class="ma-auto">
    <v-carousel cycle :height="carouseHeight">
      <v-carousel-item v-for="(item, i) in samples" :key="i">
        <v-img :src="getSampleUrl(item)" contain max-height="500px"></v-img>
      </v-carousel-item>
    </v-carousel>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      sampleFolder: "sample",
      samples: [
        "sample1.jpg",
        "sample2.jpg",
        "sample3.jpg",
        "sample4.jpg",
        "sample5.jpg",
      ],
    };
  },
  computed: {
    carouseHeight() {
      if (this.$vuetify.breakpoint.width < 400) return "350px";
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "450px";
        case "sm":
          return "450px";
        case "md":
          return "500px";
        case "lg":
          return "500px";
        case "xl":
          return "500px";
      }
      return "500px";
    },
  },
  methods: {
    getSampleUrl(sample) {
      return `${this.sampleFolder}/${sample}`;
    },
  },
};
</script>
<style scoped></style>
