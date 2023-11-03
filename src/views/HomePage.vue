<template>
  <v-container>
    <!-- 知识网络 -->
    <v-row>
      <v-col cols="12">
        <KnowledgeNetwork></KnowledgeNetwork>
        <!-- <p>一个可以查询节点内容和生成学习路径的知识网络</p> -->
      </v-col>
      <v-col cols="6">
        <h3>知识描述</h3>
        <NodeInfo></NodeInfo>
        <!-- <p>当查询某一知识节点内容时，显示该节点内容的描述；当查询学习路径时，显示学习路径内容</p> -->
      </v-col>
      <v-col>
        <LearningPlan></LearningPlan>
      </v-col>
    </v-row>

    <!-- 分割线 -->
    <v-divider></v-divider>

    <!-- 动态推送 -->
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
import LearningPlan from '@/components/LearningPlan.vue';
import NodeInfo from '@/components/NodeInfo.vue';

export default {
    name: 'HomePage',
    components: { KnowledgeNetwork, NodeInfo, LearningPlan }
};
</script>

<style scoped>
/* 你可以在这里添加或修改样式 */
</style>