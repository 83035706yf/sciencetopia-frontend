<template>
    <v-container>
        <!-- Display Mode -->
        <div v-if="!isEditMode">
            <v-row>
                <v-col>
                    <v-avatar size="120">
                        <img :src="avatarUrl" alt="Avatar">
                    </v-avatar>
                    <v-icon large @click="enterEditMode">mdi-pencil</v-icon>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <h3>{{ userInfo.userName }}</h3>
                    <p>性别：{{ userInfo.gender }}</p>
                    <p>出生日期：{{ userInfo.formattedBirthDate }}</p>
                    <p>简介：{{ userInfo.selfIntroduction }}</p>
                    <v-divider class="border-opacity-0"></v-divider>
                    <p>完成了 {{ completedStudyPlanCount }} 个学习计划</p>
                    <p>为Sciencetopia知识网络贡献了 {{ contributedNodeCount }} 个知识节点， {{ contributedLinkCount }} 条边</p>
                    <v-divider></v-divider>
                </v-col>
            </v-row>
        </div>

        <!-- Edit Mode -->
        <v-form v-else ref="form" v-model="valid">
            <v-card>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col>
                                <v-avatar size="120" class="mb-2">
                                    <img :src="avatarUrl" alt="Avatar">
                                </v-avatar>
                                <v-icon large class="edit-avatar-icon" @click="openFilePicker">mdi-camera</v-icon>
                                <input type="file" ref="fileInput" hidden @change="onFileSelected" accept="image/*">
                                <v-text-field label="Username" v-model="userInfo.userName"
                                    :rules="usernameRules"></v-text-field>
                                <v-select label="Gender" v-model="userInfo.gender"
                                    :items="['Male', 'Female', 'Others', 'Secret']"></v-select>
                                <v-menu ref="menu" v-model="menu" :close-on-content-click="false"
                                    transition="scale-transition" offset-y min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="userInfo.formattedBirthDate" label="Date of Birth"
                                            prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on">
                                        </v-text-field>
                                    </template>
                                    <!-- Your date picker and other content here -->
                                </v-menu>
                                <v-textarea label="Self-Introduction" v-model="userInfo.selfIntroduction"></v-textarea>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" :disabled="!valid" @click="updateUserInfo">Save</v-btn>
                    <v-btn color="grey" @click="exitEditMode">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
</template>

<script>
import { apiClient } from '@/api';
import { mapState, mapActions } from 'vuex';

export default {
    name: 'PersonalInformation',
    data() {
        return {
            valid: true,
            isEditMode: false,
            usernameRules: [
                v => !!v || 'Username is required',
                v => (v && v.length <= 20) || 'Username must be less than 20 characters'
            ],
            menu: false,
            completedStudyPlanCount: 0,
            contributedNodeCount: 0,
            contributedLinkCount: 0,
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo
        }),
        avatarUrl() {
            return this.$store.state.avatarUrl;
        },
    },
    methods: {
        ...mapActions(['fetchUserInfo', 'updateUserInfo']),
        async fetchUserStatistics() {
            try {
                const userId = this.$store.state.userInfo.userId;
                const response = await apiClient.get(`/users/${userId}/statistics`);
                this.completedStudyPlanCount = response.data.completedStudyPlanCount;
                this.contributedNodeCount = response.data.contributedNodeCount;
                this.contributedLinkCount = response.data.contributedLinkCount;
            } catch (error) {
                console.error('Error fetching user statistics:', error);
            }
        },
        toggleMenu() {
            this.menu = !this.menu;
        },
        editProfile() {
            this.$router.push({ name: 'EditProfile' });  // Assuming you have an EditProfile route
        },
        enterEditMode() {
            this.isEditMode = true;
        },
        exitEditMode() {
            this.isEditMode = false;
        },
        openFilePicker() {
            this.$refs.fileInput.click();
        },
        onFileSelected(event) {
            const file = event.target.files[0];
            if (file) {
                this.selectedFile = file;
                this.uploadAvatar();
            }
        },
        async uploadAvatar() {
            if (!this.selectedFile) {
                this.$emit('show-snackbar', { text: 'Please select a file to upload.', color: 'error' });
                return;
            }

            const formData = new FormData();
            formData.append('avatarFile', this.selectedFile);

            this.loading = true; // Start loading

            try {
                const response = await apiClient.post('/users/UserInformation/UploadAvatar', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                this.loading = false; // End loading

                if (response.status === 200) {
                    this.$emit('show-snackbar', { text: 'Avatar uploaded successfully', color: 'success' });
                    this.avatarUrl = response.data.AvatarUrl; // Update avatar URL
                }
            } catch (error) {
                console.error('Error uploading avatar:', error);
                this.loading = false; // End loading
                this.$emit('show-snackbar', { text: 'Error uploading avatar.', color: 'error' });
            }
        }
    },
    async mounted() {
        await this.fetchUserInfo();
        await this.fetchUserStatistics();
    }
}
</script>

<style scoped>
.edit-avatar-icon {
    position: relative;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 50%;
}
</style>