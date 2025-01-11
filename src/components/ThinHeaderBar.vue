<template>
  <v-container fluid class="header-container">
    <v-row align="center" justify="space-between" class="header-row">

      <!-- 左侧部分：Logo 和 搜索框 -->
      <v-col cols="auto" class="left-section">
        <!-- Logo -->
        <v-btn variant="plain" class="logo-btn" @click="backToHomePage" aria-label="返回主页">
          <img src="../assets/images/logo.png" alt="Logo" class="logo-image" />
        </v-btn>

        <!-- 搜索框 -->
        <div class="search-wrapper">
          <v-text-field
            v-model="searchQuery"
            :placeholder="$t('searchbar.iwanttolearn')"
            append-inner-icon="mdi-magnify"
            @click:append-inner="globalSearch"
            @keyup.enter="globalSearch"
            class="search-input no-border"
            dense
            clearable
            hide-details
            flat
          ></v-text-field>
        </div>
      </v-col>

      <!-- 右侧部分：导航链接 和 用户操作 -->
      <v-col cols="auto" class="right-section">
        <v-row align="center" justify="end" class="right-row">

          <!-- 导航链接 -->
          <v-btn class="header-btn" variant="plain" @click="scrollToSection">
            {{ $t('header.trend') }}
          </v-btn>
          <v-btn class="header-btn" variant="plain" @click="RouteToStudyGroup">
            {{ $t('header.studygroup') }}
          </v-btn>

          <v-menu open-on-hover offset-y>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" class="header-btn" variant="plain"
                @click="isAuthenticated ? showDialog() : null">
                {{ $t('header.studyplan') }}
              </v-btn>
            </template>
            <v-card v-if="!isAuthenticated">
              <v-card-title>
                <v-list>
                  <v-list-item-title>
                    {{ $t('please') }}
                    <v-btn @click="login" variant="outlined">
                      {{ $t('header.login') }}
                    </v-btn>
                    {{ $t('header.tocreateplan') }}
                  </v-list-item-title>
                </v-list>
              </v-card-title>
            </v-card>
          </v-menu>

          <!-- 深色模式切换 -->
          <v-btn class="header-btn dark-mode-btn" variant="plain" @click="toggleTheme" aria-label="切换主题">
            <div class="btn-content">
              <!-- 深色模式 SVG 图标 -->
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="..."></path>
              </svg>
            </div>
          </v-btn>

          <!-- 语言切换器 -->
          <v-select
            v-model="currentLocale"
            :items="languageOptions"
            dense
            hide-details
            solo-inverted
            variant="plainfield"
            class="language-select"
            aria-label="语言切换"
            @change="changeLanguage"
          />

          <!-- 用户操作组件 -->
          <LogInPartial :scrolledPastHeader="true" />
          <MessageAlert :scrolledPastHeader="true" />
        </v-row>
      </v-col>

    </v-row>

    <!-- 登录注册对话框（如有需要） -->
    <v-dialog v-model="loginRegisterDialog" max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ isLogin ? $t('login.title') : $t('register.title') }}</span>
        </v-card-title>
        <v-card-text>
          <LogInPartial v-if="isLogin" @login-success="handleLoginSuccess" />
          <MessageAlert v-if="alertMessage" :message="alertMessage" @close="alertMessage = ''" />
          <v-form v-else @submit.prevent="registerUser">
            <!-- 注册表单内容 -->
            <v-text-field
              v-model="registerUsername"
              :label="$t('register.username')"
              required
            ></v-text-field>
            <v-text-field
              v-model="registerEmail"
              :label="$t('register.email')"
              type="email"
              required
            ></v-text-field>
            <v-text-field
              v-model="registerPassword"
              :label="$t('register.password')"
              type="password"
              required
            ></v-text-field>
            <v-text-field
              v-model="registerConfirmPassword"
              :label="$t('register.confirmPassword')"
              type="password"
              required
            ></v-text-field>
            <v-btn type="submit" color="primary">{{ $t('register.register') }}</v-btn>
            <v-btn text @click="switchToLogin">{{ $t('register.alreadyHaveAccount') }}</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import LogInPartial from './LogInPartial.vue';
import MessageAlert from './MessageAlert.vue';

