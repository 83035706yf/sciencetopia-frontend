<template>
  <div>
    <!-- 其他的个人中心内容 -->
    <PersonalInformation></PersonalInformation>

    <!-- 已收藏的知识网络图 -->
    <v-container class="knowledgegraph-container">
      <h3>我的收藏</h3>
      <v-row>
        <v-col cols="6" class="knowledge-graph">
          <FavoriteKnowledgeGraph />
        </v-col>
        <v-col cols="6">
          <NodeInfo></NodeInfo>
        </v-col>
      </v-row>
    </v-container>

    <!-- 已制定的学习计划 -->
    <v-container>
      <h3>我的学习计划</h3>
      <p>你还没有创建任何学习计划</p>
    </v-container>

    <!-- 已加入的学习小组 -->
    <v-container>
      <h3>我的学习小组</h3>
      <p>你还没有加入任何学习小组哦！</p>
    </v-container>
  </div>
</template>
  
<script>
import FavoriteKnowledgeGraph from './FavoriteKnowledgeGraph.vue';
import PersonalInformation from './PersonalInformation.vue';
import NodeInfo from './NodeInfo.vue';

export default {
  components: {
    FavoriteKnowledgeGraph,
    PersonalInformation,
    NodeInfo
  }
}
</script>

<style scoped>
/* @import "../assets/css/layout.css"; */
@import "../assets/css/knowledge-graph.css";
/* #cy {
  width: 800px;
  height: 500px;
  border: 1px solid #ccc;
} */

/* #cy canvas {
  position: relative !important;
  margin: auto !important;
} */

</style>