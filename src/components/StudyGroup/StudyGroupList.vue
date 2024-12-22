<template>
  <GlobalLoader />
  <v-container v-if="!isLoading">
    <div v-if="groups.length === 0" class="empty-state">
      <p>
        暂时没有学习小组，去
        <button @click="toCreateGroupPage">创建</button>
        第一个吧！
      </p>
    </div>
    <div ref="masonryContainer" class="masonry-container">
      <div v-for="group in groups" :key="group.id" class="masonry-item">
        <v-card class="st-card">
          <v-img class="group-image" @click="toGroupPage(group.id)"
            :src="group.imageUrl ? require(`@/assets/images/${group.imageUrl}`) : require('@/assets/images/default_study_group.png')"
            aspect-ratio="16/9" cover></v-img>
          <!-- <v-img aspect-ratio="16/9" cover
            :src="group.imageurl ? group.imageurl : require('@/assets/images/default_study_group.png')"></v-img> -->
          <v-card-title>
            <button @click="toGroupPage(group.id)" class="group-name">{{ group.name }}</button>
          </v-card-title>
          <v-card-text class="group-description">
            {{ group.description }}
          </v-card-text>
          <v-card-text class="group-members">
            小组成员:
            <div class="member-list">
              <v-btn v-for="member in group.members" :key="member.id" icon class="default-avatar"
                @click="navigateToProfile(member.id)" size="38">
                <v-avatar size="36">
                  <img :src="member.avatarUrl" alt="用户头像" />
                </v-avatar>
              </v-btn>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn v-if="group.isMember" color="primary" text disabled>已加入</v-btn>
            <template v-else>
              <v-btn color="primary" text @click="applyToJoin(group.id)">申请加入</v-btn>
              <v-btn color="primary" text @click="follow(group.id)">关注</v-btn>
            </template>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script>
import { useGlobalLoading } from '../GlobalLoader.vue';
import { mapActions } from 'vuex';
// import { apiClient } from '@/api';
import mockStudyGroup from '../../assets/data/mockStudyGroup.json'; // Import the mock data
import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";

export default {
  name: 'StudyGroupList',
  setup() {
    const { isLoading, showLoading, hideLoading } = useGlobalLoading();

    return {
      isLoading,
      showLoading,
      hideLoading
    };
  },
  data() {
    return {
      groups: [], // This will be filled with data from the mock file or the backend
      masonryInstance: null
    };
  },
  methods: {
    ...mapActions(['goToProfile']),

    initMasonry() {
      // Initialize Masonry
      const container = this.$refs.masonryContainer;
      this.masonryInstance = new Masonry(container, {
        itemSelector: ".masonry-item",
        columnWidth: ".masonry-item",
        percentPosition: true,
        gutter: 16
      });

      // Use imagesLoaded to wait for images to load before laying out Masonry
      imagesLoaded(container).on("progress", () => {
        this.masonryInstance.layout(); // Recalculate layout for every loaded image
      });
    },

    async fetchGroups() {
      // Use mock data instead of API call
      this.groups = mockStudyGroup;

      // Uncomment the following lines to use the actual API
      // this.showLoading();
      // try {
      //   const response = await apiClient.get('/StudyGroup/GetAllStudyGroups');
      //   const groupsWithAvatars = await Promise.all(
      //     response.data.map(async (group) => {
      //       const members = await Promise.all(
      //         group.memberIds.map(async (memberId) => ({
      //           id: memberId.id,
      //           avatarUrl: await this.$store.dispatch('fetchAvatarUrl', memberId.id)
      //         }))
      //       );
      //       const isMember = group.memberIds.some(
      //         (memberId) => memberId.id === this.$store.state.currentUserID
      //       );
      //       console.log('isMember:', isMember);
      //       return { ...group, members, isMember }; // Replace memberIds with members including avatars
      //     })
      //   );
      //   this.groups = groupsWithAvatars;
      // } catch (error) {
      //   console.error('Error fetching groups:', error);
      // } finally {
      //   this.hideLoading(); // Hide loading spinner
      // }
    },

    toCreateGroupPage() {
      this.$router.push('/createstudygroup');
    },
    toGroupPage(groupId) {
      this.$router.push({ name: 'studyGroupPage', params: { groupId } });
    },
    applyToJoin(groupId) {
      console.log(`Applying to join group with ID: ${groupId}`);
    },
    async navigateToProfile(userId) {
      this.goToProfile({ userId, router: this.$router });
    },
  },
  mounted() {
    this.fetchGroups();
    this.$nextTick(() => {
      this.initMasonry();
    });
  },
  beforeUnmount() {
    if (this.masonryInstance) {
      this.masonryInstance.destroy(); // Clean up Masonry instance
    }
  }
};
</script>

<style scoped>
@import "../../assets/css/avatar.css";

/* Container for masonry layout */
.masonry-container {
  position: relative;
}

/* Individual masonry items */
.masonry-item {
  margin-bottom: 24px;
  margin-left: 8px;
  /* Space between items vertically */
  width: 320px;
  /* Adjust dynamically */
}

/* Image styling */
.group-image {
  border-radius: 4px 4px 0 0;
  margin-bottom: 8px;
  cursor: pointer;
}

/* Group name styling */
.group-name {
  font-weight: bold;
  font-size: 1.2rem;
  color: #1C2B42;
  text-align: left;
  margin: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.group-name:hover {
  color: #304E75;
}

/* Group description */
.group-description {
  font-size: 0.9rem;
  color: #304E75;
}

/* Member list styling */
.group-members {
  color: #4A4A4A;
}

.member-list {
  display: flex;
  gap: 5px;
}

.member-avatar {
  cursor: pointer;
}

/* Create group button */
.create-group-btn {
  position: fixed;
  top: 18vh;
  right: 20px;
}
</style>
