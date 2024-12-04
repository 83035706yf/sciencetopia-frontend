<template>
    <v-container class="d-flex align-center justify-center"
        style="min-height: 60vh; max-height: 100vh; position: relative;">
        <!-- <svg class="thin-curve" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 640">
            <path fill="none" stroke="#AA1B1D" stroke-width="5"
                d="M0,256C192,128,384,64,576,112C768,160,960,288,1152,256C1344,224,1440,96,1440,96"></path>
        </svg> -->
        <!-- Outer Box -->
        <v-card class="outer-box" elevation="2">
            <v-container style="position: absolute; transform: rotate(-90deg); text-align: center;">
                <!-- <v-card-text>
                    <h2 class="text-center text-white">{{ $t('login.title') }}</h2>
                </v-card-text> -->
                <v-card-text>
                    <h2 class="text-center text-white">{{ $t('login.changetoregister') }}</h2>
                </v-card-text>
            </v-container>
        </v-card>

        <!-- Inner Box -->
        <v-card class="inner-box" elevation="3">
            <v-card-text>
                <v-alert v-if="validationSummary" type="error" dismissible class="mb-4">
                    {{ validationSummary }}
                </v-alert>
                <v-form @submit.prevent="handleSubmit" ref="form">
                    <v-text-field v-model="userName" :label="$t('login.userNameLabel')" :error-messages="userNameError"
                        variant="filled" required class="mb-4"></v-text-field>
                    <v-text-field v-model="password" :label="$t('login.passwordLabel')" :error-messages="passwordError"
                        type="password" variant="filled" shaped required class="mb-4"></v-text-field>
                    <v-checkbox v-model="rememberMe" :label="$t('login.rememberMeLabel')" dense></v-checkbox>
                    <!-- <v-btn type="submit" variant="outlined" class="mt-4" block>
                        {{ $t('header.login') }}
                    </v-btn> -->
                    <!-- Login button -->
                    <div class="login-circle" elevation="3">
                        <button class="login-button" type="submit" block>
                            {{ $t('header.login') }}
                        </button>
                    </div>
                </v-form>
            </v-card-text>
        </v-card>

    </v-container>
</template>


<script>
import { apiClient } from "@/api"; // Ensure the path to api.js is correct

export default {
    name: "LogIn",
    data() {
        return {
            userName: "",
            password: "",
            rememberMe: false,
            validationSummary: "",
            userNameError: "",
            passwordError: "",
        };
    },
    methods: {
        async handleSubmit() {
            try {
                const response = await apiClient.post("/users/Account/Login", {
                    userName: this.userName,
                    password: this.password,
                    rememberMe: this.rememberMe,
                });

                this.$router.push("/");
                this.$store.dispatch("checkAuthenticationStatus");
                // this.$store.dispatch('connectSignalR');

                console.log(this.$t("login.success"), response.config.data);
            } catch (error) {
                console.error(this.$t("login.failed"), error);
                if (error.response && error.response.data) {
                    this.validationSummary = error.response.data.error || this.$t("login.failed");
                } else {
                    this.validationSummary = this.$t("login.failed");
                }
            }
        },
    },
};
</script>

<style scoped>
.outer-box {
    background-color: #1C2B42;
    /* Blue color */
    color: white;
    width: 1600px;
    height: 1600px;
    position: absolute;
    top: -280px;
    left: -360px;
    z-index: -10000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    clip-path: path("M 0 1600 Q 800 -1600 1600 1600 L 1600 1600 L 0 1600 Z"
        );
    transform: rotate(90deg);
    /* Rotate the entire box */
    transform-origin: center;
    /* Center rotation */
}

.inner-box {
    background-color: #E2B43C;
    /* White background for input fields */
    width: 600px;
    height: 400px;
    padding: 20px;
    z-index: 2;
    position: relative;
    left: -600px;
    top: -120px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

.v-btn {
    font-weight: bold;
}

.v-alert {
    border-radius: 8px;
}

.login-btn {
    font-weight: bold;
    font-size: 1.5rem;
    padding: 30px;
    position: relative;
    top: 600px;
}

.login-circle {
    width: 120px;
    height: 120px;
    /* border: 2px solid #1C2B42; */
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    font-weight: bold;
    position: absolute;
    top: 100px;
    right: -280px;
    /* top: 600px; */
}

.login-button {
    background-color: #AA1B1D;
    color: white;
    border: none;
    border-radius: 100%;
    width: 100%;
    height: 100%;
    cursor: pointer;
    top: -20px;
    font-size: 2rem;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-20px);
        background-color: #AA1B1D;
    }
}

.curve-decoration {
    position: absolute;
    width: 100%;
    height: auto;
    top: 0;
    z-index: 1000000;
}
</style>