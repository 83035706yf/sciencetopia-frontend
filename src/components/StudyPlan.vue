<template>
    <div class="study-plan">
        <h2>{{ studyPlan.title }}</h2>
        <h2>Prerequisite</h2>
        <ul class="prerequisite-list">
            <div v-for="(lesson, key) in studyPlan.prerequisite" :key="key" class="item-box"
                @click="toggleDetails(key, 'prerequisite')">
                <div class="title">{{ lesson.name }}</div>
                <div v-if="detailsVisible.prerequisite[key]" class="description">
                    {{ lesson.description }}
                    <!-- Resource Link Previews for Prerequisite Lessons -->
                    <div v-for="(preview, index) in lessonPreviews[`prerequisite-${key}`]"
                        :key="`prerequisite-${key}-preview-${index}`" class="link-preview-container">
                        <a :href="preview.url" target="_blank">
                            <img :src="preview.image" alt="Resource thumbnail" />
                            <div>{{ preview.title }}</div>
                            <p>{{ preview.description }}</p>
                        </a>
                    </div>
                </div>
            </div>
        </ul>
        <div class="py-3"></div>
        <h2>Main Curriculum</h2>
        <div class="main-curriculum">
            <div v-for="(lesson, key) in studyPlan.mainCurriculum" :key="key" class="module-wrapper">
                <div v-if="!isFirstKey(key)" class="arrow" :style="{ backgroundImage: 'url(' + rightArrowUrl + ')' }"></div>
                <div class="module item-box" @click="toggleDetails(key, 'mainCurriculum')">
                    <div class="title">{{ lesson.name }}</div>
                    <div v-if="detailsVisible.mainCurriculum[key]" class="description">
                        {{ lesson.description }}
                        <!-- Flex container for link previews -->
                        <div class="link-previews-container">
                            <!-- Resource Link Previews for Main Curriculum Lessons -->
                            <v-card v-for="(preview, index) in  lessonPreviews[`mainCurriculum-${key}`]"
                                :key="`mainCurriculum-${key}-preview-${index}`" class="link-preview-container">
                                <!-- <v-card> -->
                                    <v-card-item>
                                        <a :href="preview.url" target="_blank">
                                            <div>{{ preview.title }}</div>
                                            <img :src="preview.image" alt="缩略图" />
                                            <p>{{ preview.description }}</p>
                                        </a>
                                    </v-card-item>
                                <!-- </v-card> -->
                            </v-card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import rightArrow from '@/assets/images/right-arrow-next.svg';
import { useStore, mapActions, mapState } from 'vuex';
import { onBeforeUnmount } from 'vue';

export default {
    props: {
        studyPlan: {
            type: Object,
            // required: true
        }
    },
    data() {
        return {
            detailsVisible: {
                prerequisite: {},
                mainCurriculum: {}
            },
            rightArrowUrl: rightArrow,
            lessonPreviews: {}, // Object to hold previews keyed by lesson identifiers
        };
    },
    computed: {
        ...mapState({
            linkPreviews: state => state.linkPreviews,
        }),
    },
    methods: {
        ...mapActions(['fetchLinkPreviews']),

        async toggleDetails(lessonIndex, lessonType) {
            const key = `${lessonType}-${lessonIndex}`;
            // Toggle visibility
            this.detailsVisible[lessonType][lessonIndex] = !this.detailsVisible[lessonType][lessonIndex];

            if (!this.detailsVisible[lessonType][lessonIndex]) {
                return; // Collapse the details without fetching previews again
            }

            const lessons = this.studyPlan[lessonType];
            const lesson = lessons[lessonIndex];
            if (lesson.resources && lesson.resources.length > 0 && !this.lessonPreviews[key]) {
                // Dispatch the action to fetch and store previews in Vuex state
                await this.fetchLinkPreviews(lesson.resources);
                // The component's computed property will react to the state change
                this.lessonPreviews[key] = this.linkPreviews;
            }
        },

        isFirstKey(currentKey) {
            const keys = Object.keys(this.studyPlan.mainCurriculum);
            return currentKey === keys[0];
        },
    },
    setup() {
        const store = useStore();

        onBeforeUnmount(() => {
            store.dispatch('clearLinkPreviews');
        });
    }
};
</script>

<style>
@import "../assets/css/link-preview.css";

.prerequisite-list,
.main-curriculum {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    /* Adjust the space between boxes */
}

.item-box {
    flex: 0 0 auto;
    /* Adjust this to control the size of the boxes */
    background-color: #f0f0f0;
    /* Example background color */
    border: 1px solid #ccc;
    /* Example border */
    border-radius: 8px;
    /* Rounded corners */
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    /* Example shadow */
    cursor: pointer;
    transition: transform 0.3s ease;
}

.item-box:hover {
    transform: translateY(-5px);
    /* Slight raise effect on hover */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.title,
.description {
    margin: 5px 0;
    /* Adjust spacing inside each box */
}

.main-curriculum {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    /* Space for the first arrow, adjust as needed */
}

.module-wrapper {
    display: inline-flex;
    /* Use inline-flex to allow variable width */
    position: relative;
    padding-left: 20px;
    /* Space for the arrow */
}

.module-wrapper:first-child {
    padding-left: 0;
    /* No padding for the very first item */
}

.module-wrapper:first-child::before {
    content: none;
    /* No arrow before the first item */
}

.arrow {
    width: 24px;
    /* Adjust as per your SVG's aspect ratio */
    height: 24px;
    /* Adjust as per your SVG's aspect ratio */
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin-right: 20px;
    /* Space between arrow and box */
    margin-top: 10px;
}
</style>
