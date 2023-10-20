<template>
    <div id="cy"></div>
    <button @click="generateStudyPlan" v-if="selectedNode">学习计划</button>
</template>

<script>
// ... 其他代码 ...

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
                const response = await apiClient.post('/api/StudyPlan', {
                    name: this.selectedNode.name,
                    description: this.selectedNode.description
                });
                const studyPlan = response.data.StudyPlan;
                // 显示学习计划，例如使用弹窗或其他UI元素
            }
        }
    }
}
</script>
