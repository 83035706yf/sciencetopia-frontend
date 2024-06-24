<template>
    <v-card>
        <v-card-title>
            <v-select label="关系类型" v-model="linkData.type" :items="['CONTAINS', 'RELATES_TO', 'CREATE', 'LEADS']"
                outlined dense></v-select>
        </v-card-title>
        <v-card-text>
            <!-- <v-text-field label="关系描述" v-model="linkData.description" outlined dense></v-text-field> -->
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" @click="submitLink">创建新关系</v-btn>
            <v-btn color="error" @click="cancelLinkCreation">取消</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { apiClient } from '@/api'; // Adjust the path to your api.js file
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
    name: 'LinkCreationForm',
    setup() {
        const store = useStore(); // Access the Vuex store
        const linkData = ref({
            type: '',
        });

        const selectedNodes = computed(() => store.state.selectedNodes);

        const submitLink = async () => {
            if (selectedNodes.value.length < 2) {
                alert('请选择两个节点以创建关系。');
                return;
            }
            // Prepare data to be sent to the backend
            const payload = {
                sourceNodeName: selectedNodes.value[0].name,
                targetNodeName: selectedNodes.value[1].name,
                relationshipType: linkData.value.type,
            };
            console.log('Submitting Link:', payload);
            try {
                await apiClient.post('/KnowledgeGraph/CreateRelationship', payload);
                alert('关系已提交并等待审核。');
                linkData.value = { type: '' }; // Reset form
            } catch (error) {
                alert('提交失败: ' + error.message);
            }
        };

        const cancelLinkCreation = () => {
            if (confirm("确定离开创建关系页面？创建的关系将不会被保存！")) {
                store.dispatch('toggleLinkCreationForm', false); // Assuming this action toggles the visibility of the form
            }
        };

        return {
            linkData,
            submitLink,
            cancelLinkCreation,
            selectedNodes,
        };
    },
};
</script>

<style scoped>
/* Additional styling to make the form match your app's theme */
</style>
