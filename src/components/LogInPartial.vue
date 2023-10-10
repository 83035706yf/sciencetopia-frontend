<template>
    <div>
        <!-- 如果用户已登录 -->
        <div v-if="isAuthenticated">
            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on">
                        <v-avatar size="30">
                            <img :src="avatarUrl" alt="用户头像">
                        </v-avatar>
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item link>
                        <v-list-item-content>
                            <v-list-item-title>个人中心</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item @click="logout">
                        <v-list-item-content>
                            <v-list-item-title>登出</v-list-item-title>
                        </v-list-item-content>
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
import apiClient from '@/api'; // 根据api.js的实际路径进行调整

export default {
    name: 'LogInPartial',
    data() {
        return {
            isAuthenticated: false,  // 根据实际情况初始化
            avatarUrl: '头像URL'      // 根据实际情况初始化
        };
    },
    methods: {
        login() {
            this.$router.push({ name: 'login' });  // 跳转到LogIn组件
        },
        register() {
            this.$router.push({ name: 'register' });  // 跳转到LogIn组件
        },
        async logout() {
            try {
                // 向后端发送登出请求
                await apiClient.post('/Account/Logout');

                // 可选：跳转到登录页面或首页
                this.$router.push('/');
            } catch (error) {
                console.error('登出过程中出现错误:', error);
            }
        },
        async checkAuthenticationStatus() {
            try {
                const response = await apiClient.get('/Account/IsAuthenticated');
                this.isAuthenticated = response.data.isAuthenticated;
                if (this.isAuthenticated) {
                    this.avatarUrl = response.data.avatarUrl;  // 设置头像URL
                    // 如果需要，你还可以设置其他用户信息，例如userName
                    // this.userName = response.data.userName;
                }
            } catch (error) {
                console.error('Error checking authentication status:', error);
            }
        }

    },
    mounted() {
        this.checkAuthenticationStatus(); // 当组件挂载时，检查身份验证状态
    }
}
</script>
  
<style scoped>
/* 你可以在这里添加CSS样式 */
</style>
  