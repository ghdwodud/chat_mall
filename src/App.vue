<template>
  <div id="app">
    <header class="header">
      <h1 class="logo">Vue Chat App</h1>
      <div class="user-info" v-if="currentUser">
        <span>{{ currentUser }}</span>
        <button @click="logout" class="logout-btn">로그아웃</button>
      </div>
    </header>

    <main class="main-content">
      <template v-if="isLoggedIn">
        <ChatList 
          @join-room="handleJoinRoom"
          class="chat-list-container"
        ></ChatList>
        <ChatRoom 
          v-if="selectedRoom"
          :room-id="selectedRoom.id"
          class="chat-room-container"
        ></ChatRoom>
        <div v-else class="welcome-message">
          채팅방을 선택하거나 새로운 방을 만들어보세요!
        </div>
      </template>
      <div v-else class="login-container">
        <h2>로그인</h2>
        <input 
          type="text" 
          v-model="username" 
          placeholder="사용자 이름을 입력하세요"
          @keyup.enter="login"
        >
        <button @click="login">입장하기</button>
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 Vue Application. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import ChatList from './components/ChatList.vue'
import ChatRoom from './components/ChatRoom.vue'

export default {
  name: 'App',
  components: {
    ChatList,
    ChatRoom
  },
  data() {
    return {
      currentUser: null,
      username: '',
      selectedRoom: null,
      isLoggedIn: false
    }
  },
  methods: {
    login() {
      if (this.username.trim()) {
        this.currentUser = this.username;
        this.isLoggedIn = true;
        this.username = '';
      }
    },
    logout() {
      this.currentUser = null;
      this.isLoggedIn = false;
      this.selectedRoom = null;
    },
    handleJoinRoom(room) {
      this.selectedRoom = room;
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Noto Sans KR', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #42b983;
  color: white;
  padding: 1rem;
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

.logout-btn {
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid white;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.main-content {
  flex-grow: 1;
  display: flex;
  overflow: hidden;
}

.chat-list-container {
  flex-shrink: 0;
}

.chat-room-container {
  flex-grow: 1;
}

.welcome-message {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #666;
  background-color: #f5f5f5;
}

.login-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background-color: #f5f5f5;
}

.login-container h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.login-container input {
  padding: 0.5rem 1rem;
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.login-container button {
  padding: 0.5rem 2rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.login-container button:hover {
  background-color: #3aa876;
}

.footer {
  background-color: #f8f9fa;
  padding: 1.5rem 0;
  text-align: center;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

p {
  line-height: 1.6;
}
</style>
