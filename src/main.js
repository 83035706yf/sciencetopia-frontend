/* Set up using Vue 3 */
import { createApp } from 'vue'
import App from './App.vue'

/* import router*/
import router from './router'

/* import custom css*/ 
import './assets/css/site.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { faSun } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faSearch)
library.add(faSun)

createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
.use(router)
.mount('#app')