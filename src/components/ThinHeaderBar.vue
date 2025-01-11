<template>
  <v-container fluid class="header-container">
    <v-row align="center" justify="space-between" class="header-row">
      <!-- 左侧部分：Logo 和 搜索框 -->
      <v-col cols="auto" class="left-section">
        <!-- Logo -->
        <v-btn
          variant="plain"
          class="logo-btn"
          @click="backToHomePage"
          aria-label="返回主页"
        >
          <img :src="logoSrc" alt="Logo" class="logo-image" />
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
            aria-label="搜索"
            ref="searchInput"
          ></v-text-field>
        </div>
      </v-col>

      <!-- 右侧部分：导航链接 和 用户操作 -->
      <v-col cols="auto" class="right-section">
        <v-row align="center" justify="end" class="right-row">
          <!-- 导航链接 -->
          <ReusableIconButton
            v-for="(item, index) in navItems"
            :key="index"
            :icon="item.icon"
            :label="item.label"
            @click="item.action"
          />

          <!-- 深色模式切换 -->
          <ReusableIconButton
            :icon="themeIcon"
            :label="themeLabel"
            @click="toggleTheme"
          />

          <!-- 语言切换器 -->
          <v-select
            v-model="currentLocale"
            :items="languageOptions"
            dense
            hide-details
            solo
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

    <!-- 登录注册对话框 -->
    <v-dialog v-model="loginRegisterDialog" max-width="400px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">
            {{ isLogin ? $t('login.title') : $t('register.title') }}
          </span>
        </v-card-title>
        <v-card-text>
          <div v-if="isLogin">
            <LogInPartial @login-success="handleLoginSuccess" />
            <v-divider class="my-4"></v-divider>
            <div class="text-center">
              {{ $t('login.noAccount') }}
              <v-btn text @click="switchToRegister">
                {{ $t('register.register') }}
              </v-btn>
            </div>
          </div>
          <div v-else>
            <v-form @submit.prevent="registerUser">
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
              <v-btn type="submit" color="primary">
                {{ $t('register.register') }}
              </v-btn>
              <v-btn text @click="switchToLogin">
                {{ $t('register.alreadyHaveAccount') }}
              </v-btn>
            </v-form>
            <MessageAlert v-if="alertMessage" :message="alertMessage" @close="alertMessage = ''" />
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { debounce } from 'lodash-es';
import LogInPartial from './LogInPartial.vue';
import MessageAlert from './MessageAlert.vue';
import ReusableIconButton from './ReusableIconButton.vue'; // 新增的可复用按钮组件

export default {
  name: "ThinHeaderBar",
  components: { LogInPartial, MessageAlert, ReusableIconButton },
  data() {
    return {
      isDarkThemeEnabled: false,
      searchQuery: '',
      isSmallScreen: window.innerWidth <= 1200,
      languageOptions: [
        { title: 'English', value: 'en' },
        { title: '中文', value: 'zh' },
        // 可根据需要添加更多语言选项
      ],
      currentLocale: this.$i18n.locale,
      isLogin: true, // 控制显示登录或注册表单
      loginRegisterDialog: false, // 控制对话框显示
      registerUsername: '',
      registerEmail: '',
      registerPassword: '',
      registerConfirmPassword: '',
      alertMessage: '', // 用于显示警告信息
      largeLogo: require('@/assets/images/logo_banner.png'),
      smallLogo: require('@/assets/images/logo.png'),
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
    logoSrc() {
      return this.isSmallScreen ? this.smallLogo : this.largeLogo;
    },
    iconSize() {
      return this.isSmallScreen ? 24 : 32;
    },
    themeIcon() {
      return this.isDarkThemeEnabled ? 'mdi-weather-night' : 'mdi-weather-sunny';
    },
    themeLabel() {
      return this.isDarkThemeEnabled ? this.$t('header.darkmode') : this.$t('header.lightmode');
    },
    themeTooltip() {
      return this.isDarkThemeEnabled
        ? this.$t('header.darkmode')
        : this.$t('header.lightmode');
    },
    navItems() {
      return [
        {
          icon: 'mdi-rss',
          label: this.$t('header.trend'),
          action: this.scrollToSection,
        },
        {
          icon: 'mdi-account-group',
          label: this.$t('header.studygroup'),
          action: this.RouteToStudyGroup,
        },
        {
          icon: 'mdi-book-open-variant',
          label: this.$t('header.studyplan'),
          action: this.showStudyPlanDialog,
        },
      ];
    },
  },
  methods: {
    handleResize() {
      this.isSmallScreen = window.innerWidth <= 1200;
    },
    toggleTheme() {
      this.isDarkThemeEnabled = !this.isDarkThemeEnabled;
      // 主题切换逻辑...
      this.$vuetify.theme.dark = this.isDarkThemeEnabled;
    },
    backToHomePage() {
      this.$router.push({ name: 'HomePage' }); // 返回主页
    },
    scrollToSection() {
      const section = document.getElementById('feed-section');
      if (section) {
        const yOffset = -60; // 调整偏移量，根据需要修改
        const y = section.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    },
    async globalSearch() {
      const query = this.searchQuery.trim();
      if (!query) {
        this.$refs.searchInput.focus();
        return;
      }
      try {
        const path = this.$router.resolve({
          name: 'searchList',
          query: { q: query }
        }).href;
        window.open(path, '_blank');
      } catch (error) {
        console.error('Error searching:', error);
      }
    },
    RouteToStudyGroup() {
      this.$router.push({ name: 'studyGroupList' });
    },
    showStudyPlanDialog() {
      if (!this.isAuthenticated) {
        this.alertMessage = this.$t('pleaseLoginToViewStudyPlan');
      } else {
        this.loginRegisterDialog = true;
        this.isLogin = true;
      }
    },
    switchToRegister() {
      this.isLogin = false;
      this.alertMessage = '';
    },
    switchToLogin() {
      this.isLogin = true;
      this.alertMessage = '';
    },
    async loginUser() {
      try {
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
      if (this.registerPassword !== this.registerConfirmPassword) {
        this.alertMessage = this.$t('register.passwordMismatch');
        return;
      }
      try {
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
    handleLoginSuccess() {
      this.loginRegisterDialog = false;
      // 其他登录成功后的逻辑...
    },
    changeLanguage(val) {
      this.$i18n.locale = val;
      this.$vuetify.locale = val;
    },
  },
  created() {
    this.debouncedResize = debounce(this.handleResize, 100);
  },
  mounted() {
    window.addEventListener('resize', this.debouncedResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.debouncedResize);
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

.language-select {
  max-width: 100px;
}

/* 响应式调整 */
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
