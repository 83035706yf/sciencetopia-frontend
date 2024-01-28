<template>
  <LayOut>
    <div class="container custom-width">
      <router-view></router-view>
    </div>
    <!-- <HomePage msg="Sciencetopia - 一个系统、完备、面向群众永久免费的科学平台"/> -->
  </LayOut>
</template>

<script>
import LayOut from './components/LayOut.vue';
// import './assets/css/site.css';
import 'bootstrap/dist/css/bootstrap.css';

export default {
  name: 'App',
  components: {
    LayOut
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.custom-width {
  max-width: 1800px; /* Example custom width */
}

@font-face {
  font-family: 'Chinese-font';
  src: url('./assets/fonts/ChillRoundGothic_Regular.otf') format('opentype');
}
</style>
