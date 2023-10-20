<template>
    <div id="cy"></div>
</template>
  
<script>
import { ref, onMounted } from 'vue';
import cytoscape from 'cytoscape';
import { useStore } from 'vuex';
import apiClient from '@/api';

export default {
    name: 'KnowledgeNetwork',
    setup() {
        const cy = ref(null);
        const store = useStore();

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

        return {};
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
  