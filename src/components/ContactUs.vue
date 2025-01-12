<template>
  <v-container class="contact-page py-5">
    <h1>联系我们</h1>
    <v-spacer class="my-5"></v-spacer>
    <p>如果你对我们感兴趣，想要加入我们的开发团队，或者对我们有任何的意见或反馈，欢迎你联系我们：</p>
    <v-spacer class="my-5"></v-spacer>
    <p>邮箱：</p>
    <p>B站账号：<a href="https://space.bilibili.com/3493268788612034" target="_blank" class="bilibili-url">Sciencetopia</a>
    </p>
  </v-container>
</template>

<script>
export default {
  name: 'ContactUs',
}
</script>

<style scoped>
.contact-page {
  padding: 0 10%;
}

.bilibili-url {
  color: #3f51b5;
}

.bilibili-url:hover {
  text-decoration: underline;
}
</style>