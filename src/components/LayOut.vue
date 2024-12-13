<template>
  <!-- <header> -->
  <HeaderBar @showStudyPlanDialog="handleDialogClick" />

  <!-- Thin App Bar -->
  <transition name="header-transition">
    <v-app-bar app fixed dense elevated v-if="scrolledPastHeader"
      style="height: 60px; background-color: #E8DABD; box-shadow: none; opacity: 90%;">
      <ThinHeaderBar @showStudyPlanDialog="handleDialogClick" />
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
  <!-- </header> -->

  <slot></slot>

  <!-- Footer -->
  <transition style="height: 6vh;" name="footer-transition">
    <v-footer app v-if="!showFinalFooter" style="background-color: #E8DABD;">
      <FooterBar />
    </v-footer>
  </transition>

  <!-- Final Footer -->
  <DefaultFooterBar />

  <!-- Scroll to Top Button -->
  <ScrollToTopButton />
</template>

<script>
import LearningPlanner from './LearningPlanner.vue';
import HeaderBar from './HeaderBar.vue';
import ThinHeaderBar from './ThinHeaderBar.vue';
import FooterBar from './FooterBar.vue';
import DefaultFooterBar from './DefaultFooterBar.vue';
import ScrollToTopButton from './ScrollToTopButton.vue';
// import debounce from 'lodash/debounce';
// import { apiClient } from '@/api';
// import { useStore } from 'vuex';

export default {
  name: 'LayOut',
  data() {
    return {
      isLoading: false,
      dialog: false,
      showStudyPlan: false,
      scrolledPastHeader: false, // Tracks if the initial header is out of view
      showFinalFooter: false, // Determines which footer to display
    };
  },

  components: { LearningPlanner, HeaderBar, ThinHeaderBar, FooterBar, DefaultFooterBar, ScrollToTopButton },

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

    handleDialogClick() {
      this.dialog = true;
      console.log('Dialog clicked');
    },
  },
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
