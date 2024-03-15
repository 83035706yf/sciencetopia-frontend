<template>
    <v-container>
        <v-row>
            <v-col cols="6">
                <h3>搜索结果：知识节点</h3>
                <v-container v-for="result in searchResults" :key="result.id">
                    <v-card>
                        <v-card-title>{{ result.name }}</v-card-title>
                        <v-card-text>
                            {{ result.description }}
                        </v-card-text>
                    </v-card>
                </v-container>
            </v-col>
            <v-col cols="6">
                <h3>搜索结果：知识资源</h3>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { apiClient } from '@/api';

export default {
    data() {
        return {
            searchResults: [],
        };
    },
    mounted() {
        this.fetchSearchResults();
    },
    methods: {
        async fetchSearchResults() {
            try {
                const query = this.$route.query.q;
                this.searchResults = await apiClient.get('/Search/SearchKnowledgeBase', {
                    params: { query: query },
                }).then((response) => {
                    return response.data;
                });
            } catch (error) {
                console.error('Failed to fetch search results:', error);
            }
        },
    },
};
</script>

<style scoped>
/* Add your custom styles here */
</style>