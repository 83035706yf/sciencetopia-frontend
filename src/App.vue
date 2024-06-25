<template>
  <div id="app" class="global-background">
    <LayOut>
      <GlobalLoader />
      <div class="container custom-width">
        <router-view></router-view>
      </div>
    </LayOut>
  </div>
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
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50; */
  background-color: #E4D8C0;
}

.custom-width {
  min-height: 1100px;
  max-width: 1800px;
  border-radius: 10px;
  background-color: #f2f2f2;
  /* Example custom width */
}

@font-face {
  font-family: 'Chinese-font';
  src: url('./assets/fonts/ChillRoundGothic_Regular.otf') format('opentype');
}
</style>
