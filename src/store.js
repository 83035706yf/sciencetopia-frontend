// src/store.js or src/store/index.js
import { createStore } from 'vuex';
import { apiClient } from '@/api';  // Adjust the path to your api.js file

export default createStore({
  state: {
    isAuthenticated: false,
    avatarUrl: '头像URL',
    currentUserID: null, // Add this line
    userInfo: {
      userName: '',
      email: '',
      phoneNumber: '',
      gender: '',
      formattedBirthDate: '',
      selfIntroduction: '',
      originalUsername: '',
    },
    selectedNode: null,
    linkPreviews: [],
    isEditing: false,
    displayNodeCreationForm: false,
  },
  mutations: {
    SET_AUTHENTICATED(state, value) {
      state.isAuthenticated = value;
    },
    SET_CURRENT_USER_ID(state, userId) {
      state.currentUserID = userId;
    },
    RESET_CURRENT_USER_ID(state) {
      state.currentUserID = null;
    },
    SET_AVATAR_URL(state, value) {
      state.avatarUrl = value;
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    updateUserInfo(state, updatedInfo) {
      Object.assign(state.userInfo, updatedInfo);
    },
    setSelectedNode(state, node) {
      state.selectedNode = node;
    },
    resetSelectedNode(state) {
      state.selectedNode = null;
    },
    setLinkPreviews(state, previews) {
      state.linkPreviews = previews;
    },
    resetLinkPreviews(state) {
      state.linkPreviews = null;
    },
    // Mutation to toggle the isEditing state
    TOGGLE_EDIT_MODE(state) {
      state.isEditing = !state.isEditing;
    },
    RESET_EDIT_MODE(state) {
      state.isEditing = false;
      state.displayNodeCreationForm = false;
    },
    SET_DISPLAY_NODE_CREATION_FORM(state, newValue) {
      state.displayNodeCreationForm = newValue;
    },
  },
  actions: {
    async checkAuthenticationStatus({ commit }) {
      try {
        const response = await apiClient.get('/users/Account/AuthStatus');
        const isAuthenticated = response.data.isAuthenticated;
        const userId = response.data.userId;
        commit('SET_AUTHENTICATED', isAuthenticated);
        commit('SET_CURRENT_USER_ID', userId);
        console.log('UserId:', userId, 'IsAuthenticated:', isAuthenticated);
        console.log('state.currentUserID:', this.state.currentUserID, 'state.isAuthenticated:', this.state.isAuthenticated);
        if (isAuthenticated) {
          await this.dispatch('fetchUserAvatar');
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
      }
    },
    setCurrentUserID({ commit }, userId) {
      commit('SET_CURRENT_USER_ID', userId);
    },
    resetCurrentUserID({ commit }) {
      commit('RESET_CURRENT_USER_ID');
    },
    async fetchUserAvatar({ commit }) {
      try {
        const response = await apiClient.get('/users/Account/GetAvatarUrl');
        if (response && response.data) {
          commit('SET_AVATAR_URL', response.data.avatarUrl);
          // console.log('User avatar url:', response.data.avatarUrl);
        }
      } catch (error) {
        console.error('Error fetching user avatar:', error);
      }
    },
    async fetchUserInfo({ commit }) {
      try {
        const response = await apiClient.get('/users/UserInformation/GetUserInfo');
        commit('setUserInfo', response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
        // Handle the error appropriately
      }
    },
    async updateUserInfo({ commit, state }, { formRef }) {
      if (formRef.validate()) {
        try {
          const responseInfo = await apiClient.put('/users/UserInformation/Update', {
            selfIntroduction: state.userInfo.selfIntroduction,
            gender: state.userInfo.gender,
            birthDate: state.userInfo.formattedBirthDate
          });

          let responseUserName;
          if (state.userInfo.userName !== state.userInfo.originalUsername) {
            responseUserName = await apiClient.post('/users/UserInformation/ChangeUsername', { newUsername: state.userInfo.userName });
          }

          if (responseInfo.status === 200 && (!responseUserName || responseUserName.status === 200)) {
            alert('User information updated successfully');
            commit('updateUserInfo', state.userInfo);
            console.log("updated user info:", state.userInfo);
          }
        } catch (error) {
          console.error('Error updating user info:', error);
          // Handle the error appropriately
        }
      }
    },
    async fetchLinkPreviews({ commit }, resources) {
      const previews = [];
      for (const resource of resources) {
        try {
          const response = await apiClient.get('/LinkPreview', { params: { url: resource.link } });
          previews.push({
            url: resource.link,
            title: response.data.title,
            image: response.data.image,
            description: response.data.description,
          });
        } catch (error) {
          console.error('Error fetching link preview:', error);
        }
      }
      commit('setLinkPreviews', previews);
    },
    clearLinkPreviews({ commit }) {
      commit('resetLinkPreviews');
    },
    async fetchAvatarUrl(_, userId) {
      try {
        const response = await apiClient.get(`/AllUsers/GetUserAvatarById/${userId}`);
        return response.data.avatarUrl;
      } catch (error) {
        console.error('Error fetching avatar URL:', error);
        return require('@/assets/images/default_avatar.png'); // Fallback avatar
      }
    },
    // Action to commit the toggle mutation
    toggleEditMode({ commit }) {
      commit('TOGGLE_EDIT_MODE');
    },
    toggleNodeCreationForm({ commit }, newValue) {
      commit('SET_DISPLAY_NODE_CREATION_FORM', newValue);
    },
  },

  getters: {
    // Getter to access the isEditing state
    isEditing: state => state.isEditing,
  }
});