<template>
  <div>
    <header class="site-header">
      <div class="header">
        <!-- 显示网站Logo -->
        <div class="logo-container">
          <button class="btn" @click="backToHomePage">
            <i><img src="../assets/images/logo.png" alt="Logo" /></i>
            <i><img src="../assets/images/ciencetopia.svg" alt="ciencetopia"></i>
          </button>
        </div>
        <!-- 显示网站标语 -->
        <div class="site-description">
          <img src="../assets/images/red_arrow.svg" alt="Red arrow">
        </div>
        <!-- 显示当前用户的用户名 -->
        <div class="navbar-right">
          <LogInPartial></LogInPartial>
        </div>
        <!-- 夜间模式切换 -->
        <div class="dark-mode-switch">
          <button class = "btn" id="theme-toggler" @click="toggleTheme">
            <font-awesome-icon :icon="['fas', 'sun']" style="color: #000000;" />
          </button>
        </div>
        <link :href="themePath" rel="stylesheet">
      </div>
    </header>
    <div class="header-bottom">
      <!-- 搜索栏 -->
      <div class="search-container">
        <form action="/search" method="GET" class="search-form">
          <input type="text" name="query" placeholder="我想要了解..." />
          <button type="submit" class="search-btn">
            <font-awesome-icon :icon="['fas', 'search']" />
          </button>
        </form>
      </div>
    </div>
    <slot></slot>
    <footer>
      <p>&copy; 2023 sciencetopia.org 版权所有。</p>
      <nav>
        <ul>
          <li><a href="/about">关于我们</a></li>
          <li><a href="/contact">联系我们</a></li>
          <li><a href="/privacy">隐私政策</a></li>
          <li><a href="/terms">服务条款</a></li>
        </ul>
      </nav>
    </footer>
  </div>
</template>

<script>
import LogInPartial from './LogInPartial.vue';

export default {
  name: 'LayOut',
  data() {
    return {
      isDarkThemeEnabled: false,
      themePath: ''
    };
  },
  methods: {
    toggleTheme() {
      this.isDarkThemeEnabled = !this.isDarkThemeEnabled;
      if (this.isDarkThemeEnabled) {
        this.themePath = '/assets/css/dark-theme.css';  // 使用深色模式
      } else {
        this.themePath = '';  // 使用浅色模式
      }
    },
    backToHomePage() {
      this.$router.push({ name: 'HomePage' });  // 跳转到LogIn组件
    }
  },
  components: { LogInPartial }
}
</script>


<style scoped>
@import "../assets/css/layout.css";
@import "../assets/css/header.css";
@import "../assets/css/switches.css";
@import "../assets/css/footer.css";
</style>
