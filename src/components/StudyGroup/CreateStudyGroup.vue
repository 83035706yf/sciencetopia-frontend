<template>
  <v-container>
    <div class="create-studygroup">
      <v-card-title class="headline">创建学习小组</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="createGroup">
          <input
            v-model="groupName"
            placeholder="帕鲁岛工人夜校"
            type="text"
            class="custom-input"
          />
          <!-- Placeholder for Quill Editor -->
          <div ref="quillEditor" class="quill-editor"></div>
          <v-card-actions>
            <v-btn type="submit" variant="text">创建</v-btn>
            <v-btn @click="cancel" variant="text" color="red">取消</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </div>
  </v-container>
</template>

<script>
import { apiClient } from '@/api'
import router from '@/router'
import { ref, onMounted } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css' // Ensure you import Quill's CSS

export default {
  name: 'CreateStudyGroup',
  setup() {
    const groupName = ref('')
    const quillEditor = ref(null)
    const groupDescription = ref('')

    // Quill editor instance
    let quillInstance

    onMounted(() => {
      quillInstance = new Quill(quillEditor.value, {
        theme: 'snow', // Specify theme
        placeholder: '在帕鲁岛工人夜校，你可以学到...', // Specify placeholder
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4] }], // 标题
            ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
            ['blockquote', 'code-block'], // 引用  代码块
            [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
            [{ script: 'sub' }, { script: 'super' }], // 上标/下标
            [{ indent: '-1' }, { indent: '+1' }], // 缩进
            // [{ direction: 'rtl' }], // 文本方向
            [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
            // [{ font: ['songti'] }], // 字体种类
            [{ align: [] }], // 对齐方式
            // ['clean'], // 清除文本格式
            ['link', 'image', 'video'], // 链接、图片、视频
          ],
        },
      })

      // Listen for text change to update groupDescription
      quillInstance.on('text-change', function () {
        groupDescription.value = quillInstance.root.innerHTML
      })
    })

    const createGroup = async () => {
      try {
        const payload = {
          name: groupName.value,
          description: groupDescription.value, // Use innerHTML of Quill editor
        }
        // API call logic here
        await apiClient.post('/StudyGroup/CreateStudyGroup', payload)
        // 创建成功后的处理，例如跳转到小组列表或显示成功消息
        alert('学习小组创建的请求已提交审核，请耐心等待。')
        router.push({ name: 'studyGroupList' })
      } catch (error) {
        console.error('创建学习小组失败:', error)
        alert('学习小组创建失败!')
      }
    }

    const cancel = () => {
      // Cancel logic here
      if (confirm('确定要取消学习小组创建吗?')) {
        router.push({ name: 'studyGroupList' })
      }
    }

    return {
      groupName,
      quillEditor,
      createGroup,
      cancel,
    }
  },
}
</script>

<style>
.create-studygroup {
  background-color: #f4eee1;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 20px;
  padding-bottom: 20px;
  box-shadow: -8px 4px 8px 0px rgba(0, 0, 0, 0.05) !important;
}

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
  height: 400px;
  /* Adjust based on your needs */
}
</style>
