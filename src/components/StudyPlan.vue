<template>
    <div v-if="isCelebrating" class="celebration">
        <div class="confetti" v-for="n in 200" :key="n" :style="{ animationDelay: `${n * 10}ms`, backgroundColor: getConfettiColor(n) }"></div>
    </div>
    <div class="study-plan">
        <h2>{{ studyPlan.title }}</h2>
        <h2>Prerequisite</h2>
        <ul class="prerequisite-list">
            <div v-for="(lesson, key) in studyPlan.prerequisite" :key="key" class="item-box"
                @click="toggleDetails(key, 'prerequisite')">
                <v-progress-linear :model-value="lesson.progressPercentage" color="light-green-darken-4" height="10"
                    striped></v-progress-linear>
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
                    <v-progress-linear :model-value="lesson.progressPercentage" color="light-green-darken-4" height="10"
                        striped></v-progress-linear>
                    <div class="title">{{ lesson.name }}</div>
                    <div v-if="detailsVisible.mainCurriculum[key]" class="description">
                        {{ lesson.description }}
                        <!-- Flex container for link previews -->
                        <div class="link-previews-container">
                            <!-- Resource Link Previews for Main Curriculum Lessons -->
                            <v-card v-for="(preview, index) in  lessonPreviews[`mainCurriculum-${key}`]"
                                :key="`mainCurriculum-${key}-preview-${index}`" class="link-preview-container">
                                <!-- <v-card> -->
                                <v-card-item @click.stop>
                                    <a :href="preview.url" target="_blank">
                                        <div>{{ preview.title }}</div>
                                        <img :src="preview.image" alt="缩略图" />
                                        <p>{{ preview.description }}</p>
                                    </a>
                                    <!-- Checkbox to mark the resource as learned -->
                                    <v-checkbox v-model="lesson.resources[index].learned"
                                        @change.prevent="() => markResourceAsLearned(preview, lesson, 'mainCurriculum', index)"
                                        :label="lesson.resources[index].learned ? '已完成' : '未完成'">
                                    </v-checkbox>
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
import { apiClient } from '@/api';

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
            isCelebrating: false,
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

        async markResourceAsLearned(preview, lesson, lessonType, index) {
            // Store the initial learned status
            const wasLearned = lesson.resources[index].learned;

            if (!wasLearned) {
                // If trying to unlearn, confirm the action
                const confirmed = confirm('确定要将它重新标记为未完成吗?');
                if (!confirmed) {
                    // If the user cancels, revert the learned status and exit the method
                    lesson.resources[index].learned = !wasLearned;
                    return;
                }
            } else {
                // If learning for the first time, no confirmation needed
                // Show celebration if marking as learned for the first time
                this.showCelebration();
            }

            // Update the learned status based on the action
            // Note: The actual toggling for learning new resources is automatically handled by v-model binding
            lesson.resources[index].learned = !wasLearned;

            try {
                // API call to update the backend with the new learned status
                await apiClient.post('/StudyPlan/LearningLessons/ToggleFinishedLearning', {
                    name: lesson.name,
                    resourceLink: preview.url
                });
                // Handle any additional UI updates or state management here

                // Emit an event or call a method to refresh the UI as needed
                this.$emit('resourceUpdated', lessonType, index);
            } catch (error) {
                console.error('Error updating resource learned status:', error);
                // Revert the change in case of an API error
                lesson.resources[index].learned = wasLearned;
                // Optionally, inform the user that the update failed
            }
        },

        showCelebration() {
            this.isCelebrating = true;

            // Automatically hide the celebration effect after a short duration
            setTimeout(() => {
                this.isCelebrating = false;
            }, 4000); // Duration of the celebration animation
        },

        getBackgroundStyle(progressPercentage) {
            // Create a linear gradient from green to the original background color at the progress point
            const backgroundStyle = {
                backgroundImage: `linear-gradient(to right, green ${progressPercentage}%, #ffffff ${progressPercentage}%)`
            };
            return backgroundStyle;
        },

        getConfettiColor(index) {
            // Return a random color for the confetti
            const colors = ['#D5282A', '#01FFF7', '#E4D8C0', '#000000'];
            return colors[index % colors.length];
        }
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
    position: relative;
    overflow: hidden;
    /* Ensure the pseudo-element doesn't extend outside the box */
    flex: 0 0 auto;
    /* Adjust this to control the size of the boxes */
    background-color: #ffffff;
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
    margin-bottom: 20px;
    /* Ensure there's space for the progress bar */
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

@keyframes celebration-animation {
    0% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }

    80% {
        opacity: 1;
    }

    100% {
        transform: translateY(30vh) scale(0);
        opacity: 0;
    }
}

.celebration {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    display: flex;
    flex-wrap: wrap;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    align-items: start;
    overflow: hidden;
    z-index: 9999;
}

.confetti {
    width: 10px;
    height: 10px;
    background-color: red;
    animation: celebration-animation 1.5s linear forwards;
}
</style>
