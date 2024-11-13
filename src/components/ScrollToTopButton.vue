<template>
  <!-- Scroll to Top Button -->
  <v-btn
    v-if="showScrollToTop"
    icon
    class="scroll-to-top-btn"
    @click="scrollToTop"
  >
    <v-icon>mdi-arrow-up</v-icon>
  </v-btn>
</template>

<script>
export default {
  data() {
    return {
      showScrollToTop: false, // Toggle button visibility
    };
  },
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth', // Smooth scrolling
      });
    },
    handleScroll() {
      this.showScrollToTop = window.scrollY > 200; // Show the button when scrolled down 200px
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll); // Listen for scroll events
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll); // Clean up event listener
  },
};
</script>

<style scoped>
.scroll-to-top-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000; /* Ensure it's on top of other elements */
}
</style>
