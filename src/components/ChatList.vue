<template>
  <div class="chat-list">
    <div class="chat-list-header">
      <h2>채팅방 목록</h2>
      <el-button type="primary" @click="showCreateRoomDialog">
        새로운 채팅방
      </el-button>
    </div>

    <el-scrollbar height="calc(100vh - 180px)">
      <el-menu class="chat-rooms">
        <el-menu-item 
          v-for="room in chatStore.rooms" 
          :key="room.id"
          @click="joinRoom(room)"
        >
          <template #title>
            <el-badge :value="room.unreadCount" :hidden="!room.unreadCount" class="room-badge">
              <div class="room-info">
                <span class="room-name">{{ room.name }}</span>
                <span class="room-last-message">{{ room.lastMessage }}</span>
              </div>
            </el-badge>
          </template>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>

    <el-dialog
      v-model="createRoomDialogVisible"
      title="새로운 채팅방 만들기"
      width="30%"
    >
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

export default {
  name: 'ChatList',
  setup() {
    const chatStore = useChatStore()
    return { chatStore }
  },
  data() {
    return {
      createRoomDialogVisible: false,
      newRoom: {
        name: ''
      }
    }
  },
  methods: {
    joinRoom(room) {
      this.chatStore.joinRoom(room.id)
      this.chatStore.setCurrentRoom(room)
    },
    showCreateRoomDialog() {
      this.createRoomDialogVisible = true
    },
    createRoom() {
      if (this.newRoom.name.trim()) {
        this.chatStore.createRoom(this.newRoom.name)
        this.createRoomDialogVisible = false
        this.newRoom.name = ''
      }
    }
  }
}
</script>

<style scoped>
.chat-list {
  width: 300px;
  border-right: 1px solid var(--el-border-color);
  height: 100%;
  display: flex;
  flex-direction: column;
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
  border-right: none;
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
</style> 