<template>
    <div>
        <h2>{{ title }}</h2>
        <form @submit.prevent="handleSubmit" class="form-container">
            <div class="text-danger">{{ validationSummary }}</div>
            <div class="form-group">
                <label for="userName">{{ userNameLabel }}</label>
                <input v-model="userName" id="userName" class="form-control" />
                <span class="text-danger">{{ userNameError }}</span>
            </div>
            <div class="form-group">
                <label for="password">{{ passwordLabel }}</label>
                <input v-model="password" type="password" id="password" class="form-control" />
                <span class="text-danger">{{ passwordError }}</span>
            </div>
            <div class="form-group">
                <div class="checkbox">
                    <label>
                        <input type="checkbox" v-model="rememberMe" /> {{ rememberMeLabel }}
                    </label>
                </div>
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-primary">登录</button>
            </div>
        </form>
    </div>
</template>

<script>
import { apiClient } from '@/api'; // 根据api.js的实际路径进行调整

export default {
    name: 'LogIn',
    data() {
        return {
            title: '登录',
            userName: '',
            password: '',
            rememberMe: false,
            userNameLabel: '用户名',
            passwordLabel: '密码',
            rememberMeLabel: '记住我',
            validationSummary: '',
            userNameError: '',
            passwordError: ''
        };
    },
    methods: {
        async handleSubmit() {
            try {
                // Make a POST request to the .NET Web API
                const response = await apiClient.post('/users/Account/Login', {
                    userName: this.userName,
                    password: this.password,
                    rememberMe: this.rememberMe
                });

                // 在登陆成功后跳转到首页
                this.$router.push('/');
                this.$store.dispatch('checkAuthenticationStatus');

                // Handle the response as needed
                console.log('Login successful:', response.config.data);
            } catch (error) {
                // Handle errors
                console.error('There was an error during the login process:', error);
                if (error.response && error.response.data) {
                    this.validationSummary = error.response.data.error || '登录失败';
                } else {
                    this.validationSummary = '登录失败';
                }
            }
        }
    },
};
</script>

<style scoped>
@import "../assets/css/form.css";
</style>
