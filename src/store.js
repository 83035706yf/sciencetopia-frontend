// src/store.js or src/store/index.js
import { createStore } from 'vuex';
import { apiClient } from '@/api';  // Adjust the path to your api.js file

export default createStore({
  state: {
    isAuthenticated: false,
    avatarUrl: '头像URL',
    selectedNode: null,
    userInfo: {
      userName: '',
      email: '',
      phoneNumber: '',
      gender: '',
      formattedBirthDate: '',
      selfIntroduction: '',
      originalUsername: '',
    }
  },
  mutations: {
    SET_AUTHENTICATED(state, value) {
      state.isAuthenticated = value;
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
    SET_HIGHLIGHTNODE(state, nodeId) {
      state.highlightNodeId = nodeId;
    }
  },
  actions: {
    async checkAuthenticationStatus({ commit }) {
      try {
        const response = await apiClient.get('/users/Account/AuthStatus');
        const isAuthenticated = response.data.isAuthenticated;
        commit('SET_AUTHENTICATED', isAuthenticated);
        if (isAuthenticated) {
          await this.dispatch('fetchUserAvatar');
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
      }
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
  },
});