<template>
  <v-container class="d-flex align-center justify-center"
    style="min-height: 60vh; max-height: 100vh; position: relative;">
    <!-- Decorative Parabolic Curve -->
    <svg class="thin-curve" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 800">
      <path fill="none" stroke="#AA1B1D" stroke-width="1" d="M 50 400 Q 650 1000 1450 0"></path>
    </svg>

    <!-- Filled Circle Decoration -->
    <div
      style="position: fixed; top: 0px; left: 10px; width: 120px; height: 120px; background-color: #E8DABD; border-radius: 50%; z-index: 100;">
    </div>

    <!-- Outer Box -->
    <v-card class="outer-box" elevation="2">
      <v-container style="position: absolute; transform: rotate(-90deg); text-align: center;">
        <v-card-text>
          <h2 class="text-center text-white">{{ $t('register.title') }}</h2>
        </v-card-text>
        <v-card-text>
          <h2 class="text-center text-white">{{ $t('register.alreadyHaveAccount') }}<a @click="navigateToLogin"
              style="text-decoration: underline; cursor: pointer;">
              {{ $t('register.clickHere') }}
            </a></h2>
        </v-card-text>
      </v-container>
    </v-card>

    <!-- Inner Box -->
    <v-card class="inner-box" elevation="3">
      <v-card-text>
        <v-alert v-if="validationSummary" type="error" dismissible class="mb-4">
          {{ validationSummary }}
        </v-alert>
        <v-form @submit.prevent="register" ref="form">
          <v-text-field v-model="userName" :label="$t('register.username')" variant="filled" required
            class="mb-4"></v-text-field>
          <v-text-field v-model="email" :label="$t('register.email')" variant="filled" type="email" required
            class="mb-4"></v-text-field>
          <v-text-field v-model="password" :label="$t('register.password')" variant="filled" type="password" required
            class="mb-4"></v-text-field>
          <v-text-field v-model="confirmPassword" :label="$t('register.confirmPassword')" variant="filled"
            type="password" required class="mb-4"></v-text-field>

          <!-- Register button -->
          <div class="register-circle" elevation="3">
            <button class="register-button" type="submit" block>
              {{ $t('register.register') }}
            </button>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Decorations -->
    <div class="dec-trapezoid"></div>
  </v-container>
</template>

<script>
import { apiClient } from "@/api";

export default {
  name: "ReGister",
  data() {
    return {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      validationSummary: "",
    };
  },
  methods: {
    async register() {
      try {
        if (this.password !== this.confirmPassword) {
          alert(this.$t("register.passwordMismatch"));
          return;
        }

        const response = await apiClient.post("/users/Account/Register", {
          userName: this.userName,
          email: this.email,
          password: this.password,
        });

        if (response.data.success) {
          console.log(this.$t("register.success"), response.data);
        } else {
          console.error(this.$t("register.failed"), response.data.error);
        }
      } catch (error) {
        console.error(this.$t("register.failed"), error);
        if (error.response && error.response.data) {
          this.validationSummary = error.response.data.error || this.$t("register.failed");
        } else {
          this.validationSummary = this.$t("register.failed");
        }
      }
    },

    navigateToLogin() {
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style scoped>
.outer-box {
  background-color: #1C2B42;
  color: white;
  width: 1600px;
  height: 1600px;
  position: absolute;
  top: -180px;
  left: -360px;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  clip-path: path("M 0 1600 Q 800 -1600 1600 1600 L 1600 1600 L 0 1600 Z");
  transform: rotate(90deg);
}

.inner-box {
  background-color: #E2B43C;
  width: 600px;
  height: 500px;
  padding: 20px;
  z-index: 1000 !important;
  position: relative;
  left: -600px;
  top: -40px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.v-alert {
  border-radius: 8px;
}

.register-circle {
  width: 120px;
  height: 120px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 100px;
  right: -280px;
}

.register-button {
  background-color: #D5282A;
  color: white;
  border: none;
  border-radius: 100%;
  width: 100%;
  height: 100%;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.register-button:hover {
  transform: translateY(-20px);
  background-color: #AA1B1D;
}

.dec-trapezoid {
  position: absolute;
  top: 200px;
  left: 1150px;
  width: 200px;
  height: 800px;
  background-color: #AA1B1D;
  transform: rotate(-15deg);
  z-index: 1 !important;
}

.thin-curve {
  position: absolute;
  width: 100%;
  height: auto;
  top: 0;
  z-index: 3;
}
</style>