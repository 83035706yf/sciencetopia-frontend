<template>
  <div>
    <h2>注册</h2>
    <form @submit.prevent="register" class="form-container">
      <div class="form-group">
        <label for="UserName">用户名</label>
        <input v-model="userName" id="UserName" class="form-control" />
      </div>
      <div class="form-group">
        <label for="Email">邮箱</label>
        <input v-model="email" id="Email" type="email" class="form-control" />
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
        <button type="submit" class="btn btn-primary">注册</button>
      </div>
    </form>
  </div>
</template>

<script>
import { apiClient } from '@/api';

export default {
  name: 'ReGister',
  data() {
    return {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
  },
  methods: {
    async register() {
      try {
        // Check if password and confirmPassword are the same
        if (this.password !== this.confirmPassword) {
          alert('密码和确认密码不匹配!');
          return;
        }

        const response = await apiClient.post('/users/Account/Register', {
          userName: this.userName,
          email: this.email,
          password: this.password,
        });

        if (response.data.success) {
          // 注册成功，处理逻辑
          console.log('注册成功:', response.data);
        } else {
          // 注册失败，处理逻辑
          console.error('注册失败:', response.data.error);
        }
      } catch (error) {
        console.error('注册失败:', error); // Log the entire error object
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Request data:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
        }
      }
    },
  },
};
</script>

<style scoped>
/* 这里是从site.css复制的CSS内容，您可以选择将其放在这里或全局的CSS文件中 */
</style>
