<template>
  <v-container class="knowledgegraph-container">
    <!-- 知识网络 -->
    <v-row>
      <v-col cols="6" class="knowledge-graph">
        <KnowledgeNetwork> <!-- Slot content for full-screen overlay -->
          <div class="fullscreen-overlay-content">
            <NodeCreationForm v-if="this.$store.state.displayNodeCreationForm"></NodeCreationForm>
            <LinkCreationForm v-else-if="this.$store.state.displayLinkCreationForm"></LinkCreationForm>
            <NodeInfo v-else></NodeInfo>
          </div>
        </KnowledgeNetwork>
        <!-- <p>一个可以查询节点内容和生成学习路径的知识网络</p> -->
      </v-col>
      <v-col cols="6" v-if="!isFullScreen">
        <!-- <h3>知识描述</h3> -->
        <NodeCreationForm v-if="this.$store.state.displayNodeCreationForm"></NodeCreationForm>
        <LinkCreationForm v-else-if="this.$store.state.displayLinkCreationForm"></LinkCreationForm>
        <NodeInfo v-else></NodeInfo>
        <!-- <p>当查询某一知识节点内容时，显示该节点内容的描述；当查询学习路径时，显示学习路径内容</p> -->
      </v-col>
    </v-row>
  </v-container>

  <!-- 分割线 -->
  <v-divider style="margin-top: 100px;"></v-divider>

  <!-- 动态推送 -->
  <v-container id="feed-section">
    <v-row>
      <v-btn variant="text">
        <h3>全部动态</h3>
      </v-btn>
      <v-btn variant="text">
        <h3>产</h3>
      </v-btn>•
      <v-btn variant="text">
        <h3>学</h3>
      </v-btn>•
      <v-btn variant="text">
        <h3>研</h3>
      </v-btn>
      <v-btn variant="text">
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
  margin: 20px;
  padding: 10px;
}

.fullscreen-overlay-content {
  position: fixed;
  top: 6vh; /* Offset from the top */
  right: 2vw; /* Offset from the right */
  width: 20vw; /* Fixed width */
  height: auto; /* Allows content to adjust based on its own size */
  max-height: 40vh; /* Restrict height if needed */
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Align items to the right */
  justify-content: flex-start; /* Align items to the top */
  z-index: 100000; /* Ensures it's always on top */
  pointer-events: auto; /* Allows interactions */
}

</style>