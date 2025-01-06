<template>
  <div>
    <v-card v-for="(node, index) in selectedNodes" :key="index">
      <v-card-title>{{ node.name }}</v-card-title>
      <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
      <v-card-text v-html="node.description.replace(/\n/g, '<br>')"></v-card-text>
      <v-card-item v-for="resource in node.resources" :key="resource" class="link-preview-container">
        <LinkPreview :url="resource.link" />
      </v-card-item>
    </v-card>
    <v-card v-if="selectedNodes.length === 0" class="pb-6">
      <v-card-text style="color: grey;">
        {{ $t('knowledgeGraph.defaultmessage') }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import LinkPreview from '@/components/LinkPreview.vue'; // Assuming you have a LinkPreview component


export default {
  name: 'NodeInfo',
  components: {
    LinkPreview,
  },
  setup() {
    const store = useStore();
    const selectedNodes = computed(() => store.state.selectedNodes);
    return {
      selectedNodes,
    };
  }
}
</script>

<style scoped>
@import "../assets/css/link-preview.css";
</style>
