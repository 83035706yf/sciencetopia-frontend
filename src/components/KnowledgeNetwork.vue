<template>
    <div ref="svgRef" id="cy">
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
            <button @click="addToFavorites">
                <font-awesome-icon :icon="['fas', 'heart-circle-plus']" />
            </button>
        </div>
        <div class="map-actions">
            <!-- 容器包裹按钮和输入栏 -->
            <div @mouseover="showInput(), overContainer = true" @mouseleave="overContainer = false; hideInput()"
                class="action-container">
                <!-- 定位器按钮 -->
                <button @click="toggleSearch" class="locator-btn">
                    <svg-icon type="mdi" :path="path"></svg-icon>
                </button>
                <!-- 输入栏 -->
                <input v-if="inputVisible" v-model="searchQuery" type="text" placeholder="我想要了解..." @input="handleInput"
                    ref="searchInput" class="search-input" />
            </div>
        </div>
    </div>
</template>
  
<script>
import useKnowledgeGraph from './useKnowledgeGraph';
import { computed, watch, ref } from 'vue';
import { apiClient } from '@/api';
import { useStore } from 'vuex';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiMapSearch } from '@mdi/js';

export default {
    name: 'KnowledgeNetwork',

    components: {
        SvgIcon
    },

    setup() {
        const store = useStore();
        const highlightNodeId = computed(() => store.state.highlightNodeId);
        const searchQuery = '';
        const inputVisible = ref(false);
        const inputContent = ref(false);
        const overContainer = ref(false);
        const path = ref(mdiMapSearch);

        const { svgRef,
            selectedNode,
            fetchData,
            showAdjacentNodes,
            showPrerequisiteNodes,
            showSubsequentNodes,
            resetView,
            highlightAndCenterNode } = useKnowledgeGraph('/KnowledgeGraph/GetNodes');

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

        watch(highlightNodeId, (newNodeId, oldNodeId) => {
            // console.log("watch triggered:", newNodeId, oldNodeId);
            if (newNodeId !== null && newNodeId !== oldNodeId) {
                highlightAndCenterNode(newNodeId);
            }
        });

        return {
            svgRef,
            selectedNode,
            fetchData,
            showAdjacentNodes,
            showPrerequisiteNodes,
            showSubsequentNodes,
            resetView,
            addToFavorites,
            searchQuery,
            inputVisible,
            inputContent,
            overContainer,
            path
        };
    },

    methods: {
        showInput() {
            this.inputVisible = true;
        },
        hideInput() {
            if (!this.overContainer && this.searchQuery.length === 0) {
                this.inputVisible = false;
            }
        },
        toggleSearch() {
            if (this.searchQuery) {
                this.searchNode();
            } else {
                this.inputVisible = !this.inputVisible;
            }
        },
        handleInput() {
            this.inputContent = this.searchQuery.length > 0;
            // 如果输入栏为空，并且鼠标不在按钮或输入栏上，隐藏输入栏
            if (this.searchQuery.length === 0 && !this.overButton && !this.overInput) {
                this.inputVisible = false;
            }
        },
        async searchNode() {
            if (!this.searchQuery.trim()) {
                this.searchResults = [];
                return;
            }

            this.isLoading = true;
            try {
                const response = await apiClient.get('/KnowledgeGraph/Search', {
                    params: { query: this.searchQuery }
                });
                const foundNode = response.data;
                if (foundNode) {
                    this.$store.commit('SET_HIGHLIGHTNODE', foundNode.identity);
                } else {
                    console.log('Node not found');
                }
            } catch (error) {
                console.error('Error during search:', error);
                // Handle error appropriately
            } finally {
                this.isLoading = false;
            }
        }
    }
}
</script>
  
<style scoped>
#cy {
    width: 900px;
    height: 900px;
}

#cy canvas {
    position: relative !important;
    margin: auto !important;
}

.node-actions {
    z-index: 1000;
    position: relative;
    top: 20px;
    right: -680px;
    display: flex;
    gap: 10px;
}

.map-actions {
    z-index: 1000;
    position: relative;
    top: 700px;
    right: -680px;
    display: flex;
    gap: 10px;
}

.action-container {
    display: flex;
    align-items: center;
    /* 垂直居中对齐 */
}


.locator-btn {
    padding: 10px 15px;
    /* 按钮内边距 */
    color: black;
    /* 文本和图标颜色 */
    border: none;
    /* 无边框 */
    border-radius: 5px;
    /* 边角圆滑度 */
    font-size: 16px;
    /* 文本大小 */
    cursor: pointer;
    /* 鼠标指针变为手指形状 */
    display: flex;
    /* 使用Flex布局 */
    align-items: center;
    /* 垂直居中内容 */
    justify-content: center;
    /* 水平居中内容 */
}

.locator-btn:focus {
    outline: none;
    /* 移除焦点时的轮廓 */
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, .25);
    /* 焦点时的阴影 */
}

.search-input {
    margin-left: -10px;
    /* 在按钮和输入栏之间添加一些间距 */
    /* 其他输入框样式... */
}
</style>
  