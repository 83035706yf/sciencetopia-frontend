<template>
  <LayOut>
    <div class="container">
      <router-view></router-view>
    </div>
    <!-- <HomePage msg="Sciencetopia - 一个系统、完备、面向群众永久免费的科学平台"/> -->
  </LayOut>
</template>

<script>
import LayOut from './components/LayOut.vue';
import 'bootstrap/dist/css/bootstrap.css';

export default {
  name: 'ScienceTopia',
  components: {
    LayOut
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
