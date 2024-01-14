<template>
  <div id="cy" :style="{ width: width + 'px', height: height + 'px' }">
    <!-- 选中节点时显示的按钮 -->
    <div v-if="selectedNode" class="node-actions">
      <button @click="showAdjacentNodes">
        <font-awesome-icon :icon="['fas', 'circle-nodes']" />
      </button>
      <button @click="showPrerequisiteNodes">
        <font-awesome-icon :icon="['fas', 'share-nodes']" flip="horizontal" /> </button>
      <button @click="showSubsequentNodes">
        <font-awesome-icon :icon="['fas', 'share-nodes']" />
      </button>
      <button @click="resetView">
        <font-awesome-icon :icon="['fas', 'arrows-rotate']" />
      </button>
      <button @click="removeSelectedNode">
        <font-awesome-icon :icon="['fas', 'trash-can']" />
      </button>
    </div>
  </div>
</template>

<script>
import useKnowledgeGraph from './useKnowledgeGraph';
import { apiClient } from '@/api';

export default {
  name: 'FavoriteKnowledgeGraph',
  setup() {
    const { cy,
      selectedNode,
      fetchData,
      showAdjacentNodes,
      showPrerequisiteNodes,
      showSubsequentNodes,
      resetView,
      width,
      height } = useKnowledgeGraph('/Favorites/MyFavorites');

    // ... 你可以添加或覆盖一些逻辑 ...
    // 删除选中的节点
    const removeSelectedNode = async () => {
      if (selectedNode.value) {
        try {
          const response = await apiClient.delete(`/Favorites/${selectedNode.value.id}`);
          if (response.data.success) {
            // 从图中删除节点
            cy.value.elements(`node[id = "${selectedNode.value.id}"]`).remove();
            // 重置选中的节点
            selectedNode.value = null;
            // 刷新图数据
            await fetchData();
          } else {
            console.error('Failed to delete the node:', response.data.message);
          }
        } catch (error) {
          console.error('Error deleting the node:', error);
        }
      }
    };


    return {
      cy,
      selectedNode,
      fetchData,
      showAdjacentNodes,
      showPrerequisiteNodes,
      showSubsequentNodes,
      resetView,
      removeSelectedNode,
      width,
      height
    };
  }
}
</script>

<style scoped>
/* #cy {
  border: 1px solid #ccc;
} */

#cy canvas {
    position: relative !important;
    margin: 0px;
}

.node-actions {
  z-index: 1000;
  position: absolute;
  top: 20px;
  right: 80px;
  display: flex;
  gap: 10px;
}

.delete-button img {
  width: 24px;
  /* 或者你希望的尺寸 */
  cursor: pointer;
}
</style>
