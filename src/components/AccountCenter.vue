<template>
    <v-container>
        <v-row v-if="!showChangePasswordForm">
            <v-btn @click="toggleChangePasswordForm">更改密码</v-btn>
        </v-row>
        <v-card v-else>
            <!-- Change Password Form -->
            <v-form ref="passwordForm">
                <v-card-text>
                    <v-text-field label="Current Password" type="password" v-model="currentPassword"></v-text-field>
                    <v-text-field label="New Password" type="password" v-model="newPassword"></v-text-field>
                    <v-text-field label="Repeat New Password" type="password" v-model="newPasswordRepeat"
                        :rules="[rules.passwordMatch]"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" :disabled="!valid" @click="changePassword">Change Password</v-btn>
                    <v-btn color="grey" @click="hideChangePasswordForm">Cancel</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-container>
    <v-container>
        <v-row v-if="!showChangeEmailForm">
            <v-btn @click="toggleChangeEmailForm">更改邮箱</v-btn>
        </v-row>
        <v-card v-else>
            <!-- Change Email Form -->
            <v-form ref="emailForm">
                <v-card-text>
                    <v-text-field label="New Email" type="email" v-model="newEmail"></v-text-field>
                </v-card-text>
                <!-- Add a button to submit the form -->
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" :disabled="!valid" @click="changeEmail">Change Email</v-btn>
                    <v-btn color="grey" @click="hideChangeEmailForm">Cancel</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-container>
    <v-container>
        <v-row v-if="!showChangePhoneNumberForm">
            <v-btn @click="toggleChangePhoneNumberForm">更改手机号</v-btn>
        </v-row>
        <v-card v-else>
            <!-- Change Phone Number Form -->
            <v-form ref="phoneForm">
                <v-card-text>
                    <v-text-field label="New Phone Number" type="tel" v-model="newPhoneNumber"></v-text-field>
                </v-card-text>
                <!-- Add a button to submit the form -->
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" :disabled="!valid" @click="changePhoneNumber">Change Phone Number</v-btn>
                    <v-btn color="grey" @click="hideChangePhoneNumberForm">Cancel</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-container>
</template>
  
<script>
export default {
    data() {
        return {
            showChangePasswordForm: false,
            showChangeEmailForm: false,
            showChangePhoneNumberForm: false,
            currentPassword: '',
            newPassword: '',
            newPasswordRepeat: '',
            newEmail: '',
            newPhoneNumber: '',
            rules: {
                passwordMatch: () => (this.newPassword === this.newPasswordRepeat) || 'Passwords do not match',
                // ... other rules ...
            },
        };
    },
    methods: {
        toggleChangePasswordForm() {
            this.showChangePasswordForm = !this.showChangePasswordForm;
        },
        toggleChangeEmailForm() {
            this.showChangeEmailForm = !this.showChangeEmailForm;
        },
        toggleChangePhoneNumberForm() {
            this.showChangePhoneNumberForm = !this.showChangePhoneNumberForm;
        },
        hideChangePasswordForm() {
            this.showChangePasswordForm = false;
        },
        hideChangeEmailForm() {
            this.showChangeEmailForm = false;
        },
        hideChangePhoneNumberForm() {
            this.showChangePhoneNumberForm = false;
        },
        async changePassword() {
            // Implement logic to change password
        },
        async changeEmail() {
            // Implement logic to change email
        },
        async changePhoneNumber() {
            // Implement logic to change phone number
        },
    },
};
</script>
  
<style scoped>
/* Add any custom styles here */
</style>
  