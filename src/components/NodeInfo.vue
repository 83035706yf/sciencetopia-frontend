<template>
  <v-card v-if="selectedNode">
    <v-card-title>{{ selectedNode.name }}</v-card-title>
    <v-card-text v-html="selectedNode.description.replace(/\n/g, '<br>')"></v-card-text>
    <v-card-item v-if="linkPreview" class="link-preview-container">
      <a :href="selectedNode.link" target="_blank" class="link-preview">
        <h3 class="preview-title">{{ linkPreview.title }}</h3>
        <img :src="linkPreview.image" alt="缩略图" class="preview-image" />
        <p>{{ linkPreview.description }}</p>
      </a>
    </v-card-item>
  </v-card>
  <v-card v-else class="pb-6">
    <v-card-text style="color: grey;">
      获取知识，从点击一个节点开始。
    </v-card-text>
  </v-card>
</template>
  
<script>
import { ref, computed, watch } from 'vue';
import { apiClient } from '@/api';
import { useStore } from 'vuex';

export default {
  name: 'NodeInfo',
  setup() {
    const store = useStore();
    const selectedNode = computed(() => store.state.selectedNode);
    const linkPreview = ref(null);

    const fetchLinkPreview = async (url) => {
      try {
        const response = await apiClient.get('/LinkPreview', {
                    params: { url: url }
                });
        linkPreview.value = response.data;
      } catch (error) {
        console.error('Error fetching link preview:', error);
        linkPreview.value = null;
      }
    };

    watch(selectedNode, (newValue) => {
      if (newValue && newValue.link) {
        fetchLinkPreview(newValue.link);
      } else {
        linkPreview.value = null;
      }
    });


    // console.log(selectedNode.value);

    return {
      selectedNode,
      linkPreview
    };
  }
}
</script>

<style scoped>
.link-preview-container {
  max-width: 100%;
}

.preview-title {
  font-size: 16px; /* 减小标题字号 */
  word-break: break-word; /* 防止标题溢出容器 */
  margin-top: 0.5em; /* 上边距 */
  margin-bottom: 0.5em; /* 下边距 */
}

.preview-image {
  max-width: 100%; /* 限制图片的最大宽度 */
  max-height: 200px; /* 限制图片的最大高度 */
  border-radius: 10px; /* 为图片添加圆角 */
  object-fit: cover; /* 确保图片在保持比例的同时填充容器 */
}

.link-preview {
  text-decoration: none; /* 去除链接的下划线 */
  color: inherit; /* 使用继承的文字颜色 */
}

.link-preview:hover {
  text-decoration: underline; /* 鼠标悬停时添加下划线 */
}
</style>