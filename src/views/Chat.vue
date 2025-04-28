<template>
  <div class="chat-view">
    <el-container>
      <el-header class="header">
        <h1 class="logo">Vue Chat App</h1>
        <div class="user-info">
          <el-text>익명 사용자</el-text>
        </div>
      </el-header>

      <el-main class="main-content">
        <div class="chat-container" :class="{ 'mobile-view': isMobileView }">
          <ChatList class="chat-list-container" :class="{ 'mobile-hidden': isMobileView && chatStore.currentRoom }">
          </ChatList>
          <el-empty v-if="!chatStore.currentRoom" description="채팅방을 선택하거나 새로운 방을 만들어보세요!"></el-empty>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { useChatStore } from '../stores/chat'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ChatList from '../components/ChatList.vue'

export default {
  name: 'ChatView',
  components: {
    ChatList
  },
  setup() {
    const chatStore = useChatStore()
    const router = useRouter()
    const isMobileView = ref(window.innerWidth <= 768)

    const handleResize = () => {
      isMobileView.value = window.innerWidth <= 768
    }

    onMounted(() => {
      chatStore.setCurrentUser('익명 사용자')
      chatStore.initializeWebSocket()
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })

    return {
      chatStore,
      isMobileView
    }
  }
}
</script>

<style>
.chat-view {
  height: 100vh;
}

.el-container {
  height: 100%;
}

.header {
  background-color: #42b983;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.main-content {
  flex-grow: 1;
  display: flex;
  overflow: hidden;
  padding: 0;
}

.chat-container {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
}

.chat-list-container {
  flex-shrink: 0;
  width: 300px;
  border-right: 1px solid var(--el-border-color);
  transition: transform 0.3s ease;
}

/* 모바일 스타일 */
@media (max-width: 768px) {
  .header {
    padding: 0 10px;
  }

  .logo {
    font-size: 1.2rem;
  }

  .chat-list-container {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
  }

  .mobile-hidden {
    transform: translateX(-100%);
  }
}
</style> 