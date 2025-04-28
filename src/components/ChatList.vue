<template>
  <div class="chat-list">
    <div class="chat-list-header">
      <h2>채팅방 목록</h2>
      <button @click="createRoom" class="create-room-btn">방 만들기</button>
    </div>
    
    <div class="rooms">
      <div v-for="room in rooms" 
           :key="room.id" 
           class="room-item"
           @click="joinRoom(room)">
        <div class="room-info">
          <h3>{{ room.name }}</h3>
          <p>{{ room.participants }}명 참여 중</p>
        </div>
        <div class="room-status">
          <span :class="['status-indicator', room.active ? 'active' : 'inactive']"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatList',
  data() {
    return {
      rooms: [
        { id: 1, name: '일반 채팅방', participants: 5, active: true },
        { id: 2, name: '개발자 채팅방', participants: 3, active: true },
        { id: 3, name: '친목 채팅방', participants: 8, active: true }
      ]
    }
  },
  methods: {
    createRoom() {
      // TODO: 방 생성 로직 구현
      console.log('새로운 방 생성');
    },
    joinRoom(room) {
      // TODO: 방 참여 로직 구현
      console.log(`${room.name}에 참여`);
      this.$emit('join-room', room);
    }
  }
}
</script>

<style scoped>
.chat-list {
  width: 300px;
  background-color: white;
  border-right: 1px solid #eee;
  height: 100%;
}

.chat-list-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.create-room-btn {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.create-room-btn:hover {
  background-color: #3aa876;
}

.rooms {
  overflow-y: auto;
}

.room-item {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.room-item:hover {
  background-color: #f5f5f5;
}

.room-info h3 {
  margin: 0;
  font-size: 1rem;
  color: #333;
}

.room-info p {
  margin: 0.5rem 0 0;
  font-size: 0.8rem;
  color: #666;
}

.status-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.active {
  background-color: #42b983;
}

.status-indicator.inactive {
  background-color: #999;
}
</style> 