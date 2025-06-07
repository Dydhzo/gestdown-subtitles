import { createRouter, createWebHistory } from 'vue-router'
import ConfigView from '@/views/ConfigView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'config',
      component: ConfigView
    },
    {
      path: '/:configuration?/configure',
      name: 'configure',
      component: ConfigView
    }
  ]
})

export default router