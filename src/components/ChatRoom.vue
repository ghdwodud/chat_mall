<template>
  <div class="chat-room">
    <div class="chat-header">
      <h2>{{ roomName }}</h2>
      <div class="online-users">
        접속자 수: {{ onlineUsers }}
      </div>
    </div>
    
    <div class="chat-messages" ref="messageContainer">
      <div v-for="(message, index) in messages" 
           :key="index" 
           :class="['message', message.sender === currentUser ? 'sent' : 'received']">
        <div class="message-info">
          <span class="sender">{{ message.sender }}</span>
          <span class="time">{{ formatTime(message.timestamp) }}</span>
        </div>
        <div class="message-content">{{ message.content }}</div>
      </div>
    </div>

    <div class="chat-input">
      <input 
        type="text" 
        v-model="newMessage" 
        @keyup.enter="sendMessage"
        placeholder="메시지를 입력하세요..."
      >
      <button @click="sendMessage">전송</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatRoom',
  data() {
    return {
      roomName: '채팅방',
      currentUser: 'User1',
      onlineUsers: 0,
      messages: [],
      newMessage: '',
      websocket: null
    }
  },
  methods: {
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    sendMessage() {
      if (!this.newMessage.trim()) return;
      
      const message = {
        type: 'CHAT',
        sender: this.currentUser,
        content: this.newMessage,
        timestamp: new Date().getTime()
      };
      
      // WebSocket을 통해 메시지 전송
      this.websocket.send(JSON.stringify(message));
      this.newMessage = '';
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messageContainer;
        container.scrollTop = container.scrollHeight;
      });
    },
    initializeWebSocket() {
      // WebSocket 연결 설정
      this.websocket = new WebSocket('ws://localhost:8080/chat');
      
      this.websocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        this.messages.push(message);
        this.scrollToBottom();
      };

      this.websocket.onopen = () => {
        console.log('WebSocket 연결됨');
      };

      this.websocket.onclose = () => {
        console.log('WebSocket 연결 종료');
      };
    }
  },
  mounted() {
    this.initializeWebSocket();
  },
  beforeUnmount() {
    if (this.websocket) {
      this.websocket.close();
    }
  }
}
</script>

<style scoped>
.chat-room {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f5f5;
}

.chat-header {
  padding: 1rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  max-width: 70%;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  margin: 0.5rem 0;
}

.sent {
  align-self: flex-end;
  background-color: #42b983;
  color: white;
}

.received {
  align-self: flex-start;
  background-color: white;
}

.message-info {
  font-size: 0.8rem;
  margin-bottom: 0.3rem;
}

.sender {
  font-weight: bold;
  margin-right: 0.5rem;
}

.time {
  color: #666;
}

.chat-input {
  padding: 1rem;
  background-color: white;
  display: flex;
  gap: 1rem;
}

.chat-input input {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
}

.chat-input button {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.chat-input button:hover {
  background-color: #3aa876;
}
</style> 