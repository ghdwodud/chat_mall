import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '../views/Chat.vue'

const routes = [
  {
    path: '/',
    name: 'Chat',
    component: ChatView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 