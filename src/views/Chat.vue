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
        <ChatList class="chat-list-container"></ChatList>
        <ChatRoom 
          v-if="chatStore.currentRoom"
          class="chat-room-container"
        ></ChatRoom>
        <el-empty v-else description="채팅방을 선택하거나 새로운 방을 만들어보세요!"></el-empty>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { useChatStore } from '../stores/chat'
import ChatList from '../components/ChatList.vue'
import ChatRoom from '../components/ChatRoom.vue'

export default {
  name: 'ChatView',
  components: {
    ChatList,
    ChatRoom
  },
  setup() {
    const chatStore = useChatStore()
    chatStore.setCurrentUser('익명 사용자')
    chatStore.initializeWebSocket()

    return {
      chatStore
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

.chat-list-container {
  flex-shrink: 0;
}

.chat-room-container {
  flex-grow: 1;
}
</style> 