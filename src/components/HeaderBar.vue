<template>
  <div class="large-header">
    <v-container class="header-grid" fluid>
      <!-- Logo -->
      <div class="logo-section">
        <v-btn
          variant="plain"
          class="logo-btn"
          @click.prevent="backToHomePage"
        >
          <img
            :src="isSmallScreen ? smallLogo : largeLogo"
            alt="Logo"
            class="responsive-logo"
          />
        </v-btn>
      </div>

      <!-- Search -->
      <div class="search-section">
        <v-text-field
          v-model="searchQuery"
          :placeholder="$t('searchbar.iwanttolearn')"
          variant="plain"
          density="comfortable"
          hide-details
          clearable
          @keydown.enter.prevent="globalSearch"
          append-inner-icon="mdi-magnify"
          @click:append-inner="globalSearch"
          class="search-input"
        />
      </div>

      <!-- Icons (nav + actions) -->
      <div class="icons-section">
        <!-- 趋势 / Trend -->
        <div class="icon-item">
          <v-tooltip :text="$t('header.trend')" location="bottom" open-delay="300" :disabled="!isSmallScreen">
            <template v-slot:activator="slotProps">
              <v-btn
                v-bind="slotProps.props"
                class="icon-btn"
                variant="plain"
                @click.prevent="scrollToSection"
              >
                <v-icon :size="iconSize">mdi-rss</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <span v-if="!isSmallScreen" class="icon-label">{{ $t('header.trend') }}</span>
        </div>

        <!-- 学习小组 / StudyGroup -->
        <div class="icon-item">
          <v-tooltip :text="$t('header.studygroup')" location="bottom" open-delay="300" :disabled="!isSmallScreen">
            <template v-slot:activator="slotProps">
              <v-btn
                v-bind="slotProps.props"
                class="icon-btn"
                variant="plain"
                @click.prevent="RouteToStudyGroup"
              >
                <v-icon :size="iconSize">mdi-account-group</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <span v-if="!isSmallScreen" class="icon-label">{{ $t('header.studygroup') }}</span>
        </div>

        <!-- 学习计划 / StudyPlan -->
        <div class="icon-item">
          <v-tooltip :text="$t('header.studyplan')" location="bottom" open-delay="300" :disabled="!isSmallScreen">
            <template v-slot:activator="slotProps">
              <v-btn
                v-bind="slotProps.props"
                class="icon-btn"
                variant="plain"
                @click.prevent="handleStudyPlan"
              >
                <v-icon :size="iconSize">mdi-book-open-variant</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <span v-if="!isSmallScreen" class="icon-label">{{ $t('header.studyplan') }}</span>
        </div>

        <!-- 登录 / Login -->
        <div class="icon-item">
          <v-tooltip :text="$t('header.login')" location="bottom" open-delay="300" :disabled="!isSmallScreen">
            <template v-slot:activator="slotProps">
              <v-btn
                v-bind="slotProps.props"
                class="icon-btn"
                variant="plain"
                @click.prevent="login"
              >
                <v-icon :size="iconSize">mdi-account</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <span v-if="!isSmallScreen" class="icon-label">{{ $t('header.login') }}</span>
        </div>

        <!-- 消息 / Messages -->
        <div class="icon-item">
          <v-tooltip :text="$t('header.messages')" location="bottom" open-delay="300" :disabled="!isSmallScreen">
            <template v-slot:activator="slotProps">
              <v-btn
                v-bind="slotProps.props"
                class="icon-btn"
                variant="plain"
              >
                <v-icon :size="iconSize">mdi-bell</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <span v-if="!isSmallScreen" class="icon-label">{{ $t('header.messages') }}</span>
        </div>

        <!-- 明/暗模式切换 -->
        <div class="icon-item">
          <v-tooltip
            :text="isDarkThemeEnabled ? $t('header.darkmode') : $t('header.lightmode')"
            location="bottom"
            open-delay="300"
            :disabled="!isSmallScreen"
          >
            <template v-slot:activator="slotProps">
              <v-btn
                v-bind="slotProps.props"
                class="icon-btn"
                variant="plain"
                @click.prevent="toggleTheme"
              >
                <v-icon :size="iconSize">
                  {{ isDarkThemeEnabled ? 'mdi-weather-night' : 'mdi-weather-sunny' }}
                </v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <span v-if="!isSmallScreen" class="icon-label">
            {{ isDarkThemeEnabled ? $t('header.darkmode') : $t('header.lightmode') }}
          </span>
        </div>
      </div>

      <!-- 语言切换栏 -->
      <div class="language-section">
        <v-select
          v-model="$i18n.locale"
          :items="languageOptions"
          density="comfortable"
          hide-details
          variant="plain"
          class="language-select"
          @update:model-value="handleLanguageChange"
          :style="computeLangWidthStyle"
        />
      </div>
    </v-container>
  </div>
