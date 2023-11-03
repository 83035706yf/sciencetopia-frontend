<template>
    <div id="cy">
        <!-- 选中节点时显示的按钮 -->
        <div v-if="selectedNode" class="node-actions">
            <button @click="showAdjacentNodes">相邻节点</button>
            <button @click="showPrerequisiteNodes">前置知识</button>
            <button @click="showSubsequentNodes">后置知识</button>
        </div>
    </div>
</template>
  
<script>
import { ref, onMounted, computed } from 'vue';
import cytoscape from 'cytoscape';
import { useStore } from 'vuex';
import { apiClient } from '@/api';

export default {
    name: 'KnowledgeNetwork',
    setup() {
        const cy = ref(null);
        const store = useStore();
        const selectedNode = computed(() => store.state.selectedNode);

        onMounted(() => {
            // 初始化Cytoscape实例
            cy.value = cytoscape({
                container: document.getElementById('cy'),
                elements: [],  // 初始数据为空
                style: [ /* 样式定义 */],
                layout: { name: 'grid' }
            });

            // 从后端获取数据
            fetchData();

            // 添加点击事件
            cy.value.on('tap', 'node', function (evt) {
                const node = evt.target;
                store.commit('setSelectedNode', node.data());
            });

            cy.value.resize();
        });

        const fetchData = async () => {
            try {
                const response = await apiClient.get('/KnowledgeGraph');
                const backendData = response.data;

                // 转换数据以适应Cytoscape的格式
                const cytoscapeData = {
                    nodes: [],
                    edges: [],
                };

                backendData.forEach(item => {
                    // 添加源节点
                    cytoscapeData.nodes.push({
                        data: {
                            id: item.source.identity,
                            name: item.source.properties.name,
                            link: item.source.properties.link,
                            description: item.source.properties.description
                        }
                    });

                    // 添加目标节点
                    cytoscapeData.nodes.push({
                        data: {
                            id: item.target.identity,
                            name: item.target.properties.name,
                            link: item.target.properties.link,
                            description: item.target.properties.description
                        }
                    });

                    // 添加关系
                    cytoscapeData.edges.push({
                        data: {
                            id: item.relationship.identity,
                            source: item.relationship.start,
                            target: item.relationship.end,
                            relationshipType: item.relationship.type
                        }
                    });
                });

                // 将数据添加到Cytoscape实例中
                cy.value.add(cytoscapeData);

                // 计算每个节点的度数并存储为节点数据的一个属性
                cy.value.nodes().forEach(node => {
                    const degree = node.connectedEdges().length;
                    node.data('degree', degree);
                });

                const style = [
                    {
                        selector: 'node[name]',
                        style: {
                            'label': 'data(name)',
                            'text-valign': 'center',
                            'text-halign': 'center',
                            'font-size': '10px',
                            'width': 'mapData(degree, 0, 10, 20, 60)',  // 根据节点的度数映射其大小
                            'height': 'mapData(degree, 0, 10, 20, 60)'
                        }
                    },
                    // ... 其他样式定义 ...
                ];

                cy.value.style(style);

                // 重新应用布局
                cy.value.layout({ name: 'cose' }).run();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const getAdjacentNodes = (nodeId) => {
            const node = cy.value.getElementById(nodeId);
            const adjacentNodes = node.connectedNodes();
            return adjacentNodes.map(n => n.data());
        };

        const getPrerequisiteNodes = (nodeId) => {
            const node = cy.value.getElementById(nodeId);
            const incomingEdges = node.connectedEdges().filter(edge => edge.target().id() === nodeId);
            return incomingEdges.map(edge => edge.source().data());
        };

        const getSubsequentNodes = (nodeId) => {
            const node = cy.value.getElementById(nodeId);
            const outgoingEdges = node.connectedEdges().filter(edge => edge.source().id() === nodeId);
            return outgoingEdges.map(edge => edge.target().data());
        };

        const showAdjacentNodes = () => {
            const nodesData = getAdjacentNodes(selectedNode.value.id);
            // 隐藏所有节点和边
            cy.value.elements().style('display', 'none');
            // 只显示与选定节点相关的节点和边
            nodesData.forEach(data => {
                cy.value.getElementById(data.id).style('display', 'element');
                cy.value.getElementById(data.id).connectedEdges().style('display', 'element');
            });
        };

        const showPrerequisiteNodes = () => {
            const nodesData = getPrerequisiteNodes(selectedNode.value.id);
            // 隐藏所有节点和边
            cy.value.elements().style('display', 'none');
            // 只显示与选定节点相关的节点和边
            nodesData.forEach(data => {
                cy.value.getElementById(data.id).style('display', 'element');
                cy.value.getElementById(data.id).connectedEdges().style('display', 'element');
            });
        };

        const showSubsequentNodes = () => {
            const nodesData = getSubsequentNodes(selectedNode.value.id);
            // 隐藏所有节点和边
            cy.value.elements().style('display', 'none');
            // 只显示与选定节点相关的节点和边
            nodesData.forEach(data => {
                cy.value.getElementById(data.id).style('display', 'element');
                cy.value.getElementById(data.id).connectedEdges().style('display', 'element');
            });
        };

        return {
            selectedNode,
            showAdjacentNodes,
            showPrerequisiteNodes,
            showSubsequentNodes
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
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 10px;
}
</style>
  