<template>
    <h2>注册</h2>
    <form class="form-container">
      <div class="form-group">
        <label for="UserName">用户名</label>
        <input v-model="userName" id="UserName" class="form-control" />
      </div>
      <div class="form-group">
        <label for="Email">邮箱</label>
        <input v-model="email" id="Email" class="form-control" />
      </div>
      <div class="form-group">
        <label for="Password">密码</label>
        <input type="password" v-model="password" id="Password" class="form-control" />
      </div>
      <div class="form-group">
        <label for="ConfirmPassword">确认密码</label>
        <input type="password" v-model="confirmPassword" id="ConfirmPassword" class="form-control" />
      </div>
      <div class="form-group">
        <button @click="register" class="btn btn-primary">注册</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ReGister',
  data() {
    return {
      // 这里可以定义您需要的数据，例如用户名和密码
    };
  },
  methods: {
        async register() {
            try {
                const response = await axios.post('/api/register', {
                    username: this.username,
                    password: this.password
                });
                if (response.data.success) {
                    // 登录成功，处理逻辑
                } else {
                    // 登录失败，处理逻辑
                }
            } catch (error) {
                console.error('登录失败:', error);
            }
        }
    }
};
</script>

<style scoped>
  /* 这里是从site.css复制的CSS内容，您可以选择将其放在这里或全局的CSS文件中 */
</style>
