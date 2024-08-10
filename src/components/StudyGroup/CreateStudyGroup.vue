<template>
  <div class="create-studygroup">
    <v-container>
      <v-card-title class="headline">创建学习小组</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="createGroup">
          <input v-model="groupName" placeholder="帕鲁岛工人夜校" type="text" class="custom-input" />
          <!-- Placeholder for Quill Editor -->
          <div ref="quillEditor" class="quill-editor"></div>
          <v-card-actions>
            <v-btn type="submit" variant="text">创建</v-btn>
            <v-btn @click="cancel" variant="text" color="red">取消</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-container>
  </div>
</template>

<script>
import { apiClient } from '@/api';
import router from '@/router';
import { ref, onMounted } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Ensure you import Quill's CSS

export default {
  name: 'CreateStudyGroup',
  setup() {
    const groupName = ref('');
    const quillEditor = ref(null);
    const groupDescription = ref('');

    // Quill editor instance
    let quillInstance;

    onMounted(() => {
      quillInstance = new Quill(quillEditor.value, {
        theme: 'snow', // Specify theme
        placeholder: '在帕鲁岛工人夜校，你可以学到...', // Specify placeholder
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block'],
          ],
        },
      });

      // Listen for text change to update groupDescription
      quillInstance.on('text-change', function () {
        groupDescription.value = quillInstance.root.innerHTML;
      });
    });

    const createGroup = async () => {
      try {
        const payload = {
          name: groupName.value,
          description: groupDescription.value, // Use innerHTML of Quill editor
        };
        // API call logic here
        await apiClient.post('/StudyGroup/CreateStudyGroup', payload);
        // 创建成功后的处理，例如跳转到小组列表或显示成功消息
      } catch (error) {
        console.error("创建学习小组失败:", error);
      }
    };

    const cancel = () => {
      // Cancel logic here
      if (confirm("确定取消学习小组创建?")) {
        router.push({ name: 'studyGroupList' });
      }
    };

    return {
      groupName,
      quillEditor,
      createGroup,
      cancel,
    };
  },
};
</script>

<style>
/* Custom styles for the standard HTML input */
.custom-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.quill-editor {
  height: 300px;
  /* Adjust based on your needs */
}
</style>