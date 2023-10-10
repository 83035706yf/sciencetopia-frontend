/* Set up using Vue 3 */
import { createApp } from 'vue'
import App from './App.vue'

/* import router */
import router from './router'

/* import custom css */ 
import './assets/css/site.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { faSun } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faSearch, faSun)

/* Import Vuetify and its styles */
import { createVuetify } from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

/* Create Vue app */
const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)

/* Use Vuetify */
const vuetify = createVuetify({
    // 这里可以提供一些Vuetify选项
  })
    
app.use(vuetify)

app.mount('#app')