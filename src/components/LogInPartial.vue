<template>
    <div>
        <!-- 如果用户已登录 -->
        <div v-if="isAuthenticated">
            <v-menu open-on-hover>
                <template v-slot:activator="{ props }">
                    <v-btn icon="dots-vertical" class="header-btn default-avatar" v-bind="props" size="50" @click="personalcenter">
                        <v-avatar size="48">
                            <img :src="avatarUrl" :alt="$t('user.useravatar')">
                        </v-avatar>
                    </v-btn>
                </template>

                <v-list class="header-list">
                    <v-list-item variant="plain" @click="personalcenter">
                        <v-list-item-title>{{ $t('user.personalcenter') }}</v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item variant="plain" @click="accountcenter">
                        <v-list-item-title>{{ $t('user.accountsetting') }}</v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item variant="plain" @click="logout">
                        <v-list-item-title>{{ $t('user.logout') }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>

        <!-- 如果用户未登录 -->
        <div v-else>
            <div class="two-rows-btn">
                <v-btn v-if="!scrolledPastHeader" icon="dots-vertical" class="default-avatar" size="50" @click="register">
                    <v-avatar size="48" style="background-color: #E8DABD; box-shadow: none;">
                        <img src="../assets/images/avatar.svg" alt="Red arrow"
                            style="width: 50px; height: 50px; border-radius: 50%;">
                    </v-avatar>
                </v-btn>
                <div class="btn-content">
                    <v-row align="center" dense class="btn-row">
                        <v-col cols="auto" style="max-width: 30px; margin-left: -40px;">
                            <v-btn variant="plain" class="header-btn no-padding" @click="login">{{ $t('header.login') }}</v-btn>
                        </v-col>
                        <v-col cols="auto">
                            <span class="divider">/</span>
                        </v-col>
                        <v-col cols="auto" style="max-width: 30px; margin-left: -20px;">
                            <v-btn variant="plain" class="header-btn" @click="register">{{ $t('header.register') }}</v-btn>
                        </v-col>
                    </v-row>
                </div>
            </div>
            <!-- <v-btn icon="dots-vertical" class="header-btn" v-bind="props" size="50" @click="personalcenter">
                        <v-avatar size="48" style="background-color: #E8DABD;">
                            <img src="../assets/images/avatar.svg" alt="Red arrow"
                                style="width: 50px; height: 50px; border-radius: 50%;">
                        </v-avatar>
                    </v-btn> -->

            <!-- <button type="word" class="btn" @click="login">{{ $t('header.login') }}</button>
            <img src="../assets/images/avatar.svg" alt="Red arrow"
                style="width: 50px; height: 50px; border-radius: 50%;">
            <button type="word" class="btn" @click="register">{{ $t('header.register') }}</button> -->
        </div>
    </div>
</template>

<script>
import { apiClient } from '@/api'; // 根据api.js的实际路径进行调整

export default {
    name: 'LogInPartial',
    props: {
        scrolledPastHeader: Boolean,
    },
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
                console.error(this.$t('user.erroroccur'), error);
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
@import "../assets/css/header.css";

/* 你可以在这里添加CSS样式 */
.default-avatar {
    background-color: black;
    box-shadow: none;

    &:hover {
        box-shadow: none;
    }

    &:focus {
        box-shadow: none;
    }

    &:active {
        box-shadow: none;
    }
}

.btn-content {
  display: flex; /* Ensures the row layout */
  justify-content: flex-start; /* Align items to the left */
  align-items: center; /* Vertically align buttons and divider */
}

.btn-row {
  display: flex; /* Ensure v-row remains in one row */
  gap: 5px; /* Add space between buttons and the divider */
}

.divider {
  font-size: 16px; /* Adjust divider font size */
  margin-left: 20px; /* Add spacing around the "/" */
  font-weight: bold; /* Make divider bold */
}

.no-padding {
  padding: 0;
  min-width: none;
}
</style>