<template>
    <v-container class="d-flex align-center justify-center"
        style="min-height: 60vh; max-height: 100vh; position: relative;">
        <svg class="thin-curve" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 700">
            <path fill="none" stroke="#D5282A" stroke-width="1" d="M 50 400 Q 650 1000 1450 0"></path>
        </svg>
        <!-- Filled Circle Decoration -->
        <div
            style="position: fixed; top: 0px; left: 10px; width: 120px; height: 120px; background-color: #E8DABD; border-radius: 50%; z-index: 100;">
        </div>
        <!-- Outer Box -->
        <v-card class="outer-box" elevation="2">
            <v-container style="position: absolute; transform: rotate(-90deg); text-align: center;">
                <v-card-text>
                    <h2 class="text-center text-white">{{ $t('login.title') }}</h2>
                </v-card-text>
                <v-card-text>
                    <h2 class="text-center text-white">{{ $t('login.dontHaveAccount') }}<p
                            @click="navigateToRegister" class="interactive-text">
                            {{ $t('login.clickHere') }}
                    </p></h2>
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

        <!-- Decorations -->
        <!-- Inclined Trapezoid Decoration -->
        <div class="dec-trapezoid">
        </div>

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

        navigateToRegister() {
            this.$router.push({ name: "register" });
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
    top: -180px;
    left: -360px;
    z-index: 1 !important;
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
    /* opacity: 0.9; */
}

.inner-box {
    background-color: #E2B43C;
    /* White background for input fields */
    width: 600px;
    height: 400px;
    padding: 20px;
    z-index: 1000 !important;
    position: relative;
    left: -600px;
    top: -40px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    /* opacity: 0.9; */
}

.dec-trapezoid {
    position: absolute;
    top: 200px;
    left: 1150px;
    width: 200px;
    height: 800px;
    background-color: #AA1B1D;
    /* clip-path: polygon(0 100%, 100% 100%, 80% 0, 20% 0); */
    position: absolute;
    bottom: 0;
    right: 0;
    transform: rotate(-15deg);
    z-index: 0 !important;
    /* opacity: 0.9; */
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
    background-color: #D5282A;
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
        border: 2px solid #1C2B42;
    }
}

.curve-decoration {
    position: absolute;
    width: 100%;
    height: auto;
    top: 0;
    z-index: 1000000;
}

.thin-curve {
    position: absolute;
    width: 100%;
    height: auto;
    top: 0;
    z-index: 3;
}

.interactive-text {
    cursor: pointer;
    text-decoration: underline;
    z-index: 1000 !important;
    position: relative;
}

/* Remove any unintentional spacing around the text */
.interactive-text::before,
.interactive-text::after {
  content: "";
  display: none;
}
</style>