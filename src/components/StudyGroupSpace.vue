<template>
  <div class="group-space">
    <form @submit.prevent="postUpdate">
      <textarea v-model="newPost" placeholder="Write an update..."></textarea>
      <button type="submit">Post</button>
    </form>
    <div v-for="post in posts" :key="post.id" class="post">
      {{ post.content }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newPost: '',
      posts: [] // Posts in the group
    };
  },
  methods: {
    postUpdate() {
      // Logic to post an update
    }
  },
  mounted() {
    // Fetch posts on component mount
  }
};
</script>