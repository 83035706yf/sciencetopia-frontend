<template>
    <v-dialog v-model="internalDialog" persistent max-width="600px">
      <v-card>
        <v-card-title class="text-h5">编辑指南和协约</v-card-title>
        <v-card-text>
          <div>这里放置编辑指南的内容...</div>
          <v-checkbox v-model="agreed" label="我同意上述协议"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="cancel">取消</v-btn>
          <v-btn color="primary" :disabled="!agreed" @click="confirm">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    props: {
      modelValue: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      internalDialog: {
        get() {
          return this.modelValue;
        },
        set(value) {
          this.$emit('update:modelValue', value);
        },
      },
    },
    data() {
      return {
        agreed: false,
      };
    },
    methods: {
      confirm() {
        this.$emit('confirmed'); // 触发确认事件
        this.internalDialog = false; // 关闭对话框
      },
      cancel() {
        this.internalDialog = false; // 直接关闭对话框，不需要触发外部事件
      },
    },
  };
  </script>
  