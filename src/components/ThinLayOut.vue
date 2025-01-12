<template>
  <div class="layout-wrapper">
    <header class="site-header">
      <transition name="header-transition">
        <v-app-bar app fixed dense elevated class="thin-app-bar">
          <ThinHeaderBar @showStudyPlanDialog="handleDialogClick" />
        </v-app-bar>
      </transition>

      <v-dialog
        v-model="dialog"
        persistent
        :fullscreen="$vuetify.display.smAndDown"
        :max-width="$vuetify.display.smAndDown ? '100%' : '800px'"
      >
        <v-card>
          <v-card-title>{{ $t('header.studyplan') }}</v-card-title>
          <v-card-text>
            <LearningPlanner
              ref="learningPlanner"
              @update:showStudyPlan="handleShowStudyPlanUpdate"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-1"
              text
              v-if="showStudyPlan"
              @click="triggerSavePlan"
            >
              {{ $t('save') }}{{ $t('wordbreaker')
              }}{{ $t('header.studyplan') }}
            </v-btn>
            <v-btn color="blue darken-1" text @click="closeDialog">{{
              $t('close')
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </header>

    <v-spacer class="header-spacer"></v-spacer>

    <main class="main-content">
      <slot></slot>
    </main>

    <div class="footer-container">
      <transition name="footer-transition">
        <v-footer app v-if="!showFinalFooter" class="dynamic-footer">
          <FooterBar />
        </v-footer>
      </transition>

      <DefaultFooterBar />
    </div>
  </div>
</template>

<script>
import LearningPlanner from './LearningPlanner.vue'
import ThinHeaderBar from './ThinHeaderBar.vue'
import FooterBar from './FooterBar.vue'
import DefaultFooterBar from './DefaultFooterBar.vue'

export default {
  name: 'ThinLayOut',
  components: {
    LearningPlanner,
    ThinHeaderBar,
    FooterBar,
    DefaultFooterBar,
  },
  data() {
    return {
      isLoading: false,
      dialog: false,
      showStudyPlan: false,
      showFinalFooter: false,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    triggerSavePlan() {
      this.$refs.learningPlanner.savePlan()
    },
    closeDialog() {
      this.showStudyPlan = false
      this.dialog = false
    },
    handleShowStudyPlanUpdate(value) {
      this.showStudyPlan = value
      console.log('showStudyPlan:', this.showStudyPlan)
    },
    handleDialogClick() {
      this.dialog = true
      console.log('Dialog clicked')
    },
    handleScroll() {
      const bottomThreshold = window.scrollY >= 60
      this.showFinalFooter = bottomThreshold
    },
  },
}
</script>

<style scoped>
@import '../assets/css/layout.css';
@import '../assets/css/header.css';
@import '../assets/css/switches.css';
@import '../assets/css/footer.css';
@import '../assets/css/form.css';

.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: var(--content-padding, 16px);
}

.thin-app-bar {
  min-height: 80px;
  /* 确保有足够的高度显示 padding */
  background-color: rgba(232, 218, 189, 0);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: none;
}

.header-spacer {
  height: 7vh;
}

.dynamic-footer {
  background-color: unset;
  height: 60px;
}

.header-container {
  background-color: #e8dabd;
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
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.header-button {
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 500;
}

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
}

.dot {
  display: inline-block;
  text-align: center;
}

.footer-container {
  position: relative;
}

.footer-transition-enter-active {
  animation: footer-bounce-in 0.4s ease-out;
}

.footer-transition-leave-active {
  animation: footer-bounce-out 0.4s ease-out;
}

@media (max-width: 600px) {
  .main-content {
    --content-padding: 8px;
  }

  .thin-app-bar {
    min-height: 80px;
    /* 确保有足够的高度显示 padding */
  }

  .header-spacer {
    height: 56px;
  }

  .dynamic-footer {
    height: 56px;
    padding: 8px;
  }

  .header-btn {
    padding: 0;
  }

  .dot-col .dot {
    font-size: 12px;
  }
}

@media (min-width: 601px) and (max-width: 960px) {
  .main-content {
    --content-padding: 16px;
  }
}

@media (min-width: 961px) {
  .main-content {
    --content-padding: 24px;
    max-width: 1280px;
    margin: 0 auto;
  }
}

@keyframes footer-bounce-in {
  0% {
    transform: translateY(120%);
    opacity: 0%;
  }

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

  100% {
    transform: translateY(120%);
    opacity: 0%;
  }
}
</style>
