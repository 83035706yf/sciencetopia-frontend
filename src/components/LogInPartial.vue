<template>
    <div class="avatar-container">
        <!-- If the user is authenticated -->
        <div v-if="isAuthenticated" @mouseleave="hovering = false">
            <div @mouseenter="hovering = true" @mouseleave="hovering = false" class="avatar-hover-container">
                <!-- Avatar (before hover) -->
                <v-btn icon="dots-vertical" class="header-btn default-avatar avatar-hover" size="50"
                    @click="personalcenter">
                    <v-avatar size="48">
                        <img :src="avatarUrl" :alt="$t('user.useravatar')">
                    </v-avatar>
                </v-btn>

                <!-- Card (on hover) -->
                <v-card v-if="hovering" class="user-info-card animated-card st-card" elevation="3" width="250">
                    <v-card-title @click="personalcenter">
                        <v-row>
                            <v-col cols="auto">
                                <v-btn icon="dots-vertical" class="default-avatar" size="64">
                                    <v-avatar size="62">
                                        <img :src="avatarUrl" :alt="$t('user.useravatar')">
                                    </v-avatar>
                                </v-btn>
                            </v-col>
                            <v-col cols="auto" class="d-flex justify-center align-center">
                                <v-list-item-title class="user-name">{{ $store.state.userInfo.userName
                                    }}</v-list-item-title>
                            </v-col>
                        </v-row>
                    </v-card-title>
                    <v-divider color="text" opacity="0.1" :thickness="2" style="margin-top: 5px; margin-bottom: 5px;" />
                    <v-list class="list-on-card" dense>
                        <v-list-item @click="personalcenter">
                            <v-list-item-title><v-icon>mdi-account</v-icon>{{ $t('user.personalcenter')
                                }}</v-list-item-title>
                        </v-list-item>
                        <v-divider color="text" opacity="0.1" style="margin-top: 5px; margin-bottom: 5px;" />
                        <v-list-item @click="accountcenter">
                            <v-list-item-title><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20"
                                    height="20" viewBox="0 0 50 50">
                                    <path
                                        d="M47.16,21.221l-5.91-0.966c-0.346-1.186-0.819-2.326-1.411-3.405l3.45-4.917c0.279-0.397,0.231-0.938-0.112-1.282 l-3.889-3.887c-0.347-0.346-0.893-0.391-1.291-0.104l-4.843,3.481c-1.089-0.602-2.239-1.08-3.432-1.427l-1.031-5.886 C28.607,2.35,28.192,2,27.706,2h-5.5c-0.49,0-0.908,0.355-0.987,0.839l-0.956,5.854c-1.2,0.345-2.352,0.818-3.437,1.412l-4.83-3.45 c-0.399-0.285-0.942-0.239-1.289,0.106L6.82,10.648c-0.343,0.343-0.391,0.883-0.112,1.28l3.399,4.863 c-0.605,1.095-1.087,2.254-1.438,3.46l-5.831,0.971c-0.482,0.08-0.836,0.498-0.836,0.986v5.5c0,0.485,0.348,0.9,0.825,0.985 l5.831,1.034c0.349,1.203,0.831,2.362,1.438,3.46l-3.441,4.813c-0.284,0.397-0.239,0.942,0.106,1.289l3.888,3.891 c0.343,0.343,0.884,0.391,1.281,0.112l4.87-3.411c1.093,0.601,2.248,1.078,3.445,1.424l0.976,5.861C21.3,47.647,21.717,48,22.206,48 h5.5c0.485,0,0.9-0.348,0.984-0.825l1.045-5.89c1.199-0.353,2.348-0.833,3.43-1.435l4.905,3.441 c0.398,0.281,0.938,0.232,1.282-0.111l3.888-3.891c0.346-0.347,0.391-0.894,0.104-1.292l-3.498-4.857 c0.593-1.08,1.064-2.222,1.407-3.408l5.918-1.039c0.479-0.084,0.827-0.5,0.827-0.985v-5.5C47.999,21.718,47.644,21.3,47.16,21.221z M25,32c-3.866,0-7-3.134-7-7c0-3.866,3.134-7,7-7s7,3.134,7,7C32,28.866,28.866,32,25,32z">
                                    </path>
                                </svg> {{ $t('user.accountsetting') }}</v-list-item-title>
                        </v-list-item>
                        <v-divider color="text" opacity="0.1" style="margin-top: 5px; margin-bottom: 5px;" />
                        <v-list-item @click="logout">
                            <v-list-item-title><v-icon>mdi-logout</v-icon>{{ $t('user.logout') }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card>
            </div>
        </div>

        <!-- If the user is not authenticated -->
        <div v-else>
            <div class="two-rows-btn">
                <v-btn v-if="!scrolledPastHeader" icon="dots-vertical" class="default-avatar" size="50"
                    @click="register">
                    <v-avatar size="48" style="background-color: #E8DABD; box-shadow: none;">
                        <img src="../assets/images/avatar.svg" alt="Red arrow"
                            style="width: 50px; height: 50px; border-radius: 50%;">
                    </v-avatar>
                </v-btn>
                <div class="btn-content">
                    <v-row align="center" dense class="btn-row">
                        <v-col cols="auto" style="max-width: 30px; margin-left: -40px;">
                            <v-btn variant="plain" class="header-btn no-padding" @click="login">{{ $t('header.login')
                                }}</v-btn>
                        </v-col>
                        <v-col cols="auto">
                            <span class="divider">/</span>
                        </v-col>
                        <v-col cols="auto" style="max-width: 30px; margin-left: -20px;">
                            <v-btn variant="plain" class="header-btn" @click="register">{{ $t('header.register')
                                }}</v-btn>
                        </v-col>
                    </v-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { apiClient } from '@/api'; // 根据api.js的实际路径进行调整

export default {
    name: 'LogInPartial',
    data() {
        return {
            hovering: false,
        };
    },
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

.avatar-container {
    position: relative;
}

/* Avatar hover and transition */
.avatar-hover-container {
    position: relative;
    display: inline-block;
}

.avatar-hover {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.user-info-card {
    position: absolute !important;
    top: -20px !important;
    left: -160px !important;
    z-index: 1000 !important;
}

/* Avatar transitions */
.avatar-hover {
    opacity: 1;
    transform: scale(1);
}

/* Show and hide properly */
.avatar-hover-container:hover .avatar-hover {
    opacity: 0;
    transform: scale(0.9);
}

.avatar-hover-container:hover .user-info-card {
    opacity: 1;
    transform: scale(1);
}

/* Name and email */
.user-name {
    font-weight: bold;
    font-size: 16px;
}

.user-email {
    font-size: 14px;
    color: gray;
}

/* 你可以在这里添加CSS样式 */
.btn-content {
    display: flex;
    /* Ensures the row layout */
    justify-content: flex-start;
    /* Align items to the left */
    align-items: center;
    /* Vertically align buttons and divider */
}

.btn-row {
    display: flex;
    /* Ensure v-row remains in one row */
    gap: 5px;
    /* Add space between buttons and the divider */
}

.divider {
    font-size: 16px;
    /* Adjust divider font size */
    margin-left: 20px;
    /* Add spacing around the "/" */
    font-weight: bold;
    /* Make divider bold */
}

.no-padding {
    padding: 0;
    min-width: none;
}

/* Keyframes for entrance animation */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Keyframes for exit animation */
@keyframes fadeOutScale {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
}

/* Apply animation to the card */
.animated-card {
  animation-duration: 0.3s;
  animation-fill-mode: forwards;
}

/* Trigger entrance animation */
.avatar-hover-container:hover .animated-card {
  animation-name: fadeInScale;
}

/* Trigger exit animation */
.avatar-hover-container:not(:hover) .animated-card {
  animation-name: fadeOutScale;
}
</style>