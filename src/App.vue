<template>
  <v-app id="app" class="global-background">
    <LayOut>
      <!-- <GlobalLoader /> -->
      <div class="custom-width">
        <router-view></router-view>
      </div>
    </LayOut>
  </v-app>
</template>

<script>
import LayOut from './components/LayOut.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'quill/dist/quill.snow.css'; // for snow theme

export default {
  name: 'App',
  components: {
    LayOut
  },
}
</script>

<style scoped>
#app {
  font-family: Chinese-font, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #E9DBBE;
  overflow: visible; /* Ensure footer can move freely */
}

.custom-width {
  min-height: 1100px;
  max-width: 100vw;
  border-radius: 0px;
  /* background-color: white */
  /* background-color: #F2ECDE; */
  /* Example custom width */
}

@font-face {
  font-family: 'Chinese-font';
  src: url('./assets/fonts/SiYuanHeiTiGoogleBan/NotoSansCJK-Regular-1.otf') format('opentype');
}
</style>
