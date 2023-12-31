// useKnowledgeGraph.js
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { apiClient } from '@/api';
import * as d3 from 'd3';

export default function useKnowledgeGraph(endpoint) {
    const links = ref([]);
    const store = useStore();
    const svgRef = ref(null);
    let link, node, labels, zoom, simulation;
    const selectedNode = computed(() => store.state.selectedNode);

    // D3 Drag behavior
    const drag = simulation => {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    };

    // Function to create the force-directed graph
    const createForceDirectedGraph = () => {
        const width = 900;  // Example fixed width
        const height = 900; // Example fixed height

        zoom = d3.zoom()
            .scaleExtent([0.5, 8]) // Adjust these values as needed
            .on('zoom', (event) => {
                svg.selectAll('g').attr('transform', event.transform);
            });

        const svg = d3.select('#cy').append('svg')
            .attr('width', width)
            .attr('height', height)
            .call(zoom);

        simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id(d => d.id))
            .force('charge', d3.forceManyBody())
            .force('center', d3.forceCenter(width / 2, height / 2));

        link = svg.append('g')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .selectAll('line');

        node = svg.append('g')
            .selectAll('circle');

        labels = svg.append("g")
            .attr("class", "labels")
            .selectAll("text")

        fetchData(); // Fetch data from the backend
    };

    // Function to update the graph with fetched data
    const updateD3Graph = (nodes, links) => {
        // Compute degrees for each node based on connections with nodes of the same label
        nodes.forEach(node => {
            node.degree = links.reduce((acc, link) => {
                const source = nodes.find(n => n.id === link.source.id);
                const target = nodes.find(n => n.id === link.target.id);
                if (source && target) {
                    // Check if source and target have at least one common label
                    // const commonLabels = source.labels.filter(label => target.labels.includes(label));
                    if ((link.source.id === node.id || link.target.id === node.id)) {
                        return acc + 1;
                    }
                }
                return acc;
            }, 0);
        });

        // Update links
        link = link.data(links, d => d.id)
            .join('line')
            .attr('stroke-width', d => {
                const sourceNode = nodes.find(n => n.id === d.source.id);
                const targetNode = nodes.find(n => n.id === d.target.id);

                // Check if both connected nodes are topics
                if (sourceNode && targetNode && sourceNode.labels.includes('Topic') && targetNode.labels.includes('Topic')) {
                    return 2; // Thicker line for links between two topics
                } else {
                    return Math.sqrt(d.value || 1); // Normal width for other links
                }
            })
            .attr('stroke', d => {
                const sourceNode = nodes.find(n => n.id === d.source.id);
                const targetNode = nodes.find(n => n.id === d.target.id);

                // Determine color based on node label combinations
                if (sourceNode && targetNode) {
                    if (sourceNode.labels.includes('Topic') && targetNode.labels.includes('Topic')) {
                        return '#d5282a'; // Red for links between two topics
                    } else if ((sourceNode.labels.includes('Topic') && targetNode.labels.includes('Keyword')) ||
                        (sourceNode.labels.includes('Keyword') && targetNode.labels.includes('Topic'))) {
                        return '#999'; // Pink for links between a topic and a keyword
                    } else if ((sourceNode.labels.includes('Keyword') && targetNode.labels.includes('Tag')) ||
                        (sourceNode.labels.includes('Tag') && targetNode.labels.includes('Keyword'))) {
                        return '#00fff7'; // Green for links between a keyword and a tag
                    } else {
                        return '#999'; // Default color for other links
                    }
                } else {
                    return '#999'; // Default color if nodes are not found
                }
            })
            .attr('stroke-opacity', 0.6);

        // Update nodes with color based on labels
        node = node.data(nodes, d => d.id)
            .join('circle')
        // Update nodes
        node = node.data(nodes, d => d.id)
            .join('circle')
            .attr('r', d => {
                // Adjust node size
                return d.labels.includes('Topic') ? (10 + (isNaN(d.degree) ? 0 : d.degree)) * 0.8 : 5 + (isNaN(d.degree) ? 0 : d.degree) * 0.5;
            })
            .attr('fill', d => {
                if (d.labels.includes('Keyword')) return '#C6A969';
                if (d.labels.includes('Topic')) return '#d5282a';
                if (d.labels.includes('People')) return '#597E52';
                if (d.labels.includes('Works')) return '#4CB9E7';
                if (d.labels.includes('Event')) return '#5C469C';
                return '#ccc'; // Default color
            })
            .call(drag(simulation))
            .on('click', (event, d) => {
                store.commit('setSelectedNode', d);
                // Implement zoom on node click
            });


        // Add labels to nodes
        labels = labels.data(nodes, d => d.id)
            .join("text")
            .text(d => d.labels.includes('Topic') ? d.name : '') // Only display name for 'Topic' nodes
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "central")
            .style("font-size", d => d.labels.includes('Topic') ? 16 : 16)
            .style('font-weight', 'bold')
            .style("fill", d => d.labels.includes('Topic') ? "#fff" : '#fff')
            .style("stroke", d => d.labels.includes('Topic') ? "#d5282a" : 'black') // Black stroke for text outline
            .style("stroke-width", d => d.labels.includes('Topic') ? 1 : 0.5) // Adjust stroke width as needed
            .style("pointer-events", "none") // To prevent interference with node interactivity
            .attr("alignment-baseline", d => d.labels.includes('Topic') ? "middle" : "hanging")
            .attr("dy", d => d.labels.includes('Topic') ? 0 : "-1.2em"); // Adjust vertical position

        node.on('mouseover', function (event, d) {
            labels.filter(l => l === d).text(l => l.name); // Show name on hover
        });

        node.on('mouseout', function (event, d) {
            labels.filter(l => l === d && !l.labels.includes('Topic')).text(''); // Hide name on mouseout, except for 'Topic' nodes
        });

        // Restart the simulation with new data
        simulation.nodes(nodes).on('tick', ticked);
        simulation.force('link').links(links);
        simulation.alpha(1).restart();
    };

    // Ticked function for updating node and link positions
    const ticked = () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        // Update label positions
        labels.attr('x', d => d.x)
            .attr('y', d => d.y); // Adjust label position above the node

    };

    // Fetch data from the backend
    const fetchData = async () => {
        try {
            const response = await apiClient.get(endpoint);
            const backendData = response.data;

            // Prepare nodes and links for D3
            const newNodes = [], newLinks = [];

            backendData.forEach(item => {
                // Process nodes
                if (!newNodes.some(n => n.id === item.source.identity)) {
                    newNodes.push({
                        id: item.source.identity,
                        labels: item.source.labels,
                        name: item.source.properties.name,
                        link: item.source.properties.link,
                        description: item.source.properties.description
                    });
                }

                if (item.target && !newNodes.some(n => n.id === item.target.identity)) {
                    newNodes.push({
                        id: item.target.identity,
                        labels: item.target.labels,
                        name: item.target.properties.name,
                        link: item.target.properties.link,
                        description: item.target.properties.description
                    });
                }

                // Process links
                if (item.relationship && item.relationship.type !== 'LINKS_TO') {
                    newLinks.push({
                        id: item.relationship.identity,
                        source: newNodes.find(n => n.id === item.relationship.start),
                        target: newNodes.find(n => n.id === item.relationship.end),
                        relationshipType: item.relationship.type
                    });
                }
            });

            links.value = newLinks; // Update the reactive reference

            // Update D3 graph
            updateD3Graph(newNodes, newLinks);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    onMounted(() => {
        createForceDirectedGraph();
    });

    // Assuming `nodes` and `links` are your D3 data arrays
    const getAdjacentNodes = (nodeId) => {
        return links.value
            .filter(link => link.source.id === nodeId || link.target.id === nodeId)
            .map(link => link.source.id === nodeId ? link.target : link.source);
    };

    const getPrerequisiteNodes = (nodeId) => {
        return links.value
            .filter(link => link.target.id === nodeId)
            .map(link => link.source);
    };

    const getSubsequentNodes = (nodeId) => {
        return links.value
            .filter(link => link.source.id === nodeId)
            .map(link => link.target);
    };

    const showAdjacentNodes = () => {
        const adjacentNodeIds = getAdjacentNodes(selectedNode.value.id).map(node => node.id);
        node.style('opacity', d => adjacentNodeIds.includes(d.id) ? 1 : 0.1);
        link.style('opacity', d => adjacentNodeIds.includes(d.source.id) || adjacentNodeIds.includes(d.target.id) ? 1 : 0.1);
    };

    const showPrerequisiteNodes = () => {
        const prerequisiteNodeIds = getPrerequisiteNodes(selectedNode.value.id).map(node => node.id);
        node.style('opacity', d => prerequisiteNodeIds.includes(d.id) ? 1 : 0.1);
        link.style('opacity', d => prerequisiteNodeIds.includes(d.source.id) ? 1 : 0.1);
    };

    const showSubsequentNodes = () => {
        const subsequentNodeIds = getSubsequentNodes(selectedNode.value.id).map(node => node.id);
        node.style('opacity', d => subsequentNodeIds.includes(d.id) ? 1 : 0.1);
        link.style('opacity', d => subsequentNodeIds.includes(d.target.id) ? 1 : 0.1);
    };

    const resetView = () => {
        // Reset opacity of nodes and links
        node.style('opacity', 1);
        link.style('opacity', 1);

        // Reset zoom and pan
        d3.select(svgRef.value).transition()
            .duration(750)
            .attr('transform', 'translate(0,0) scale(1)');
    };

    const highlightAndCenterNode = (nodeId) => {
        const svgElement = svgRef.value;
        const width = svgElement.clientWidth;
        const height = svgElement.clientHeight;
        const zoomLevel = 1; // 根据需要调整放大级别
        const transitionDuration = 750; // 过渡动画的持续时间

        // 找到与 nodeId 匹配的节点
        const nodeData = node.data().find(n => n.id === nodeId);

        if (!nodeData) {
            console.error("Node not found:", nodeId);
            return;
        }

        if (!zoom) {
            console.error("zoom is not defined");
            return;
        }

        // 计算放大和居中的变换
        const targetX = width / 2 - nodeData.x * zoomLevel;
        const targetY = height / 2 - nodeData.y * zoomLevel;
        const transform = d3.zoomIdentity
            .translate(targetX, targetY)
            .scale(zoomLevel);

        // 应用变换
        const svgSelection = d3.select(svgElement);
        svgSelection.select('g')
            .transition()
            .duration(transitionDuration)
            .call(zoom.transform, transform);

        // console.log("Node Data:", nodeData);
        // console.log("SVG Dimensions:", svg.attr('width'), svg.attr('height'));
        // console.log("Transform:", transform);
        // console.log(svgRef.value); // 检查 SVG 元素引用
        // console.log(svgRef.value.clientWidth, svgRef.value.clientHeight); // 检查 SVG 尺寸

        store.commit('setSelectedNode', nodeData);
        store.commit('SET_HIGHLIGHTNODE', null);
    };

    return {
        svgRef,
        selectedNode,
        fetchData,
        showAdjacentNodes,
        showPrerequisiteNodes,
        showSubsequentNodes,
        resetView,
        highlightAndCenterNode,
    };
}
