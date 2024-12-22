<template>
    <v-btn variant="plain" class="btn back-to-home" @click="backToHomePage">
        <img src="../assets/images/logo.png" alt="Logo" style="max-height: 120px; width: auto;" />
    </v-btn>
    <v-spacer style="height: 7vh"></v-spacer>
    <slot></slot>

    <!-- Final Footer -->
    <DefaultFooterBar />
</template>

<script>
import DefaultFooterBar from './DefaultFooterBar.vue';

export default {
    name: 'SimplestLayOut',
    data() {
        return {
        };
    },
    components: {
        DefaultFooterBar,
    },
    methods: {
        backToHomePage() {
            this.$router.push({ name: 'HomePage' });  // 跳转到LogIn组件
        },
    },
}
</script>


<style scoped>
.back-to-home {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
}
</style>