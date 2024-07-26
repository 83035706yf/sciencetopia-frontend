<template>
    <GlobalLoader />
    <div ref="svgRef" id="cy" :style="{ width: width + 'px', height: height + 'px' }">
        <!-- 选中节点时显示的按钮 -->
        <div v-if="selectedNodes" class="node-actions">
            <button @click="showAdjacentNodes">
                <i class="fas fa-circle-nodes action-icon"></i>
            </button>
            <button @click="showPrerequisiteNodes">
                <i class="fas fa-share-nodes action-icon"></i>
            </button>
            <button @click="showSubsequentNodes">
                <i class="fas fa-share-nodes action-icon"></i>
            </button>
            <button @click="resetView">
                <i class="fas fa-arrows-rotate action-icon"></i>
            </button>
            <button @click="addToFavorites">
                <i class="fas fa-heart-circle-plus action-icon"></i>
            </button>
        </div>
        <div class="edit-action">
            <button v-if="!isEditing" @click="startEditing">
                <i class="fas fa-pen action-icon"></i>
            </button>
            <button v-else @click="submitEditing">
                <i class="fa-solid fa-right-from-bracket highlight-icon"></i>
            </button>
            <EditGuideDialog v-model="dialogVisible" @confirmed="confirmGuide"></EditGuideDialog>
        </div>
        <div class="map-actions">
            <!-- 容器包裹按钮和输入栏 -->
            <div @mouseover="showInput(), overContainer = true" @mouseleave="overContainer = false; hideInput()"
                class="action-container">
                <!-- 定位器按钮 -->
                <button @click="handleSearch" class="locator-btn">
                    <svg-icon type="mdi" :path="path"></svg-icon>
                </button>
                <!-- 输入栏 -->
                <input v-if="inputVisible" v-model="searchQuery" type="text" placeholder="定位到..." @input="handleInput"
                    ref="searchInput" class="search-input" />
            </div>
        </div>
        <ContextMenu :visible="contextMenuState.visible" :position="contextMenuState.position"
            @update:visible="contextMenuState.visible = $event" @close="hideContextMenu" />
    </div>
</template>

<script>
import useKnowledgeGraph from './useKnowledgeGraph';
import EditGuideDialog from './EditGuideDialog.vue'
import ContextMenu from './ContextMenu.vue';
import { ref, computed } from 'vue';
import { apiClient } from '@/api';
import { useStore } from 'vuex';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiMapSearch } from '@mdi/js';

export default {
    name: 'KnowledgeNetwork',

    components: {
        SvgIcon,
        EditGuideDialog,
        ContextMenu,
    },

    setup() {
        const store = useStore();
        let searchQuery = ref('');
        const inputVisible = ref(false);
        const inputContent = ref(false);
        const overContainer = ref(false);
        const path = ref(mdiMapSearch);

        const dialogVisible = ref(false);

        const { svgRef,
            selectedNodes,
            fetchData,
            showAdjacentNodes,
            showPrerequisiteNodes,
            showSubsequentNodes,
            resetView,
            highlightAndCenterNode,
            searchNode,
            width,
            height,
            contextMenuState,
            hideContextMenu } = useKnowledgeGraph('/KnowledgeGraph/GetNodes');

        const addToFavorites = async () => {
            try {
                const nodeId = selectedNodes.value.id;
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

        const handleSearch = async () => {
            const foundNodeId = await searchNode(searchQuery.value);
            if (foundNodeId) {
                // `svgRef.value` should be the SVG element
                highlightAndCenterNode(foundNodeId, svgRef.value);
            } else {
                console.log('Node not found');
            }
        };

        // Access Vuex state
        const isEditing = computed(() => store.state.isEditing);

        // Methods to interact with Vuex actions
        const toggleEditMode = () => {
            store.dispatch('toggleEditMode');
        };


        const startEditing = () => {
            dialogVisible.value = true; // 用于控制对话框的显示
        };

        const confirmGuide = () => {
            // 用户确认指南后的逻辑
            dialogVisible.value = false;
            toggleEditMode();
            // isEditing.value = true;
        };

        const submitEditing = () => {
            toggleEditMode();
            store.dispatch('toggleNodeCreationForm', false);
        };

        return {
            svgRef,
            selectedNodes,
            fetchData,
            showAdjacentNodes,
            showPrerequisiteNodes,
            showSubsequentNodes,
            resetView,
            addToFavorites,
            handleSearch,
            searchQuery,
            inputVisible,
            inputContent,
            overContainer,
            path,
            width,
            height,
            dialogVisible,
            startEditing,
            confirmGuide,
            submitEditing,
            isEditing,
            toggleEditMode,
            hideContextMenu,
            contextMenuState,
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
        handleInput() {
            this.inputContent = this.searchQuery.length > 0;
            // 如果输入栏为空，并且鼠标不在按钮或输入栏上，隐藏输入栏
            if (this.searchQuery.length === 0 && !this.overButton && !this.overInput) {
                this.inputVisible = false;
            }
        },
    }
}
</script>

<style scoped>
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

.edit-action {
    z-index: 1000;
    position: absolute;
    top: 20px;
    right: 40px;
    display: flex;
    gap: 10px;
}

.action-icon {
    font-size: 18px;
}

.highlight-icon {
    color: red;
    font-size: 22px;
    /* background-color: rgba(255, 0, 0, 0.4);
    box-shadow: 0 0 10px red; */
}

.map-actions {
    z-index: 1000;
    position: absolute;
    bottom: 20px;
    right: 80px;
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