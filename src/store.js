// src/store.js or src/store/index.js
import { createStore } from 'vuex';
import apiClient from '@/api';  // Adjust the path to your api.js file

export default createStore({
  state: {
    isAuthenticated: false,
    avatarUrl: '头像URL',
  },
  mutations: {
    SET_AUTHENTICATED(state, value) {
      state.isAuthenticated = value;
    },
    SET_AVATARURL(state, value) {
        state.avatarUrl = value;
    }
  },
  actions: {
    async checkAuthenticationStatus({ commit }) {
        try {
          const response = await apiClient.get('/Account/IsAuthenticated');
          commit('SET_AUTHENTICATED', response.data.isAuthenticated);
          commit('SET_AVATARURL', response.data.avatarUrl);
          console.log(response.data.avatarUrl);
        } catch (error) {
          console.error('Error checking authentication status:', error);
        }
    },
  },
});