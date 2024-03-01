import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'animate.css'
import PrimeVue from 'primevue/config'
import Lara from './presets/lara'
import Ripple from 'primevue/ripple'
import 'primeicons/primeicons.css'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
// @ts-ignore
import { Vue3Mq } from "vue3-mq"
import {createPinia} from 'pinia'
import { useTodoStore } from './stores/todoStores'

const app = createApp(App)

// Pinia init
const pinia = createPinia()
app.use(pinia)
// Load data
const todoStore = useTodoStore()
todoStore.getFromLocalStorage()


app.use(ConfirmationService)
app.use(DialogService)
app.use(Vue3Mq)
app.use(PrimeVue, {
    unstyled: false,
    pt: Lara,
    ripple: true
})
app.directive('ripple', Ripple)
app.mount('#app')
