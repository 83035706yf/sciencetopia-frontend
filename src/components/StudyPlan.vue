<template>
    <div class="study-plan">
        <h2>{{ studyPlan.study_plan.title }}</h2>
        <h2>Prerequisite</h2>
        <ul class="prerequisite-list">
            <div v-for="(item, key) in studyPlan.study_plan.prerequisite" :key="key" class="item-box"
                @click="toggleDetails(key, 'prerequisite')">
                <div class="title">{{ parseTitle(item) }}</div>
                <div v-if="detailsVisible.prerequisite[key]" class="description">{{ parseDetail(item) }}</div>
            </div>
        </ul>
        <div class="py-3"></div>
        <h2>Main Curriculum</h2>
        <div class="main-curriculum">
            <div v-for="(item, key) in studyPlan.study_plan.main_curriculum" :key="key" class="module-wrapper">
                <div v-if="!isFirstKey(key)" class="arrow" :style="{ backgroundImage: 'url(' + rightArrowUrl + ')' }"></div>
                <div class="module item-box" @click="toggleDetails(key, 'mainCurriculum')">
                    <!-- Content of the box -->
                    <div class="title">{{ parseTitle(item) }}</div>
                    <div v-if="detailsVisible.mainCurriculum[key]" class="description">{{ parseDetail(item) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import rightArrow from '@/assets/images/right-arrow-next.svg';

export default {
    data() {
        return {
            detailsVisible: {
                prerequisite: {},
                mainCurriculum: {}
            },
            rightArrowUrl: rightArrow,
        };
    },
    props: {
        studyPlan: {
            type: Object,
            required: true
        }
    },
    methods: {
        toggleDetails(key, section) {
            this.detailsVisible[section][key] = !this.detailsVisible[section][key];
        },
        parseTitle(item) {
            return item.split(':')[0];
        },
        parseDetail(item) {
            return item.split(':')[1];
        },
        isFirstKey(currentKey) {
            const keys = Object.keys(this.studyPlan.study_plan.main_curriculum);
            return currentKey === keys[0];
        },
    }
};
</script>
  
<style>
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
    width: 24px; /* Adjust as per your SVG's aspect ratio */
    height: 24px; /* Adjust as per your SVG's aspect ratio */
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin-right: 20px; /* Space between arrow and box */
    margin-top: 10px;
}

</style>
