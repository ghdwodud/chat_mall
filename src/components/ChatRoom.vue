<template>
  <div class="chat-room">
    <div class="chat-room-header">
      <div class="room-info">
        <h2>{{ chatStore.currentRoom?.name || '채팅방' }}</h2>
        <el-tag size="small">{{ participantsCount }}명 참여중</el-tag>
      </div>
      <el-button-group>
        <el-button size="small" @click="inviteUser">
          초대하기
        </el-button>
        <el-button size="small" type="danger" @click="leaveRoom">
          나가기
        </el-button>
      </el-button-group>
    </div>

    <div class="chat-messages" ref="messageContainer">
      <el-scrollbar height="calc(100vh - 280px)" ref="scrollbar">
        <div class="message-list">
          <div v-for="message in chatStore.messages" :key="message.id" 
               :class="['message', { 'message-mine': message.sender === chatStore.currentUser }]">
            <div class="message-header">
              <span class="sender">{{ message.sender }}</span>
              <span class="time">{{ formatTime(message.timestamp) }}</span>
            </div>
            <div class="message-content">
              {{ message.content }}
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <div class="chat-input">
      <el-input
        v-model="newMessage"
        placeholder="메시지를 입력하세요"
        :rows="3"
        type="textarea"
        @keyup.enter.exact="sendMessage"
      >
      </el-input>
      <el-button type="primary" @click="sendMessage" :disabled="!newMessage.trim()">
        전송
      </el-button>
    </div>

    <el-dialog
      v-model="inviteDialogVisible"
      title="사용자 초대"
      width="30%"
    >
      <el-form :model="inviteForm">
        <el-form-item label="사용자 이름">
          <el-input v-model="inviteForm.username" placeholder="초대할 사용자의 이름을 입력하세요"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="inviteDialogVisible = false">취소</el-button>
          <el-button type="primary" @click="sendInvite">초대하기</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { useChatStore } from '../stores/chat'

export default {
  name: 'ChatRoom',
  setup() {
    const chatStore = useChatStore()
    return { chatStore }
  },
  data() {
    return {
      participantsCount: 3,
      newMessage: '',
      inviteDialogVisible: false,
      inviteForm: {
        username: ''
      }
    }
  },
  methods: {
    formatTime(timestamp) {
      return new Intl.DateTimeFormat('ko-KR', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(timestamp)
    },
    sendMessage() {
      if (this.newMessage.trim()) {
        this.chatStore.sendMessage(this.newMessage)
        this.newMessage = ''
        this.$nextTick(() => {
          this.$refs.scrollbar.setScrollTop(999999)
        })
      }
    },
    inviteUser() {
      this.inviteDialogVisible = true
    },
    sendInvite() {
      if (this.inviteForm.username.trim()) {
        // TODO: 실제 초대 로직 구현
        this.inviteDialogVisible = false
        this.inviteForm.username = ''
      }
    },
    leaveRoom() {
      this.chatStore.leaveRoom()
    }
  }
}
</script>

<style scoped>
.chat-room {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-room-header {
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.room-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.room-info h2 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--el-text-color-primary);
}

.chat-messages {
  flex-grow: 1;
  background-color: var(--el-bg-color-page);
}

.message-list {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  max-width: 70%;
  padding: 12px;
  border-radius: 8px;
  background-color: var(--el-bg-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.message-mine {
  margin-left: auto;
  background-color: var(--el-color-primary-light-9);
}

.message-header {
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9em;
}

.sender {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.time {
  color: var(--el-text-color-secondary);
}

.message-content {
  color: var(--el-text-color-primary);
  line-height: 1.4;
  white-space: pre-wrap;
}

.chat-input {
  padding: 16px;
  border-top: 1px solid var(--el-border-color);
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.chat-input .el-input {
  flex-grow: 1;
}

.chat-input .el-button {
  flex-shrink: 0;
  height: 80px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style> 