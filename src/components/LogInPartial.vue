<template>
    <div>
        <!-- 如果用户已登录 -->
        <div v-if="isAuthenticated">
            <v-menu open-on-hover>
                <template v-slot:activator="{ props }">
                    <v-btn icon="dots-vertical" v-bind="props" size="40" @click="personalcenter">
                        <v-avatar size="35">
                            <img :src="avatarUrl" alt="用户头像">
                        </v-avatar>
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item @click="personalcenter">
                        <v-list-item-title>个人中心</v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item @click="accountcenter">
                        <v-list-item-title>账号设置</v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item @click="logout">
                        <v-list-item-title>登出</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>

        <!-- 如果用户未登录 -->
        <div v-else>
            <button type="word" class="btn" @click="login">登录</button>
            <img src="../assets/images/avatar.svg" alt="Red arrow" style="width: 50px; height: 50px; border-radius: 50%;">
            <button type="word" class="btn" @click="register">注册</button>
        </div>
    </div>
</template>
  
<script>
import { apiClient } from '@/api'; // 根据api.js的实际路径进行调整

export default {
    name: 'LogInPartial',
    methods: {
        login() {
            this.$router.push({ name: 'login' });  // 跳转到LogIn组件
        },
        register() {
            this.$router.push({ name: 'register' });  // 跳转到LogIn组件
        },
        personalcenter() {
            const userId = this.$store.state.currentUserID;  // Get the userId from Vuex store
            this.$router.push({ name: 'personalcenter', params: { userId: userId } });  // Pass userId as route parameter
        },
        accountcenter() {
            const userId = this.$store.state.currentUserID;  // Get the userId from Vuex store
            this.$router.push({ name: 'accountcenter', params: { userId: userId } });  // 跳转到AccountCenter组件
        },
        async logout() {
            try {
                // 向后端发送登出请求
                await apiClient.post('/users/Account/Logout');

                await this.$store.dispatch('checkAuthenticationStatus');  // Add this line
                // await this.$store.dispatch('disconnectSignalR');

                // 可选：跳转到登录页面或首页
                this.$router.push('/');
            } catch (error) {
                console.error('登出过程中出现错误:', error);
            }
        },
    },
    mounted() {
        this.$store.dispatch('checkAuthenticationStatus');
    },
    computed: {
        // Create a computed property to access isAuthenticated
        isAuthenticated() {
            return this.$store.state.isAuthenticated;
        },
        avatarUrl() {
            return this.$store.state.avatarUrl;
        }
    },
}
</script>
  
<style scoped>
/* 你可以在这里添加CSS样式 */
</style>
  