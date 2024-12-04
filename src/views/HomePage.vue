<template>
  <v-container class="knowledgegraph-container">
    <!-- 知识网络 -->
    <v-row class="knowledge-graph">
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
      <div class="non-fullscreen-content">
        <NodeCreationForm v-if="this.$store.state.displayNodeCreationForm"></NodeCreationForm>
        <LinkCreationForm v-else-if="this.$store.state.displayLinkCreationForm"></LinkCreationForm>
        <NodeInfo v-else></NodeInfo>
      </div>
    </v-row>
  </v-container>

  <!-- 分割线 -->
  <v-divider style="margin-top: 100px;"></v-divider>

  <!-- 动态推送 -->
  <v-container id="feed-section">
    <v-row>
      <v-btn variant="plain">
        <h3>{{ $t('header.trend') }}</h3>
      </v-btn>
      <v-btn variant="plain">
        <h3>{{ $t('header.production') }}</h3>
      </v-btn>•
      <v-btn variant="plain">
        <h3>{{ $t('header.Learning') }}</h3>
      </v-btn>•
      <v-btn variant="plain">
        <h3>{{ $t('header.research') }}</h3>
      </v-btn>
      <v-btn variant="plain">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-row>
  </v-container>
  <v-container>
    <v-row>
      <v-col v-for="media in mediaList" :key="media.id" cols="6">
        <mediaFeed :cover="media.cover" :title="media.title" :author="media.author" :date="media.date"></mediaFeed>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import KnowledgeNetwork from '@/components/KnowledgeNetwork.vue';
import NodeInfo from '@/components/NodeInfo.vue';
import MediaFeed from '@/components/MediaFeed.vue';
import NodeCreationForm from '@/components/NodeCreationForm.vue';
import LinkCreationForm from '@/components/LinkCreationForm.vue';

export default {
  name: 'HomePage',
  components: { KnowledgeNetwork, NodeInfo, MediaFeed, NodeCreationForm, LinkCreationForm },
  data() {
    return {
      displayNodeCreationForm: false,
      isFullScreen: false,
      mediaList: [
        {
          id: 1,
          cover: require('@/assets/images/banner.png'),
          title: '动态推送功能开发中，敬请期待！',
          author: 'Sciencetopia团队',
          date: '2024-01-14'
        },
        // ... more media items ...
      ]
    }
  }
};
</script>

<style scoped>
@import "../assets/css/knowledge-graph.css";

.knowledgegraph-container {
  margin-left: 0px;
  padding: 10px;
}

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
  position: relative;
  top: -800px;
  /* Offset from the top */
  right: -78vw;
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
  z-index: 1000000;
  /* Ensures it's always on top */
  pointer-events: auto;
  /* Allows interactions */
}
</style>