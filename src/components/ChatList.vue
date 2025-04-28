<template>
  <div class="chat-list">
    <div class="chat-list-header">
      <h2>채팅방 목록</h2>
      <el-button type="primary" @click="showCreateRoomDialog">
        새로운 채팅방
      </el-button>
    </div>

    <el-scrollbar height="calc(100vh - 180px)">
      <div class="chat-rooms">
        <div v-for="room in chatStore.rooms" :key="room.id" class="room-item" @click="handleRoomClick(room)">
          <el-badge :value="room.unreadCount" :hidden="!room.unreadCount" class="room-badge">
            <div class="room-info">
              <span class="room-name">{{ room.name }}</span>
              <span class="room-last-message">{{ room.lastMessage }}</span>
            </div>
          </el-badge>
        </div>
      </div>
    </el-scrollbar>

    <el-dialog v-model="createRoomDialogVisible" title="새로운 채팅방 만들기" width="90%" :fullscreen="isMobile">
      <el-form :model="newRoom" @submit.prevent="createRoom">
        <el-form-item label="방 이름">
          <el-input v-model="newRoom.name" placeholder="채팅방 이름을 입력하세요"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createRoomDialogVisible = false">취소</el-button>
          <el-button type="primary" @click="createRoom">생성</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { useChatStore } from '../stores/chat'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'ChatList',
  setup() {
    const chatStore = useChatStore()
    const router = useRouter()
    const createRoomDialogVisible = ref(false)
    const newRoom = ref({
      name: ''
    })
    const isMobile = computed(() => window.innerWidth <= 768)

    const handleRoomClick = (room) => {
      console.log('Room clicked:', room)
      try {
        chatStore.setCurrentRoom(room)
        console.log('Current room set:', chatStore.currentRoom)
        chatStore.joinRoom(room.id)
        console.log('Join room message sent')
        router.push(`/room/${room.id}`)
      } catch (error) {
        console.error('Error joining room:', error)
      }
    }

    const showCreateRoomDialog = () => {
      createRoomDialogVisible.value = true
    }

    const createRoom = () => {
      if (newRoom.value.name.trim()) {
        chatStore.createRoom(newRoom.value.name)
        createRoomDialogVisible.value = false
        newRoom.value.name = ''
      }
    }

    return {
      chatStore,
      createRoomDialogVisible,
      newRoom,
      isMobile,
      handleRoomClick,
      showCreateRoomDialog,
      createRoom
    }
  }
}
</script>

<style scoped>
.chat-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color);
}

.chat-list-header {
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-list-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--el-text-color-primary);
}

.chat-rooms {
  display: flex;
  flex-direction: column;
}

.room-item {
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color);
  cursor: pointer;
  transition: background-color 0.3s;
  user-select: none;
}

.room-item:hover {
  background-color: var(--el-fill-color-light);
}

.room-item:active {
  background-color: var(--el-fill-color);
}

.room-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.room-name {
  font-weight: 500;
}

.room-last-message {
  font-size: 0.9em;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.room-badge :deep(.el-badge__content) {
  z-index: 1;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 768px) {
  .chat-list-header {
    padding: 12px;
  }

  .chat-list-header h2 {
    font-size: 1.1rem;
  }

  .room-item {
    padding: 12px;
  }

  .room-name {
    font-size: 0.9rem;
  }

  .room-last-message {
    font-size: 0.8em;
  }
}
</style> 