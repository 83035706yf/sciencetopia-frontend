<template>
    <div id="cy"></div>
    <button @click="generateStudyPlan" v-if="selectedNode">学习计划</button>
</template>

<script>
// ... 其他代码 ...
import { pyApiClient } from '@/api';
export default {
    // ... 其他代码 ...

    data() {
        return {
            selectedNode: null
        };
    },

    methods: {
        async generateStudyPlan() {
            if (this.selectedNode) {
                const response = await pyApiClient.post('/StudyPlan', {
                    Name: this.selectedNode.name,
                    Description: this.selectedNode.description
                });
                // 显示学习计划，例如使用弹窗或其他UI元素
            }
        }
    }
}
</script>
