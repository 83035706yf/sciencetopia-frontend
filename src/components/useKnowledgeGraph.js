// useKnowledgeGraph.js
import { ref, computed, onMounted } from 'vue';
import cytoscape from 'cytoscape';
import { useStore } from 'vuex';
import { apiClient } from '@/api';

export default function useKnowledgeGraph(endpoint) {
    const cy = ref(null);
    const store = useStore();
    const selectedNode = computed(() => store.state.selectedNode);
    
    function isKeyword(node) {
        const labels = node.data('labels');
        return Array.isArray(labels) && labels.includes('Keyword');
    }

    function isTopic(node) {
        const labels = node.data('labels');
        return Array.isArray(labels) && labels.includes('Topic');
    }
    const cytoscapeStyles = [
        {
            selector: isKeyword,
            style: {
                'background-color': '#68B0AB', // 示例颜色，您可以根据需要调整
                'width': 'mapData(degree, 0, 10, 10, 50)', // 根据节点的度数调整大小
                'height': 'mapData(degree, 0, 10, 10, 50)',
                'label': 'data(name)',
                'font-size': '12px',
                'shape': 'ellipse',
                'text-valign': 'center',
                'text-halign': 'center',
            }
        },
        {
            selector: isTopic,
            style: {
                'background-color': '#8FC0A9',
                'width': 'mapData(degree, 0, 10, 20, 60)', // Topic节点可以稍大
                'height': 'mapData(degree, 0, 10, 20, 60)',
                'label': 'data(name)',
                'font-size': '14px',
                'text-valign': 'center',
                'text-halign': 'center',
            }
        },
        {
            selector: 'edge',
            style: {
                'width': 2,
                'line-color': '#C8D5B9',
                'target-arrow-color': '#C8D5B9',
                'target-arrow-shape': 'triangle',
                // ... 其他样式属性
            }
        }
    ];

    onMounted(() => {
        // 初始化Cytoscape实例
        cy.value = cytoscape({
            container: document.getElementById('cy'),
            elements: [],  // 初始数据为空
            style: cytoscapeStyles,
            layout: {
                name: 'cose',
                // 示例参数调整，您需要根据实际情况进行微调
                idealEdgeLength: 100,
                nodeRepulsion: function () { return 1; },
                edgeElasticity: function () { return 1; },
                // ...其他布局参数
            },
            // 视图配置
            minZoom: 0.5, // 最小缩放值
            maxZoom: 2, // 最大缩放值
            zoomingEnabled: true, // 启用缩放
            userZoomingEnabled: true, // 允许用户缩放
            panningEnabled: true, // 启用平移
            userPanningEnabled: true, // 允许用户平移
        });

        // 从后端获取数据
        fetchData();

        // 添加点击事件
        cy.value.on('tap', 'node', function (evt) {
            const node = evt.target;
            store.commit('setSelectedNode', node.data());
        });
        
        
        // cy.value.resize();
    });

    const fetchData = async () => {
        try {
            const response = await apiClient.get(endpoint);
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
                        labels: item.source.labels,
                        name: item.source.properties.name,
                        link: item.source.properties.link,
                        description: item.source.properties.description
                    }
                });

                // 添加目标节点
                if (item.target) {
                    cytoscapeData.nodes.push({
                        data: {
                            id: item.target.identity,
                            labels: item.source.labels,
                            name: item.target.properties.name,
                            link: item.target.properties.link,
                            description: item.target.properties.description
                        }
                    });
                }

                // 添加关系
                if (item.relationship) {
                    cytoscapeData.edges.push({
                        data: {
                            id: item.relationship.identity,
                            source: item.relationship.start,
                            target: item.relationship.end,
                            relationshipType: item.relationship.type
                        }
                    });
                }
            });

            // 将数据添加到Cytoscape实例中
            cy.value.add(cytoscapeData);

            // 计算每个节点的度数并存储为节点数据的一个属性
            cy.value.nodes().forEach(node => {
                const degree = node.connectedEdges().length;
                node.data('degree', degree);
            });

            cy.value.on('tap', 'node', function (evt) {
                const node = evt.target;
                store.commit('setSelectedNode', node.data());
                console.log('Clicked node data:', node.data());

                // Zoom in on the selected node
                cy.value.zoom({
                    level: 2, // Zoom level, change as needed
                    renderedPosition: node.renderedPosition()
                });
            });

            // 重新应用布局
            cy.value.layout({ name: 'cose' }).run();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // ... 保留你的其他逻辑 ...
    const getAdjacentNodes = (nodeId) => {
        const node = cy.value.getElementById(nodeId);
        const connectedEdges = node.connectedEdges();
        const adjacentNodes = connectedEdges.connectedNodes(); // Use connectedNodes() on the edges to get the adjacent nodes
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

    const resetView = () => {
        // Show all the elements (both nodes and edges)
        cy.value.elements().style('display', 'element');

        // Additionally, for each node, ensure its connected edges are also displayed
        cy.value.nodes().forEach(node => {
            node.connectedEdges().style('display', 'element');
        });

        // Reset zoom and center the graph
        cy.value.zoom(1);
        cy.value.center();
    };

    return {
        cy,
        selectedNode,
        fetchData,
        showAdjacentNodes,
        showPrerequisiteNodes,
        showSubsequentNodes,
        resetView,
    };
}
