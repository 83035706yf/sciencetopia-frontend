<template>
  <div class="knowledgegraph-container">
    <!-- 知识网络 -->
    <!-- <v-col cols="8" class="knowledge-graph"> -->
    <KnowledgeNetwork> <!-- Slot content for full-screen overlay -->
      <div class="fullscreen-overlay-content">
        <NodeCreationForm v-if="this.$store.state.displayNodeCreationForm"></NodeCreationForm>
        <LinkCreationForm v-else-if="this.$store.state.displayLinkCreationForm"></LinkCreationForm>
        <NodeInfo v-else></NodeInfo>
      </div>
    </KnowledgeNetwork>
    <!-- <p>一个可以查询节点内容和生成学习路径的知识网络</p> -->
    <!-- </v-col> -->
    <div class="non-fullscreen-content" :style="{ transform: `translateX(${offset}px)` }">
      <NodeCreationForm v-if="this.$store.state.displayNodeCreationForm"></NodeCreationForm>
      <LinkCreationForm v-else-if="this.$store.state.displayLinkCreationForm"></LinkCreationForm>
      <NodeInfo v-else></NodeInfo>
    </div>
  </div>

  <!-- 分割线 -->
  <!-- <v-divider color="text" opacity="0" style="margin-top: 100vh;"></v-divider> -->

  <!-- 动态推送 -->
  <div class="feed-container">
    <v-container id="feed-section">
      <v-row>
        <v-col class="trend-cols">
          <v-btn class="split-color-container" variant="plain">
            <h1 class="split-color-text">{{ $t('header.trend') }}</h1>
          </v-btn>
        </v-col>
        <v-col class="feed-cols dot-lattice-container">
          <v-btn variant="plain">
            <h1 class="feed-text">{{ $t('header.production') }}</h1>
          </v-btn>
          <v-divider color="secondary" :thickness="2" opacity="1"></v-divider>
          <v-btn variant="plain">
            <h1 class="feed-text">{{ $t('header.Learning') }}</h1>
          </v-btn>
          <v-divider color="secondary" :thickness="2" opacity="1"></v-divider>
          <v-btn variant="plain">
            <h1 class="feed-text">{{ $t('header.research') }}</h1>
          </v-btn>
        </v-col>
        <v-col class="refresh-col">
          <v-btn variant="plain">
            <h2><v-icon class="refresh-text">mdi-refresh</v-icon></h2>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-divider color="darkred" :thickness="2" opacity="1" style="margin-top: 40px; margin-left: 120px;"></v-divider>

    <v-spacer style="height: 60px;"></v-spacer>

    <v-container>
      <v-row>
        <v-col v-for="media in mediaList" :key="media.id" cols="3">
          <mediaFeed :cover="media.cover" :title="media.title" :author="media.author" :date="media.date"></mediaFeed>
        </v-col>
      </v-row>
    </v-container>
    <!-- Final Footer -->
    <DefaultFooterBar />
  </div>

</template>

<script>
import KnowledgeNetwork from '@/components/KnowledgeNetwork.vue';
import NodeInfo from '@/components/NodeInfo.vue';
import MediaFeed from '@/components/MediaFeed.vue';
import NodeCreationForm from '@/components/NodeCreationForm.vue';
import LinkCreationForm from '@/components/LinkCreationForm.vue';
import DefaultFooterBar from '@/components/DefaultFooterBar.vue';

export default {
  name: 'HomePage',
  components: { KnowledgeNetwork, NodeInfo, MediaFeed, NodeCreationForm, LinkCreationForm, DefaultFooterBar },
  data() {
    return {
      displayNodeCreationForm: false,
      isFullScreen: false,
      offset: 0,
      mediaList: [
        {
          id: 1,
          cover: require('@/assets/images/banner.png'),
          title: '动态推送功能开发中，敬请期待！',
          author: 'Sciencetopia团队',
          date: '2024-01-14'
        },
        {
          id: 2,
          cover: '',
          title: '',
          author: '',
          date: ''
        },
        {
          id: 3,
          cover: '',
          title: '',
          author: '',
          date: ''
        },
        {
          id: 4,
          cover: '',
          title: '',
          author: '',
          date: ''
        },
        // ... more media items ...
      ]
    }
  },

  methods: {
    handleScroll() {
      this.offset = window.scrollY; // Adjust speed multiplier for smooth movement
    },
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll); // Attach scroll listener
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll); // Cleanup scroll listener
  },
};
</script>

<style scoped>
@import "../assets/css/special-text.css";
@import "../assets/css/knowledge-graph.css";

.fullscreen-overlay-content {
  position: fixed;
  top: 6vh;
  /* Offset from the top */
  right: 2vw;
  /* Offset from the right */
  width: 20vw;
  /* Fixed width */
  height: auto;
  /* Allows content to adjust based on its own size */
  max-height: 40vh;
  /* Restrict height if needed */
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  /* Align items to the right */
  justify-content: flex-start;
  /* Align items to the top */
  z-index: 100000;
  /* Ensures it's always on top */
  pointer-events: auto;
  /* Allows interactions */
}

.non-fullscreen-content {
  position: absolute;
  top: 24vh;
  /* Offset from the top */
  right: 20px;
  /* Offset from the right */
  width: 20vw;
  /* Fixed width */
  height: auto;
  /* Allows content to adjust based on its own size */
  max-height: 40vh;
  /* Restrict height if needed */
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  /* Align items to the right */
  justify-content: flex-start;
  /* Align items to the top */
  z-index: 10;
  /* Ensures it's always on top */
  pointer-events: auto;
  /* Allows interactions */
  transition: transform 0.1s linear;
  /* Smooth horizontal movement */
}

.trend-cols {
  position: absolute;
  left: 5vw;
}

.feed-cols {
  position: absolute;
  left: 1vw;
  /* top: 110vh; */
}

.refresh-col {
  position: absolute;
  left: 20vw;
  top: 5vh;
  width: 60px;
}

.refresh-text {
  color: #C8001D;
}

.feed-container {
  position: relative;
  top: 100vh;
  left: 0vw;
  width: 100vw;
  background-color: rgba(232, 218, 189, 0.6);
  backdrop-filter: blur(10px);
  /* 磨砂效果 */
  -webkit-backdrop-filter: blur(10px);
  /* 兼容 Safari */
}
</style>