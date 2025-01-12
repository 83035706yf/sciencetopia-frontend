<template>
  <div>
    <LoadingSpinner v-if="isLoading" />
    <a v-else-if="preview" :href="preview.url" target="_blank" class="link-preview">
      <h3 class="preview-title">{{ preview.title }}</h3>
      <img :src="preview.image" alt="缩略图" class="preview-image" />
      <p>{{ preview.description }}</p>
    </a>
  </div>
</template>

<script>
import { fetchLinkPreview } from '@/services/linkPreviewService';
import LoadingSpinner from './LoadingSpinner.vue'; // Import the Spinner component

export default {
  name: 'LinkPreview',
  components: {
    LoadingSpinner
  },
  props: {
    url: String,
  },
  data() {
    return {
      preview: null,
      isLoading: false,  // Add a loading state
    };
  },
  created() {
    this.loadPreview();
  },
  methods: {
    async loadPreview() {
      this.isLoading = true;  // Set loading to true when fetching starts
      try {
        this.preview = await fetchLinkPreview(this.url);
      } catch (error) {
        console.error('Error fetching link preview:', error);
      } finally {
        this.isLoading = false;  // Set loading to false when fetching ends
      }
    }
  }
}
</script>