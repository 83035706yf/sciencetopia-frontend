<template>
  <v-card>
    <v-card-title>
      <v-text-field label="知识名称" v-model="nodeData.name" outlined dense></v-text-field>
    </v-card-title>
    <v-card-text>
      <v-textarea label="知识描述" v-model="nodeData.description" outlined dense></v-textarea>
    </v-card-text>

    <!-- Dynamic inputs for "知识资源" -->
    <v-card-text v-for="(url, index) in nodeData.urls" :key="index">
      <v-row align="center" no-gutters>
        <v-col cols="11">
          <v-text-field class="flex-grow-1" label="知识资源" v-model="url.link" outlined dense></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-btn variant="text" icon @click.prevent="removeUrl(index)" v-if="nodeData.urls.length > 1">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="addUrl"><v-icon left>mdi-plus</v-icon>添加知识资源</v-btn>
    </v-card-actions>
    <!-- Add inputs for other node properties as needed -->
    <v-card-actions>
      <v-btn color="primary" @click="submitNode">创建新节点</v-btn>
      <v-btn color="error" @click="cancelNodeCreation">取消</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex'; // Import useStore if you're using Vuex 4 with Vue 3

export default {
  name: 'NodeCreationForm',
  setup(props, { emit }) {
    const store = useStore(); // Access the Vuex store
    const nodeData = ref({
      name: '',
      description: '',
      urls: [{ link: '' }], // Initialize with an empty URL for "知识资源"
      // Initialize other node properties here
    });

    // Validation rules
    const rules = {
      required: value => !!value || 'Required.',
      // Add more validation rules as needed
    };

    const addUrl = () => {
      nodeData.value.urls.push({ link: ''}); // Add an empty URL field
    };

    const removeUrl = (index) => {
      nodeData.value.urls.splice(index, 1); // Remove the URL at the specified index
    };

    const updateUrl = (index, newValue) => {
      nodeData.value.urls[index] = newValue; // Update the URL at the given index
    };

    const submitNode = () => {
      // Emit an event with the new node data to the parent component
      emit('createNode', nodeData.value);
      // Reset form
      nodeData.value = {
        name: '',
        description: '',
        urls: [''], // Reset to initial state with one empty URL
      };
    };

    const cancelNodeCreation = () => {
      // // Reset form
      // nodeData.value = {
      //   name: '',
      //   description: '',
      //   // Reset other properties
      // };
      // Emit an event to the parent component to hide the form
      if (confirm("确定离开创建节点页面？创建的节点将不会被保存！")) {
        store.dispatch('toggleNodeCreationForm', false); // Assuming this toggles the visibility of the form
      }
    };

    return {
      nodeData,
      submitNode,
      cancelNodeCreation,
      addUrl,
      removeUrl,
      updateUrl,
      rules,
    };
  },
};
</script>

<style scoped>
/* Additional styling to make the form match your app's theme */
</style>
