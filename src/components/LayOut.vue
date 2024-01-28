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
        <div class="scrollToSection-container">
          <v-btn class="Chinese-text-btn" variant="text" @click="scrollToSection">全部动态</v-btn>
        </div>
        <v-row>
          <v-col cols="1">
            <v-btn style="min-width: 0px;" class="Chinese-text-btn" variant="text" @click="scrollToSection">产</v-btn>
          </v-col>
          <v-col cols="1" class="dot-col">
            <div class="dot">•</div>
          </v-col>
          <v-col cols="1">
            <v-btn style="min-width: 0px;" class="Chinese-text-btn" variant="text" @click="scrollToSection">学</v-btn>
          </v-col>
          <v-col cols="1" class="dot-col">
            <div class="dot">•</div>
          </v-col>
          <v-col cols="1">
            <v-btn style="min-width: 0px;" class="Chinese-text-btn" variant="text" @click="scrollToSection">研</v-btn>
          </v-col>
        </v-row>
        <div class="header-bottom">
          <!-- 搜索栏 -->
          <div class="search-container">
            <div class="search-form">
              <input v-model="searchQuery" type="text" placeholder="我想要了解..." />
              <button @click="searchNode" class="search-btn">
                <font-awesome-icon :icon="['fas', 'search']" />
              </button>
            </div>
          </div>
        </div>
        <!-- 显示学习小组按钮 -->
        <v-btn class="Chinese-text-btn" variant="text" @click="RouteToStudyGroup">学习小组</v-btn>
        <!-- 显示学习规划按钮 -->
        <v-btn class="Chinese-text-btn" variant="text" @click="dialog = true">学习计划</v-btn>

        <v-dialog v-model="dialog" persistent max-width="1600px">
          <v-card>
            <v-card-title>学习计划</v-card-title>
            <v-card-text>
              <LearningPlanner ref="learningPlanner" @update:showStudyPlan="handleShowStudyPlanUpdate">
              </LearningPlanner>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text v-if="showStudyPlan" @click="triggerSavePlan">保存学习计划</v-btn>
              <v-btn color="blue darken-1" text @click="closeDialog">关闭</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- 显示当前用户的用户名 -->
        <div class="navbar-right">
          <LogInPartial></LogInPartial>
        </div>
        <!-- 夜间模式切换 -->
        <div class="dark-mode-switch">
          <button class="btn" id="theme-toggler" @click="toggleTheme">
            <font-awesome-icon :icon="['fas', 'sun']" style="color: #000000;" />
          </button>
        </div>
        <link :href="themePath" rel="stylesheet">
      </div>
    </header>

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
import LearningPlanner from './LearningPlanner.vue';
import debounce from 'lodash/debounce';
import { apiClient } from '@/api';
// import { useStore } from 'vuex';

export default {
  name: 'LayOut',
  data() {
    return {
      isDarkThemeEnabled: false,
      themePath: '',
      searchQuery: '',
      searchResults: [],
      isLoading: false,
      dialog: false,
      showStudyPlan: false,
    };
  },

  created() {
    this.debouncedSearch = debounce(this.searchNode, 300);
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
    },

    scrollToSection() {
      // 获取目标元素的位置
      const section = document.getElementById('feed-section');
      console.log("section:", section);
      if (section) {
        const yOffset = -60; // 调整偏移量，根据需要修改
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;

        // 滚动到指定位置
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    },

    async searchNode() {
      if (!this.searchQuery.trim()) {
        this.searchResults = [];
        return;
      }

      this.isLoading = true;
      try {
        const response = await apiClient.get('/KnowledgeGraph/Search', {
          params: { query: this.searchQuery }
        });
        const foundNode = response.data;
        if (foundNode) {
          this.$store.commit('SET_HIGHLIGHTNODE', foundNode.identity);
        } else {
          console.log('Node not found');
        }
      } catch (error) {
        console.error('Error during search:', error);
        // Handle error appropriately
      } finally {
        this.isLoading = false;
      }
    },

    RouteToStudyGroup() {
      this.$router.push({ name: 'studyGroup' });
    },

    triggerSavePlan() {
      this.$refs.learningPlanner.savePlan();
    },

    closeDialog() {
      this.showStudyPlan = false;
      // Any other logic needed to handle the closing of the dialog
      this.dialog = false; // Assuming 'dialog' is a local data property controlling the dialog visibility
    },

    handleShowStudyPlanUpdate(value) {
      this.showStudyPlan = value;
    },
  },

  components: { LogInPartial, LearningPlanner }
}
</script>


<style scoped>
@import "../assets/css/layout.css";
@import "../assets/css/header.css";
@import "../assets/css/switches.css";
@import "../assets/css/footer.css";

.planner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.planner-card {
  max-width: 1600px;
  /* 或者其他合适的宽度 */
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, .3);
}

.header-button {
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 500;
}

/* 模糊背景 */
body.modal-open {
  overflow: hidden;
}

body.modal-open .main-content {
  filter: blur(5px);
}

.Chinese-text-btn {
  font-family: 'Chinese-font', sans-serif;
  font-size: 16px;
}

.dot-col {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 30px;
  padding-right: 0px;
  /* Adjust padding as needed for spacing */
}

.dot {
  display: inline-block;
  text-align: center;
}

@media (max-width: 1600px) {
  .dot-col .dot {
    font-size: 12px;
    /* Adjust dot size for small screens */
  }

  .Chinese-text-btn {
    font-size: 12px;
    /* Adjust button text size for small screens */
  }

  .header-bottom {
    width: 10%;
    height: 10%;
    padding-left: 30px;
  }

  .search-container {
    width: 50%;
    height: 10%;
    padding: 0px;
  }

  .search-btn {
    font-size: 12px;
    padding: 0px;
  }

  .search-form input {
    border: 0px;
    margin: 0px;
    padding-left: 0px;
    border-radius: px;
  }
}</style>
