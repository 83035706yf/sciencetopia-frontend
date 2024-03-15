// useGraphEditMode.js
import { ref } from 'vue';

export default function useGraphEditMode(nodes, links, updateGraph) {
    const isEditing = ref(false); // 控制编辑模式的状态

    const toggleEditMode = () => {
        isEditing.value = !isEditing.value;
        // 根据编辑状态调整D3图形的交互逻辑
        if (isEditing.value) {
            // 激活编辑模式的逻辑
        } else {
            // 禁用编辑模式的逻辑
        }
    };

    // 示例：添加一个新节点
    const addNode = (newNode) => {
        nodes.value.push(newNode); // 假设nodes是一个响应式引用
        updateGraph(); // 调用更新图形的方法
    };

    // 示例：添加一个新链接
    const addLink = (newLink) => {
        links.value.push(newLink); // 假设links是一个响应式引用
        updateGraph(); // 调用更新图形的方法
    };
    
    return {
        isEditing,
        toggleEditMode,
        addNode,
        addLink,
    };
}
