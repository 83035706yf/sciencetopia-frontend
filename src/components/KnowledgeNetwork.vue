<template>
    <div id="cy">
        <!-- 选中节点时显示的按钮 -->
        <div v-if="selectedNode" class="node-actions">
            <button @click="showAdjacentNodes">
                <font-awesome-icon :icon="['fas', 'circle-nodes']" />
            </button>
            <button @click="showPrerequisiteNodes">
                <font-awesome-icon :icon="['fas', 'share-nodes']" flip="horizontal" />            </button>
            <button @click="showSubsequentNodes">
                <font-awesome-icon :icon="['fas', 'share-nodes']" />
            </button>
            <button @click="resetView">
                <font-awesome-icon :icon="['fas', 'arrows-rotate']" />
            </button>
            <button @click="addToFavorites">
                <font-awesome-icon :icon="['fas', 'heart-circle-plus']" />
            </button>
        </div>
    </div>
</template>
  
<script>
import useKnowledgeGraph from './useKnowledgeGraph';
import { apiClient } from '@/api';

export default {
    name: 'KnowledgeNetwork',
    setup() {
        const { cy,
            selectedNode,
            fetchData,
            showAdjacentNodes,
            showPrerequisiteNodes,
            showSubsequentNodes,
            resetView, } = useKnowledgeGraph('/KnowledgeGraph');

        const addToFavorites = async () => {
            try {
                const nodeId = selectedNode.value.id;
                const response = await apiClient.post(`/Favorites/${nodeId}`);
                if (response.data.success) {
                    alert('Node added to favorites successfully!');
                } else {
                    alert('Failed to add node to favorites.');
                }
            } catch (error) {
                console.error('Error adding node to favorites:', error);
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
            addToFavorites
        };
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

.node-actions {
    z-index: 1000;
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 10px;
}
</style>
  