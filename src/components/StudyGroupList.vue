<template>
    <v-container>
        <div v-if="groups.length == 0">
            <p class="pb-6">暂时没有学习小组，去
                <button @click="toCreateGroupPage()">创建</button>
                第一个吧！
            </p>
        </div>
        <div v-else class="group-list">
            <div v-for="group in groups" :key="group.id" class="group-card">
                <h3>{{ group.name }}</h3>
                <p>{{ group.description }}</p>
                <button @click="applyToJoin(group.id)">Apply to Join</button>
            </div>
        </div>
    </v-container>
</template>
  
<script>
import { apiClient } from '@/api';

export default {
    name: 'StudyGroupList',

    data() {
        return {
            groups: [] // This will be filled with data fetched from the backend
        };
    },
    methods: {
        fetchGroups() {
            apiClient.get('/StudyGroup/GetAllStudyGroups')
                .then(response => {
                    this.groups = response.data;
                })
                .catch(error => {
                    console.error('Error fetching groups:', error);
                });
            },
        toCreateGroupPage() {
            // Logic to navigate to the create group page
            this.$router.push('/createstudygroup');
        },
        // applyToJoin(groupId) {
        //     // Logic to apply for joining a group
        // }
    },
    mounted() {
        // Fetch groups from the backend on component mount
        this.fetchGroups();
    }
};
</script>