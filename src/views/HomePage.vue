<template>
  <div>
    <!-- 知识网络 -->
    <section class="container">
      <div class="knowledge-network">
        <div class="knowledge-network-figure">
          <i class="fas fa-box-open"></i>
          <h3>自动关联知识网络</h3>
          <p>一个可以查询节点内容和生成学习路径的知识网络</p>
        </div>
        <div class="knowledge-network-description">
          <i class="fas fa-cogs"></i>
          <h3>知识描述</h3>
          <p>当查询某一知识节点内容时，显示该节点内容的描述；当查询学习路径时，显示学习路径内容</p>
        </div>
      </div>
    </section>

    <!-- 分割线 -->
    <div class="break-nav">
      <div class="break">
        <i><img src="../assets/images/red_black_bar.svg" alt="bar-break"></i>
        <i><img src="../assets/images/black_line.svg" alt="line-break"></i>
      </div>
      <div class="news-nav">
        <button type="word" class="btn">
          <h3>科学前沿</h3>
        </button>
        <button type="word" class="btn">
          <h3>项目动态</h3>
        </button>
        <button type="word" class="btn">
          <h3>全部项目</h3>
        </button>
        <button type="word" class="btn">
          <i class="fas fa-refresh"></i>
        </button>
      </div>
    </div>

    <!-- 动态推送 -->
    <section class="container">
      <div class="news-grid">
        <i class="news-grid-item"></i>
        <i class="news-grid-item"></i>
        <i class="news-grid-item"></i>
        <i class="news-grid-item"></i>
        <i class="news-grid-item"></i>
        <i class="news-grid-item"></i>
        <i class="news-grid-item"></i>
        <i class="news-grid-item"></i>
        <i class="news-grid-item"></i>
      </div>
    </section>
  </div>
</template>
  
<script>
export default {
  name: 'HomePage',
  data() {
    return {
      // 这里可以定义您需要的数据
    };
  },
  methods: {
    // 这里可以定义您需要的方法
  }
};
</script>
  
<style scoped>
@import "../assets/css/home.css";
@import "../assets/css/layout.css";
@import "../assets/css/knowledge-network.css";
@import "../assets/css/news-recommendation.css";
</style>
  