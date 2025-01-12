<template>
  <v-app id="app">
    <component :is="layout">
      <!-- <GlobalLoader /> -->
      <!-- <div class="custom-width"> -->
      <router-view />
      <!-- </div> -->
    </component>
  </v-app>
</template>

<script>
import LayOut from './components/LayOut.vue'
import ThinLayOut from './components/ThinLayOut.vue'
import SimplestLayOut from './components/SimplestLayOut.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'quill/dist/quill.snow.css' // for snow theme

export default {
  name: 'App',
  components: {
    LayOut,
    ThinLayOut,
    SimplestLayOut,
  },
  computed: {
    layout() {
      // Determine the layout based on the route meta
      const layout = this.$route.meta.layout
      if (layout === 'thin')
        return 'ThinLayOut' // Thin layout
      else if (layout === 'simplest') return 'SimplestLayOut' // Render directly without layout
      return 'LayOut' // Default layout
    },
  },
}
</script>

<style scoped>
#app {
  font-family: Chinese-font, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #e8dabd;
  background-image: url('https://www.transparenttextures.com/patterns/cream-dust.png');
  /* background-blend-mode: overlay; */
  overflow: visible;
  /* Ensure footer can move freely */
}

/* .custom-width {
  min-height: 800px;
  max-width: 100vw;
  border-radius: 0px;
} */

@font-face {
  font-family: 'Chinese-font';
  src: url('./assets/fonts/SiYuanHeiTiGoogleBan/NotoSansCJK-Regular-1.otf')
    format('opentype');
}
</style>
