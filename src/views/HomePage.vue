<template>
  <v-container class="knowledgegraph-container">
    <!-- 知识网络 -->
    <v-row>
      <v-col cols="6" class="knowledge-graph">
        <KnowledgeNetwork></KnowledgeNetwork>
        <!-- <p>一个可以查询节点内容和生成学习路径的知识网络</p> -->
      </v-col>
      <v-col cols="6">
        <!-- <h3>知识描述</h3> -->
        <NodeInfo></NodeInfo>
        <!-- <p>当查询某一知识节点内容时，显示该节点内容的描述；当查询学习路径时，显示学习路径内容</p> -->
      </v-col>
    </v-row>
  </v-container>

    <!-- 分割线 -->
    <v-divider style="margin-top: 100px;"></v-divider>

    <!-- 动态推送 -->
  <v-container id="feed-section">
    <v-row>
      <v-btn text>
        <h3>科学前沿</h3>
      </v-btn>
      <v-btn text>
        <h3>项目动态</h3>
      </v-btn>
      <v-btn text>
        <h3>全部项目</h3>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-row>

    <v-row>
      <v-col v-for="n in 9" :key="n" cols="4">
        <!-- 这里可以放置新闻项的内容 -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import KnowledgeNetwork from '@/components/KnowledgeNetwork.vue';
import NodeInfo from '@/components/NodeInfo.vue';

export default {
  name: 'HomePage',
  components: { KnowledgeNetwork, NodeInfo }
};
</script>

<style scoped>
.knowledgegraph-container {
  margin: 20px;
  padding: 10px;
}

.knowledge-graph {
  position: relative;
  /* 添加圆角边框 */
  border: 2px solid #000; /* 这里设置边框的粗细和颜色 */
  border-radius: 10px; /* 这里设置边框的圆角大小 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 可选：添加阴影效果以提升视觉效果 */
}
</style>