export default {
  name: "ThinHeaderBar",
  components: { LogInPartial, MessageAlert },
  data() {
    return {
      isDarkThemeEnabled: false,
      themePath: '',
      searchQuery: '',
      searchResults: [],
      isLoading: false,
      currentLocale: this.$i18n.locale,
      languageOptions: [
        { title: 'English', value: 'en' },
        { title: '中文', value: 'zh' },
        // 可根据需要添加更多语言选项
      ],
      isLogin: true, // 控制显示登录或注册表单
      loginRegisterDialog: false, // 控制对话框显示
      loginUsername: '',
      loginPassword: '',
      registerUsername: '',
      registerEmail: '',
      registerPassword: '',
      registerConfirmPassword: '',
      alertMessage: '', // 用于显示警告信息
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
  },
  methods: {
    login() {
      this.$router.push({ name: 'login' });  // 跳转到LogIn组件
    },
    toggleTheme() {
      this.isDarkThemeEnabled = !this.isDarkThemeEnabled;
      if (this.isDarkThemeEnabled) {
        this.themePath = '/assets/css/dark-theme.css';  // 使用深色模式
      } else {
        this.themePath = '';  // 使用浅色模式
      }
      // 此处假设已有主题切换逻辑，不做更改
    },

    backToHomePage() {
      this.$router.push({ name: 'HomePage' });  // 返回主页
    },

    scrollToSection() {
      // 获取目标元素的位置
      const section = document.getElementById('feed-section');
      console.log("section:", section);
      if (section) {
        const yOffset = -60; // 调整偏移量，根据需要修改
        const y = section.getBoundingClientRect().top + window.scrollY + yOffset;

        // 滚动到指定位置
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    },

    async globalSearch() {
      const query = this.searchQuery ? this.searchQuery.trim() : '';
      if (!query) {
        console.log('Search query is empty!');
        return;
      }

      this.isLoading = true;
      try {
        const path = this.$router.resolve({ name: 'searchList', query: { q: this.searchQuery } }).href;
        window.open(path, '_blank');
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        this.isLoading = false;
      }
    },

    RouteToStudyGroup() {
      this.$router.push({ name: 'studyGroupList' });
    },

    showDialog() {
      this.loginRegisterDialog = true;
      console.log('Show study plan dialog');
    },

    switchToRegister() {
      this.isLogin = false;
    },

    switchToLogin() {
      this.isLogin = true;
    },

    async loginUser() {
      // 实现登录逻辑
      try {
        // 假设有一个登录方法
        await this.$store.dispatch('login', {
          username: this.loginUsername,
          password: this.loginPassword,
        });
        this.loginRegisterDialog = false;
      } catch (error) {
        console.error('登录失败:', error);
        this.alertMessage = this.$t('login.failed');
      }
    },

    async registerUser() {
      // 实现注册逻辑
      if (this.registerPassword !== this.registerConfirmPassword) {
        this.alertMessage = this.$t('register.passwordMismatch');
        return;
      }
      try {
        // 假设有一个注册方法
        await this.$store.dispatch('register', {
          username: this.registerUsername,
          email: this.registerEmail,
          password: this.registerPassword,
        });
        this.loginRegisterDialog = false;
      } catch (error) {
        console.error('注册失败:', error);
        this.alertMessage = this.$t('register.failed');
      }
    },

    handleLoginSuccess() {  // 已移除 userData 参数
      // 处理登录成功逻辑
      this.loginRegisterDialog = false;
      // 其他逻辑...
    },

    changeLanguage() {
      this.$i18n.locale = this.currentLocale;
    },
  },
};
</script>

<style scoped>
.header-container {
  background-color: #ffffff; /* 纯白背景 */
  transition: all 0.3s ease;
  z-index: 1000;
  padding: 10px 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加轻微阴影以区分内容 */
}

.header-row {
  width: 100%;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 16px; /* Logo 和搜索框之间的间距 */
}

.logo-btn {
  padding: 0;
}

.logo-image {
  max-height: 120px; /* 调整 Logo 大小 */
  width: auto;
}

.search-wrapper {
  display: flex;
  align-items: center;
}

.search-input {
  width: 300px;
  border-radius: 999px; /* 圆形边角，确保两侧完全圆形 */
  background-color: #f5f5f5; /* 搜索框背景颜色 */
  padding-left: 16px; /* 内边距，确保文本不靠边 */
  padding-right: 16px; /* 内边距，确保图标不靠边 */
}

/* 移除搜索框的边框和下划线 */
.no-border .v-input__control .v-input__slot {
  border: none !important;
  box-shadow: none !important;
  background-color: #f5f5f5 !important; /* 保持背景颜色 */
}

/* 如果仍有下划线，可以进一步移除 */
.no-border .v-input__slot::before,
.no-border .v-input__slot::after {
  display: none !important;
}

/* 调整搜索框内的图标位置 */
.search-input .v-input__append-inner {
  margin-right: 8px; /* 调整图标与边缘的间距 */
}

.right-section {
  display: flex;
  align-items: center;
}

.right-row {
  display: flex;
  align-items: center;
  gap: 24px; /* 导航项之间的间距 */
}

.header-btn {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  margin: 0 8px;
}

.header-btn:hover {
  color: #1976D2; /* Vuetify 默认主色 */
}

.dark-mode-btn .btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.language-select {
  max-width: 100px;
}

@media (max-width: 1200px) {
  .search-input {
    width: 250px;
  }
  .language-select {
    max-width: 80px;
  }
}

@media (max-width: 768px) {
  .header-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .left-section,
  .right-section {
    width: 100%;
    justify-content: space-between;
  }
  .search-input {
    width: 100%;
    margin-top: 8px;
  }
  .right-row {
    flex-wrap: wrap;
    gap: 12px;
    justify-content: flex-start;
  }
}
</style>

<!-- TODO:响应式设计 搜索栏外观 统一图标 检查导航栏各项功能 -->