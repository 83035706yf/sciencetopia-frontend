<template>
  <div>
    <header class="site-header">
      <div class="large-header" style="height: 160px;">
        <!-- Left Section: Logo -->
        <v-container class="header-container" fluid>
          <v-row align="center">
            <v-col cols="4" class="logo-container">
              <v-btn variant="plain" class="btn" @click="backToHomePage" style="padding: 0; height: 100%;">
                <img src="../assets/images/logo_banner.png" alt="Logo"
                  style="max-height: 100%; margin-top: 3.5%; width: auto;" />
              </v-btn>
            </v-col>

            <!-- Center Section: Search -->
            <v-col cols="3" class="text-end" style="padding-top: 30px;">
              <v-row align="center" justify="center">
                <!-- Search Bar -->
                <div class="search-container">
                  <v-text-field v-model="searchQuery" :placeholder="$t('searchbar.iwanttolearn')" variant="plainfield"
                    dense hide-details clearable @keyup.enter="globalSearch" append-inner-icon="mdi-magnify"
                    @click:append-inner="globalSearch" />
                </div>
              </v-row>
            </v-col>

            <!-- Right Section: Navigation Links -->
            <v-col cols="3">
              <v-row align="center" justify="center">
                <v-btn class="header-btn two-rows-btn" variant="plain" @click="scrollToSection">
                  <div class="btn-content">
                    <img width="40" height="40"
                      src="https://img.icons8.com/external-xnimrodx-lineal-xnimrodx/64/external-media-advertising-xnimrodx-lineal-xnimrodx.png"
                      alt="external-media-advertising-xnimrodx-lineal-xnimrodx" />
                    <span class="btn-title">{{ $t('header.trend') }}</span>
                  </div>
                </v-btn>
                <v-btn class="header-btn two-rows-btn" variant="plain" @click="RouteToStudyGroup">
                  <div class="btn-content">
                    <img class="btn-icon" width="35" height="35"
                      src="https://img.icons8.com/ios/50/online-group-studying.png" alt="online-group-studying" />
                    <span class="btn-title">{{ $t('header.studygroup') }}</span>
                  </div>
                </v-btn>
                <v-btn class="header-btn two-rows-btn" variant="plain" @click="dialog = true">
                  <div class="btn-content">
                    <img width="40" height="40" src="https://img.icons8.com/ios/50/saving-book.png" alt="saving-book" />
                    <span class="btn-title">{{ $t('header.studyplan') }}</span>
                  </div>
                </v-btn>
              </v-row>
            </v-col>

            <!-- Right Section: User Actions -->
            <v-col cols="2" style="padding-top: 30px;">
              <v-row align="center" justify="end">
                <!-- User Options -->
                <LogInPartial />
                <MessageAlert />

                <!-- Dark Mode Toggle -->
                <v-btn class="header-btn two-rows-btn" variant="plain" @click="toggleTheme">
                  <div class="btn-content">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 50 50">
                      <path
                        d="M 24.90625 3.96875 C 24.863281 3.976563 24.820313 3.988281 24.78125 4 C 24.316406 4.105469 23.988281 4.523438 24 5 L 24 11 C 23.996094 11.359375 24.183594 11.695313 24.496094 11.878906 C 24.808594 12.058594 25.191406 12.058594 25.503906 11.878906 C 25.816406 11.695313 26.003906 11.359375 26 11 L 26 5 C 26.011719 4.710938 25.894531 4.433594 25.6875 4.238281 C 25.476563 4.039063 25.191406 3.941406 24.90625 3.96875 Z M 10.65625 9.84375 C 10.28125 9.910156 9.980469 10.183594 9.875 10.546875 C 9.769531 10.914063 9.878906 11.304688 10.15625 11.5625 L 14.40625 15.8125 C 14.648438 16.109375 15.035156 16.246094 15.410156 16.160156 C 15.78125 16.074219 16.074219 15.78125 16.160156 15.410156 C 16.246094 15.035156 16.109375 14.648438 15.8125 14.40625 L 11.5625 10.15625 C 11.355469 9.933594 11.054688 9.820313 10.75 9.84375 C 10.71875 9.84375 10.6875 9.84375 10.65625 9.84375 Z M 39.03125 9.84375 C 38.804688 9.875 38.59375 9.988281 38.4375 10.15625 L 34.1875 14.40625 C 33.890625 14.648438 33.753906 15.035156 33.839844 15.410156 C 33.925781 15.78125 34.21875 16.074219 34.589844 16.160156 C 34.964844 16.246094 35.351563 16.109375 35.59375 15.8125 L 39.84375 11.5625 C 40.15625 11.265625 40.246094 10.800781 40.0625 10.410156 C 39.875 10.015625 39.460938 9.789063 39.03125 9.84375 Z M 24.90625 15 C 24.875 15.007813 24.84375 15.019531 24.8125 15.03125 C 24.75 15.035156 24.6875 15.046875 24.625 15.0625 C 24.613281 15.074219 24.605469 15.082031 24.59375 15.09375 C 19.289063 15.320313 15 19.640625 15 25 C 15 30.503906 19.496094 35 25 35 C 30.503906 35 35 30.503906 35 25 C 35 19.660156 30.746094 15.355469 25.46875 15.09375 C 25.433594 15.09375 25.410156 15.0625 25.375 15.0625 C 25.273438 15.023438 25.167969 15.003906 25.0625 15 C 25.042969 15 25.019531 15 25 15 C 24.96875 15 24.9375 15 24.90625 15 Z M 24.9375 17 C 24.957031 17 24.980469 17 25 17 C 25.03125 17 25.0625 17 25.09375 17 C 29.46875 17.050781 33 20.613281 33 25 C 33 29.421875 29.421875 33 25 33 C 20.582031 33 17 29.421875 17 25 C 17 20.601563 20.546875 17.035156 24.9375 17 Z M 4.71875 24 C 4.167969 24.078125 3.78125 24.589844 3.859375 25.140625 C 3.9375 25.691406 4.449219 26.078125 5 26 L 11 26 C 11.359375 26.003906 11.695313 25.816406 11.878906 25.503906 C 12.058594 25.191406 12.058594 24.808594 11.878906 24.496094 C 11.695313 24.183594 11.359375 23.996094 11 24 L 5 24 C 4.96875 24 4.9375 24 4.90625 24 C 4.875 24 4.84375 24 4.8125 24 C 4.78125 24 4.75 24 4.71875 24 Z M 38.71875 24 C 38.167969 24.078125 37.78125 24.589844 37.859375 25.140625 C 37.9375 25.691406 38.449219 26.078125 39 26 L 45 26 C 45.359375 26.003906 45.695313 25.816406 45.878906 25.503906 C 46.058594 25.191406 46.058594 24.808594 45.878906 24.496094 C 45.695313 24.183594 45.359375 23.996094 45 24 L 39 24 C 38.96875 24 38.9375 24 38.90625 24 C 38.875 24 38.84375 24 38.8125 24 C 38.78125 24 38.75 24 38.71875 24 Z M 15 33.875 C 14.773438 33.90625 14.5625 34.019531 14.40625 34.1875 L 10.15625 38.4375 C 9.859375 38.679688 9.722656 39.066406 9.808594 39.441406 C 9.894531 39.8125 10.1875 40.105469 10.558594 40.191406 C 10.933594 40.277344 11.320313 40.140625 11.5625 39.84375 L 15.8125 35.59375 C 16.109375 35.308594 16.199219 34.867188 16.039063 34.488281 C 15.882813 34.109375 15.503906 33.867188 15.09375 33.875 C 15.0625 33.875 15.03125 33.875 15 33.875 Z M 34.6875 33.875 C 34.3125 33.941406 34.011719 34.214844 33.90625 34.578125 C 33.800781 34.945313 33.910156 35.335938 34.1875 35.59375 L 38.4375 39.84375 C 38.679688 40.140625 39.066406 40.277344 39.441406 40.191406 C 39.8125 40.105469 40.105469 39.8125 40.191406 39.441406 C 40.277344 39.066406 40.140625 38.679688 39.84375 38.4375 L 35.59375 34.1875 C 35.40625 33.988281 35.148438 33.878906 34.875 33.875 C 34.84375 33.875 34.8125 33.875 34.78125 33.875 C 34.75 33.875 34.71875 33.875 34.6875 33.875 Z M 24.90625 37.96875 C 24.863281 37.976563 24.820313 37.988281 24.78125 38 C 24.316406 38.105469 23.988281 38.523438 24 39 L 24 45 C 23.996094 45.359375 24.183594 45.695313 24.496094 45.878906 C 24.808594 46.058594 25.191406 46.058594 25.503906 45.878906 C 25.816406 45.695313 26.003906 45.359375 26 45 L 26 39 C 26.011719 38.710938 25.894531 38.433594 25.6875 38.238281 C 25.476563 38.039063 25.191406 37.941406 24.90625 37.96875 Z">
                      </path>
                    </svg>
                  </div>
                </v-btn>

                <!-- Language Switcher -->
                <v-select v-model="$i18n.locale"
                  :items="[{ title: 'English', value: 'en' }, { title: '中文', value: 'zh' }]" dense hide-details
                  solo-inverted variant="plainfield" style="max-width: 100px;" />
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- Thin App Bar -->
      <transition name="header-transition">
        <v-app-bar app fixed dense elevated v-if="scrolledPastHeader"
          style="height: 60px; background-color: #E8DABD; box-shadow: none; opacity: 90%;">
          <!-- Content remains the same -->
          <v-container fluid>
            <v-row align="center">
              <v-col cols="4" class="logo-container" style="margin-bottom: -100px;">
                <v-btn variant="plain" class="btn" @click="backToHomePage" style="padding: 0; height: 120px;">
                  <img src="../assets/images/logo.png" alt="Logo" style="max-height: 120px; width: auto;" />
                </v-btn>
              </v-col>

              <!-- Center Section: User Actions -->
              <v-col cols="3" class="text-end">
                <v-row align="center" justify="center">
                  <!-- Search Bar -->
                  <div class="search-container">
                    <v-text-field v-model="searchQuery" :placeholder="$t('searchbar.iwanttolearn')" variant="plainfield"
                      dense hide-details clearable @keyup.enter="globalSearch" append-inner-icon="mdi-magnify"
                      @click:append-inner="globalSearch" />
                  </div>
                </v-row>
              </v-col>

              <!-- Right Section: Navigation Links -->
              <v-col cols="3">
                <v-row align="center" justify="center">
                  <v-btn class="header-btn" variant="plain" @click="scrollToSection">{{ $t('header.trend') }}</v-btn>
                  <v-btn class="header-btn" variant="plain" @click="RouteToStudyGroup">{{ $t('header.studygroup')
                    }}</v-btn>
                  <v-btn class="header-btn" variant="plain" @click="dialog = true">{{ $t('header.studyplan') }}</v-btn>
                </v-row>
              </v-col>

              <!-- Right Section: User Actions -->
              <v-col cols="2" class="header-bottom">
                <v-row align="center" justify="end">
                  <!-- User Options -->
                  <LogInPartial :scrolledPastHeader="true" />
                  <MessageAlert :scrolledPastHeader="true" />

                  <!-- Dark Mode Toggle -->
                  <v-btn class="header-btn two-rows-btn" variant="plain" @click="toggleTheme">
                    <div class="btn-content">
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32"
                        viewBox="0 0 50 50">
                        <path
                          d="M 24.90625 3.96875 C 24.863281 3.976563 24.820313 3.988281 24.78125 4 C 24.316406 4.105469 23.988281 4.523438 24 5 L 24 11 C 23.996094 11.359375 24.183594 11.695313 24.496094 11.878906 C 24.808594 12.058594 25.191406 12.058594 25.503906 11.878906 C 25.816406 11.695313 26.003906 11.359375 26 11 L 26 5 C 26.011719 4.710938 25.894531 4.433594 25.6875 4.238281 C 25.476563 4.039063 25.191406 3.941406 24.90625 3.96875 Z M 10.65625 9.84375 C 10.28125 9.910156 9.980469 10.183594 9.875 10.546875 C 9.769531 10.914063 9.878906 11.304688 10.15625 11.5625 L 14.40625 15.8125 C 14.648438 16.109375 15.035156 16.246094 15.410156 16.160156 C 15.78125 16.074219 16.074219 15.78125 16.160156 15.410156 C 16.246094 15.035156 16.109375 14.648438 15.8125 14.40625 L 11.5625 10.15625 C 11.355469 9.933594 11.054688 9.820313 10.75 9.84375 C 10.71875 9.84375 10.6875 9.84375 10.65625 9.84375 Z M 39.03125 9.84375 C 38.804688 9.875 38.59375 9.988281 38.4375 10.15625 L 34.1875 14.40625 C 33.890625 14.648438 33.753906 15.035156 33.839844 15.410156 C 33.925781 15.78125 34.21875 16.074219 34.589844 16.160156 C 34.964844 16.246094 35.351563 16.109375 35.59375 15.8125 L 39.84375 11.5625 C 40.15625 11.265625 40.246094 10.800781 40.0625 10.410156 C 39.875 10.015625 39.460938 9.789063 39.03125 9.84375 Z M 24.90625 15 C 24.875 15.007813 24.84375 15.019531 24.8125 15.03125 C 24.75 15.035156 24.6875 15.046875 24.625 15.0625 C 24.613281 15.074219 24.605469 15.082031 24.59375 15.09375 C 19.289063 15.320313 15 19.640625 15 25 C 15 30.503906 19.496094 35 25 35 C 30.503906 35 35 30.503906 35 25 C 35 19.660156 30.746094 15.355469 25.46875 15.09375 C 25.433594 15.09375 25.410156 15.0625 25.375 15.0625 C 25.273438 15.023438 25.167969 15.003906 25.0625 15 C 25.042969 15 25.019531 15 25 15 C 24.96875 15 24.9375 15 24.90625 15 Z M 24.9375 17 C 24.957031 17 24.980469 17 25 17 C 25.03125 17 25.0625 17 25.09375 17 C 29.46875 17.050781 33 20.613281 33 25 C 33 29.421875 29.421875 33 25 33 C 20.582031 33 17 29.421875 17 25 C 17 20.601563 20.546875 17.035156 24.9375 17 Z M 4.71875 24 C 4.167969 24.078125 3.78125 24.589844 3.859375 25.140625 C 3.9375 25.691406 4.449219 26.078125 5 26 L 11 26 C 11.359375 26.003906 11.695313 25.816406 11.878906 25.503906 C 12.058594 25.191406 12.058594 24.808594 11.878906 24.496094 C 11.695313 24.183594 11.359375 23.996094 11 24 L 5 24 C 4.96875 24 4.9375 24 4.90625 24 C 4.875 24 4.84375 24 4.8125 24 C 4.78125 24 4.75 24 4.71875 24 Z M 38.71875 24 C 38.167969 24.078125 37.78125 24.589844 37.859375 25.140625 C 37.9375 25.691406 38.449219 26.078125 39 26 L 45 26 C 45.359375 26.003906 45.695313 25.816406 45.878906 25.503906 C 46.058594 25.191406 46.058594 24.808594 45.878906 24.496094 C 45.695313 24.183594 45.359375 23.996094 45 24 L 39 24 C 38.96875 24 38.9375 24 38.90625 24 C 38.875 24 38.84375 24 38.8125 24 C 38.78125 24 38.75 24 38.71875 24 Z M 15 33.875 C 14.773438 33.90625 14.5625 34.019531 14.40625 34.1875 L 10.15625 38.4375 C 9.859375 38.679688 9.722656 39.066406 9.808594 39.441406 C 9.894531 39.8125 10.1875 40.105469 10.558594 40.191406 C 10.933594 40.277344 11.320313 40.140625 11.5625 39.84375 L 15.8125 35.59375 C 16.109375 35.308594 16.199219 34.867188 16.039063 34.488281 C 15.882813 34.109375 15.503906 33.867188 15.09375 33.875 C 15.0625 33.875 15.03125 33.875 15 33.875 Z M 34.6875 33.875 C 34.3125 33.941406 34.011719 34.214844 33.90625 34.578125 C 33.800781 34.945313 33.910156 35.335938 34.1875 35.59375 L 38.4375 39.84375 C 38.679688 40.140625 39.066406 40.277344 39.441406 40.191406 C 39.8125 40.105469 40.105469 39.8125 40.191406 39.441406 C 40.277344 39.066406 40.140625 38.679688 39.84375 38.4375 L 35.59375 34.1875 C 35.40625 33.988281 35.148438 33.878906 34.875 33.875 C 34.84375 33.875 34.8125 33.875 34.78125 33.875 C 34.75 33.875 34.71875 33.875 34.6875 33.875 Z M 24.90625 37.96875 C 24.863281 37.976563 24.820313 37.988281 24.78125 38 C 24.316406 38.105469 23.988281 38.523438 24 39 L 24 45 C 23.996094 45.359375 24.183594 45.695313 24.496094 45.878906 C 24.808594 46.058594 25.191406 46.058594 25.503906 45.878906 C 25.816406 45.695313 26.003906 45.359375 26 45 L 26 39 C 26.011719 38.710938 25.894531 38.433594 25.6875 38.238281 C 25.476563 38.039063 25.191406 37.941406 24.90625 37.96875 Z">
                        </path>
                      </svg>
                    </div>
                  </v-btn>

                  <!-- Language Switcher -->
                  <v-select v-model="$i18n.locale"
                    :items="[{ title: 'English', value: 'en' }, { title: '中文', value: 'zh' }]" dense hide-details
                    solo-inverted variant="plainfield" style="max-width: 100px;" />
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-app-bar>
      </transition>

      <!-- Study Plan Dialog -->
      <v-dialog v-model="dialog" persistent max-width="800px">
        <v-card>
          <v-card-title>{{ $t('header.studyplan') }}</v-card-title>
          <v-card-text>
            <LearningPlanner ref="learningPlanner" @update:showStudyPlan="handleShowStudyPlanUpdate" />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text v-if="showStudyPlan" @click="triggerSavePlan">
              {{ $t('save') }}{{ $t('wordbreaker') }}{{ $t('header.studyplan') }}
            </v-btn>
            <v-btn color="blue darken-1" text @click="closeDialog">{{ $t('close') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </header>

    <slot></slot>

    <transition name="footer-transition">
      <v-footer app v-if="!showFinalFooter" style="background-color: #E8DABD; height: 60px;">
        <v-container>
          <v-row justify="center" align="center">
            <v-col cols="3">
              <v-btn class="Chinese-text-btn" variant="plain" href="/about" style="padding: 0; height: 100%;">
                <img width="40" height="40" src="https://img.icons8.com/hatch/64/conference-call.png"
                  alt="conference-call" />
                <v-spacer style="width: 10px;"></v-spacer>
                {{ $t("footer.about") }}
              </v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn class="Chinese-text-btn" variant="plain" href="/contact" style="padding: 0; height: 100%;">
                <img width="36" height="36" src="https://img.icons8.com/pulsar-line/48/email.png" alt="email" />
                <v-spacer style="width: 10px;"></v-spacer>
                {{ $t("footer.contact") }}
              </v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn class="Chinese-text-btn" variant="plain" href="/support" style="padding: 0; height: 100%;">
                <img width="40" height="40" src="https://img.icons8.com/ios/50/giving.png" alt="giving" />
                <v-spacer style="width: 10px;"></v-spacer>
                {{ $t("footer.donate") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-footer>
    </transition>

    <footer>
      <p class="bottom-footer-btn">&copy; {{ $t('footer.copy') }}</p>
      <nav>
        <ul>
          <li><a href="/about" class="bottom-footer-btn">{{ $t('footer.about') }}</a></li>
          <li><a href="/contact" class="bottom-footer-btn">{{ $t('footer.contact') }}</a></li>
          <!-- <li><a href="/privacy">隐私政策</a></li>
          <li><a href="/terms">服务条款</a></li> -->
          <li><a href="/support" class="bottom-footer-btn">{{ $t('footer.donate') }}</a></li>
        </ul>
      </nav>
    </footer>
  </div>
</template>

<script>
import LogInPartial from './LogInPartial.vue';
import LearningPlanner from './LearningPlanner.vue';
import MessageAlert from '@/components/MessageAlert.vue';  // 导入MessageAlert组件
// import debounce from 'lodash/debounce';
// import { apiClient } from '@/api';
// import { useStore } from 'vuex';

export default {
  name: 'LayOut',
  data() {
    return {
      isDarkThemeEnabled: false,
      themePath: '',
      searchQuery: '',
      searchResults: [],
      isLoading: false,
      dialog: false,
      showStudyPlan: false,
      scrolledPastHeader: false, // Tracks if the initial header is out of view
      showFinalFooter: false, // Determines which footer to display
    };
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  // created() {
  //   this.debouncedSearch = debounce(this.searchNode, 300);
  // },

  methods: {
    handleScroll() {
      const headerHeight = document.querySelector('.large-header')?.offsetHeight || 0;
      this.scrolledPastHeader = window.scrollY > headerHeight;

      const bottomThreshold = window.scrollY >= 60;
      this.showFinalFooter = bottomThreshold;
    },

    toggleTheme() {
      this.isDarkThemeEnabled = !this.isDarkThemeEnabled;
      if (this.isDarkThemeEnabled) {
        this.themePath = '/assets/css/dark-theme.css';  // 使用深色模式
      } else {
        this.themePath = '';  // 使用浅色模式
      }
    },

    backToHomePage() {
      this.$router.push({ name: 'HomePage' });  // 跳转到LogIn组件
    },

    scrollToSection() {
      // 获取目标元素的位置
      const section = document.getElementById('feed-section');
      console.log("section:", section);
      if (section) {
        const yOffset = -60; // 调整偏移量，根据需要修改
        const y = section.getBoundingClientRect().top + window.scrollY + yOffset;

        // 滚动到指定位置
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    },

    async globalSearch() {
      const query = this.searchQuery ? this.searchQuery.trim() : '';
      if (!query) {
        console.log('Search query is empty!');
        return;
      }

      this.isLoading = true;
      try {
        const path = this.$router.resolve({ name: 'searchList', query: { q: this.searchQuery } }).href;
        window.open(path, '_blank');
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        this.isLoading = false;
      }
    },

    RouteToStudyGroup() {
      this.$router.push({ name: 'studyGroupList' });
    },

    triggerSavePlan() {
      this.$refs.learningPlanner.savePlan();
    },

    closeDialog() {
      this.showStudyPlan = false;
      // Any other logic needed to handle the closing of the dialog
      this.dialog = false; // Assuming 'dialog' is a local data property controlling the dialog visibility
    },

    handleShowStudyPlanUpdate(value) {
      this.showStudyPlan = value;
    },
  },

  components: { LogInPartial, LearningPlanner, MessageAlert },
}
</script>


<style scoped>
@import "../assets/css/layout.css";
@import "../assets/css/header.css";
@import "../assets/css/switches.css";
@import "../assets/css/footer.css";
@import "../assets/css/form.css";

.header-container {
  background-color: #E8DABD;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.planner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.planner-card {
  max-width: 1600px;
  /* 或者其他合适的宽度 */
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, .3);
}

.header-button {
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 500;
}

/* 模糊背景 */
body.modal-open {
  overflow: hidden;
}

body.modal-open .main-content {
  filter: blur(5px);
}

.dot-col {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 30px;
  padding-right: 0px;
  /* Adjust padding as needed for spacing */
}

.dot {
  display: inline-block;
  text-align: center;
}

.footer-transition-enter-active {
  animation: footer-bounce-in 0.4s ease-out;
  /* Animate position and fade */
}

.footer-transition-leave-active {
  animation: footer-bounce-out 0.4s ease-out;
  /* Animate position and fade */
}

@media (max-width: 1600px) {
  .header-btn {
    padding: 0px;
  }
  
  .dot-col .dot {
    font-size: 12px;
    /* Adjust dot size for small screens */
  }

  .header-bottom {
    /* width: 10%;
    height: 10%; */
    padding-top: 30px;
  }

  .search-container {
    /* width: 50%; */
    /* height: 10%; */
    padding: 0px;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .search-btn {
    font-size: 12px;
    padding: 0px;
  }

  .search-form input {
    border: 0px;
    margin: 0px;
    padding-left: 0px;
    border-radius: px;
  }
}

@keyframes footer-bounce-in {
  0% {
    transform: translateY(120%);
    opacity: 0%;
  }

  /* 60% {
    transform: translateY(10px);
    opacity: 1;
  } */
  100% {
    transform: translateY(0);
    opacity: 100%;
  }
}

@keyframes footer-bounce-out {
  0% {
    transform: translateY(0);
    opacity: 100%;
  }

  /* 60% {
    transform: translateY(10px);
    opacity: 1;
  } */
  100% {
    transform: translateY(120%);
    opacity: 0%;
  }
}
</style>
