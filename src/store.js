// src/store.js or src/store/index.js
import { createStore } from 'vuex';
import { apiClient } from '@/api';  // Adjust the path to your api.js file

export default createStore({
  state: {
    isAuthenticated: false,
    avatarUrl: '头像URL',
    selectedNode: null
  },
  mutations: {
    SET_AUTHENTICATED(state, value) {
      state.isAuthenticated = value;
    },
    SET_AVATAR_URL(state, value) {
      state.avatarUrl = value;
    },
    setSelectedNode(state, node) {
      state.selectedNode = node;
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
  },
});