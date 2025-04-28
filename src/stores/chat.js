import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: () => ({
    currentUser: null,
    rooms: [],
    currentRoom: null,
    messages: [],
    websocket: null
  }),
  
  actions: {
    setCurrentUser(username) {
      this.currentUser = username
    },
    
    addRoom(room) {
      this.rooms.push(room)
    },
    
    setCurrentRoom(room) {
      this.currentRoom = room
      this.messages = []
    },
    
    addMessage(message) {
      this.messages.push(message)
    },
    
    initializeWebSocket() {
      this.websocket = new WebSocket('ws://localhost:8080/chat')
      
      this.websocket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        let roomIndex
        switch (data.type) {
          case 'MESSAGE':
            this.addMessage(data.message)
            break
          case 'ROOM_UPDATE':
            roomIndex = this.rooms.findIndex(r => r.id === data.room.id)
            if (roomIndex !== -1) {
              this.rooms[roomIndex] = data.room
            } else {
              this.addRoom(data.room)
            }
            break
        }
      }
      
      this.websocket.onopen = () => {
        console.log('WebSocket 연결됨')
      }
      
      this.websocket.onclose = () => {
        console.log('WebSocket 연결 종료')
      }
    },
    
    sendMessage(content) {
      if (this.websocket && this.currentRoom) {
        const message = {
          type: 'MESSAGE',
          roomId: this.currentRoom.id,
          sender: this.currentUser,
          content,
          timestamp: new Date()
        }
        this.websocket.send(JSON.stringify(message))
      }
    },
    
    createRoom(name) {
      if (this.websocket) {
        const message = {
          type: 'CREATE_ROOM',
          name
        }
        this.websocket.send(JSON.stringify(message))
      }
    },
    
    joinRoom(roomId) {
      if (this.websocket) {
        const message = {
          type: 'JOIN_ROOM',
          roomId
        }
        this.websocket.send(JSON.stringify(message))
      }
    },
    
    leaveRoom() {
      if (this.websocket && this.currentRoom) {
        const message = {
          type: 'LEAVE_ROOM',
          roomId: this.currentRoom.id
        }
        this.websocket.send(JSON.stringify(message))
        this.currentRoom = null
      }
    }
  }
}) 