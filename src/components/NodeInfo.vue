<template>
  <v-card v-if="selectedNode">
    <v-card-title>{{ selectedNode.name }}</v-card-title>
    <v-card-text v-html="selectedNode.description.replace(/\n/g, '<br>')"></v-card-text>
    <!-- Flex container for link previews -->
    <div class="link-previews-container">
      <!-- Iterate over linkPreviews to display each resource -->
      <v-card-item v-for="(preview, index) in linkPreviews" :key="index" class="link-preview-container">
        <a :href="preview.url" target="_blank" class="link-preview">
          <h3 class="preview-title">{{ preview.title }}</h3>
          <img :src="preview.image" alt="缩略图" class="preview-image" />
          <p>{{ preview.description }}</p>
        </a>
      </v-card-item>
    </div>
  </v-card>
  <v-card v-else class="pb-6">
    <v-card-text style="color: grey;">
      获取知识，从点击一个节点开始。
    </v-card-text>
  </v-card>
</template>

<script>
import { computed, watch } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'NodeInfo',
  setup() {
    const store = useStore();
    const selectedNode = computed(() => store.state.selectedNode);
    const linkPreviews = computed(() => store.state.linkPreviews);

    watch(selectedNode, (newValue) => {
      if (newValue && newValue.resources && newValue.resources.length) {
        store.dispatch('fetchLinkPreviews', newValue.resources); // Dispatch the action directly from the store
      }
      else {
        store.dispatch('clearLinkPreviews');
      }
    });

    return {
      selectedNode,
      linkPreviews,
    };
  }
}
</script>

<style scoped>
@import "../assets/css/link-preview.css";
</style>