</template>
<script>
import { debounce } from 'lodash-es';

export default {
  name: "HeaderBar",
  data() {
    return {
      isDarkThemeEnabled: false,
      searchQuery: '',
      largeLogo: require('@/assets/images/logo_banner.png'),
      smallLogo: require('@/assets/images/logo.png'),
      isSmallScreen: window.innerWidth <= 1200,
      languageOptions: [
        { title: 'English', value: 'en' },
        { title: 'Chinese', value: 'zh' }
      ],
      langTextWidth: 0 // 用来存储当前选项文本的实际宽度
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
    iconSize() {
      return this.isSmallScreen ? 24 : 32;
    },
    // 根据测量到的文字宽度，动态计算 V-Select 的 min-width / max-width
    computeLangWidthStyle() {
      // 若测量结果为 0 或为空，给个默认值
      const baseWidth = this.langTextWidth || 30;
      // 需求: 最小值 = 2 * 文本宽度, 最大值 = 2.5 * 文本宽度
      const minW = 2 * baseWidth;
      const maxW = 2.5 * baseWidth;
      return {
        minWidth: `${minW}px`,
        maxWidth: `${maxW}px`,
      };
    }
  },
  methods: {
    handleResize() {
      this.isSmallScreen = window.innerWidth <= 1200;
    },
    login() {
      this.$router.push({ name: 'login' });
    },
    toggleTheme() {
      this.isDarkThemeEnabled = !this.isDarkThemeEnabled;
      // 你项目中的实际主题切换逻辑...
    },
    backToHomePage() {
      this.$router.push({ name: 'HomePage' });
    },
    scrollToSection() {
      const section = document.getElementById('feed-section');
      if (section) {
        const yOffset = -60;
        const y = section.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    },
    async globalSearch() {
      const query = this.searchQuery ? this.searchQuery.trim() : '';
      if (!query) {
        console.log('Search query is empty!');
        return;
      }
      // 省略了搜索逻辑 ...
      const path = this.$router.resolve({
        name: 'searchList',
        query: { q: query }
      }).href;
      window.open(path, '_blank');
    },
    RouteToStudyGroup() {
      this.$router.push({ name: 'studyGroupList' });
    },
    handleStudyPlan() {
      if (!this.isAuthenticated) {
        // 未登录 -> 提示或跳转登录
        alert("请先登录再查看学习计划");
      } else {
        // 已登录 -> 打开学习计划对话框
        this.$emit('showStudyPlanDialog', true);
      }
    },
    handleLanguageChange(val) {
      this.$i18n.locale = val;
      this.$vuetify.locale.current = val;
      this.$nextTick(() => {
        this.measureLangTextWidth();
      });
    },
    // 用一个隐藏 span 测量选项文字的宽度
    measureLangTextWidth() {
      const tempSpan = document.createElement('span');
      const selectedItem = this.languageOptions.find(
        (item) => item.value === this.$i18n.locale
      );
      const text = selectedItem ? selectedItem.title : '';
      tempSpan.innerText = text;
      // 让它不换行、不可见，但以正常的字体渲染
      tempSpan.style.position = 'absolute';
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.whiteSpace = 'nowrap';
      tempSpan.style.fontSize = '14px'; // 跟 v-select 同样的字体设定
      document.body.appendChild(tempSpan);
      this.langTextWidth = tempSpan.offsetWidth;
      document.body.removeChild(tempSpan);
    }
  },
  created() {
    this.debouncedResize = debounce(this.handleResize, 100);
    this.handleResize();
  },
  mounted() {
    window.addEventListener('resize', this.debouncedResize);
    this.measureLangTextWidth();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.debouncedResize);
  }
};
</script>
<style scoped>
.large-header {
  background-color: rgba(232, 218, 189, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  z-index: 1000;

  /* 大屏时，更大一些的上下内边距，让Logo居中 */
  padding-top: 20px;
  padding-bottom: 20px;
}

.header-grid {
  display: grid;
  grid-template-columns: auto 1fr auto auto; /* logo, search, icons, language */
  grid-template-areas: "logo search icons language";
  align-items: center;
  column-gap: 24px;
  padding: 0 24px;
  position: relative;
}

/* Logo区域 */
.logo-section {
  grid-area: logo;
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  overflow: visible; /* 允许 Logo 溢出 */
}

/* Logo按钮 */
.logo-btn {
  height: 100%;
  padding: 0; /* 让图片本身来控制大小 */
}

/* 大屏下Logo更大，小屏Logo更小且贴边 */
.responsive-logo {
  display: block;
  transition: all 0.3s ease;
  /* 大屏: 比原先更大一些 */
  height: 64px;
  width: auto;
}

@media (max-width: 1200px) {
  .responsive-logo {
    /* 小屏: 再缩小一点 */
    height: 48px;
  }
}

/* 搜索区域 */
.search-section {
  grid-area: search;
  max-width: 600px; /* 根据需求调整 */
  width: 100%;
  display: flex;
  align-items: center; /* 垂直居中 */
  position: relative; /* 为了绝对定位搜索按钮 */
}

/* 修改搜索输入 */
.search-input {
  background-color: rgba(255, 255, 255, 1);
  border: none; /* 移除边框线 */
  border-radius: 999px; /* 两侧完全圆形 */
  padding-left: 16px;
  padding-right: 48px; /* 为搜索按钮留出空间 */
  box-shadow: 0 0 0 0 transparent; /* 移除默认的v-text-field阴影 */
  position: relative; /* 相对定位，为内部的绝对定位做参照 */
  height: 48px; /* 固定高度，确保垂直居中 */
}

/* 确保 v-input__slot 占满高度并移除边框 */
.search-input .v-input__slot {
  border: none !important; /* 确保没有边框 */
  box-shadow: none !important;
  height: 100%; /* 占满父容器的高度 */
  display: flex;
  align-items: center; /* 垂直居中内容 */
}

/* 绝对定位的 append-inner 图标，使其水平和垂直居中 */
.search-input .v-field__append-inner {
  position: absolute;
  top: 50%;
  right: 16px; /* 根据需要调整与右侧的距离 */
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer; /* 显示为可点击 */
}

/* 调整 append-inner 中图标的大小（可选） */
.search-input .v-field__append-inner i.v-icon {
  font-size: 1.25rem; /* 根据需要调整图标大小 */
}

/* 图标区域 */
.icons-section {
  grid-area: icons;
  display: flex;
  flex-wrap: nowrap; /* 确保单行 */
  align-items: center;
  gap: 16px; /* 图标间距 */
  overflow-x: auto; /* 如果图标过多，可以滚动 */
}

/* 隐藏滚动条但允许滚动 */
.icons-section::-webkit-scrollbar {
  display: none;
}
.icons-section {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* 语言切换栏 */
.language-section {
  grid-area: language;
  display: flex;
  align-items: center;
  margin-left: 16px; /* 根据需要调整 */
}

/* 响应式调整 */
@media (max-width: 1600px) {
  .header-grid {
    grid-template-columns: auto 1fr auto auto;
  }
}

@media (max-width: 1200px) {
  .header-grid {
    grid-template-columns: auto 1fr auto;
    grid-template-areas:
      "logo icons language"
      "search search search";
    row-gap: 12px; /* 行间距 */
  }

  .search-section {
    margin: 0 auto;
    width: 100%;
  }

  .icons-section {
    flex-wrap: nowrap; /* 保持单行 */
    gap: 12px; /* 压缩间距 */
    justify-content: flex-start;
  }

  .icon-btn {
    width: 36px;
    height: 36px;
  }

  .icon-label {
    font-size: 14px;
    margin-top: 6px;
    text-align: center;
    white-space: nowrap;
  }

  .language-section {
    margin-left: 24px;
  }
}

@media (max-width: 800px) {
  .header-grid {
    grid-template-columns: auto;
    grid-template-areas:
      "logo"
      "search"
      "icons"
      "language";
    row-gap: 8px;
  }

  .large-header {
    padding: 10px 16px; /* 调整内边距 */
  }

  .responsive-logo {
    height: 40px;
  }

  .search-section {
    margin: 10px 5px 20px 5px;
    min-width: 100%;
  }

  .icons-section {
    flex-wrap: wrap; /* 在极窄屏幕下换行 */
    gap: 8px; /* 进一步压缩间距 */
    justify-content: center;
  }

  .icon-btn {
    width: 32px;
    height: 32px;
  }

  .icon-label {
    display: none;
  }

  .language-section {
    justify-content: center; /* 居中对齐 */
    margin-left: 0; /* 移除左边距 */
  }
}

/* 每个图标+文本组合 */
.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 按钮样式 */
.icon-btn {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  transform: scale(1.05);
  background-color: rgba(255, 255, 255, 0.1);
}

/* 图标下方的文字 */
.icon-label {
  font-size: 14px;
  margin-top: 6px;
  text-align: center;
  white-space: nowrap;
}

/* 语言选择器 - 宽度由JS动态控制 */
.language-select {
  text-align: center;
  /* 其他基础样式保持 */
}
</style>
