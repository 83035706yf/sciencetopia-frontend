<template>
    <v-card v-if="selectedNode">
      <v-card-title>{{ selectedNode.name }}</v-card-title>
      <v-card-text v-html="selectedNode.description.replace(/\n/g, '<br>')"></v-card-text>
    </v-card>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  
  export default {
    name: 'NodeInfo',
    setup() {
      const store = useStore();
      const selectedNode = computed(() => store.state.selectedNode);
      // console.log(selectedNode.value);
  
      return {
        selectedNode
      };
    }
  }
  </script>
  