import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '../views/Chat.vue'
import RoomView from '../views/RoomView.vue'

const routes = [
  {
    path: '/',
    name: 'Chat',
    component: ChatView
  },
  {
    path: '/room/:id',
    name: 'ChatRoom',
    component: RoomView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 