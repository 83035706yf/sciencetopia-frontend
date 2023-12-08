<template>
  <div>
    <!-- 其他的个人中心内容 -->

    <!-- 已收藏的知识网络图 -->
    <h3>我的收藏</h3>
    <FavoriteKnowledgeGraph />
    <NodeInfo></NodeInfo>

    <!-- 已制定的学习计划 -->
    <h3>我的学习计划</h3>
    <p>你还没有创建任何学习计划</p>

    <!-- 已加入的学习小组 -->
    <h3>我的学习小组</h3>
    <p>你还没有加入任何学习小组哦！</p>
  </div>
</template>
  
<script>
import FavoriteKnowledgeGraph from './FavoriteKnowledgeGraph.vue';
import NodeInfo from './NodeInfo.vue';

export default {
  components: {
    FavoriteKnowledgeGraph,
    NodeInfo
  }
}
</script>

<style scoped>
#cy {
    width: 800px;
    height: 500px;
    border: 1px solid #ccc;
}

#cy canvas {
    position: relative !important;
    margin: auto !important;
}
</style>