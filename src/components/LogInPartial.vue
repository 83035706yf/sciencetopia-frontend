<template>
    <div>
        <!-- 如果用户已登录 -->
        <div v-if="isAuthenticated">
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="userDropdown" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">
                    <img :src="avatarUrl" alt="用户头像" style="width: 30px; height: 30px; border-radius: 50%;">
                </button>
                <div class="dropdown-menu" aria-labelledby="userDropdown">
                    <a class="dropdown-item" href="#">个人中心</a>
                    <div class="dropdown-divider"></div>
                    <button @click="logout" class="dropdown-item">登出</button>
                </div>
            </div>
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
        logout() {
            // 登出逻辑
        }
    }
}
</script>
  
<style scoped>
/* 你可以在这里添加CSS样式 */
</style>
  