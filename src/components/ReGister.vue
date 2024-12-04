<template>
  <v-container class="d-flex flex-column justify-center align-center">
    <v-card class="pa-6" elevation="3" outlined>
      <v-card-title class="text-h5 text-center">{{ $t('register.title') }}</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="register" ref="form" lazy-validation>
          <v-text-field
            v-model="userName"
            :label="$t('register.username')"
            variant="outlined"
            dense
            required
            class="mb-4"
          ></v-text-field>
          <v-text-field
            v-model="email"
            :label="$t('register.email')"
            variant="outlined"
            dense
            type="email"
            required
            class="mb-4"
          ></v-text-field>
          <v-text-field
            v-model="password"
            :label="$t('register.password')"
            variant="outlined"
            dense
            type="password"
            required
            class="mb-4"
          ></v-text-field>
          <v-text-field
            v-model="confirmPassword"
            :label="$t('register.confirmPassword')"
            variant="outlined"
            dense
            type="password"
            required
            class="mb-4"
          ></v-text-field>
          <v-btn type="submit" variant="outlined" color="primary" block class="mt-4">
            {{ $t('register.register') }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
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
    };
  },
  methods: {
    async register() {
      try {
        // Check if password and confirmPassword are the same
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

        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          console.error("Request data:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
      }
    },
  },
};
</script>

<style scoped>
.v-container {
  min-height: 60vh;
}

.v-card {
  max-width: 400px;
  width: 100%;
}

.v-btn {
  font-weight: bold;
}
</style>
