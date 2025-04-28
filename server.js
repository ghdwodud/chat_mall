const WebSocket = require('ws')
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

const server = app.listen(8080, () => {
  console.log('Server is running on port 8080')
})

const wss = new WebSocket.Server({ server })

// 채팅방 데이터 저장
const rooms = new Map()
const clients = new Map()

wss.on('connection', (ws) => {
  const clientId = Date.now().toString()
  clients.set(clientId, ws)

  ws.on('message', (message) => {
    const data = JSON.parse(message)
    
    switch (data.type) {
      case 'CREATE_ROOM':
        const roomId = Date.now().toString()
        const room = {
          id: roomId,
          name: data.name,
          participants: [],
          messages: []
        }
        rooms.set(roomId, room)
        broadcastRoomUpdate(room)
        break

      case 'JOIN_ROOM':
        const roomToJoin = rooms.get(data.roomId)
        if (roomToJoin) {
          roomToJoin.participants.push(clientId)
          broadcastRoomUpdate(roomToJoin)
        }
        break

      case 'LEAVE_ROOM':
        const roomToLeave = rooms.get(data.roomId)
        if (roomToLeave) {
          roomToLeave.participants = roomToLeave.participants.filter(id => id !== clientId)
          broadcastRoomUpdate(roomToLeave)
        }
        break

      case 'MESSAGE':
        const roomForMessage = rooms.get(data.roomId)
        if (roomForMessage) {
          const message = {
            id: Date.now().toString(),
            sender: data.sender,
            content: data.content,
            timestamp: data.timestamp
          }
          roomForMessage.messages.push(message)
          broadcastMessage(roomForMessage, message)
        }
        break
    }
  })

  ws.on('close', () => {
    clients.delete(clientId)
    // 참여 중인 모든 방에서 사용자 제거
    rooms.forEach(room => {
      room.participants = room.participants.filter(id => id !== clientId)
      broadcastRoomUpdate(room)
    })
  })
})

function broadcastRoomUpdate(room) {
  const message = {
    type: 'ROOM_UPDATE',
    room: {
      id: room.id,
      name: room.name,
      participantsCount: room.participants.length,
      lastMessage: room.messages[room.messages.length - 1]?.content || '',
      unreadCount: 0
    }
  }
  
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message))
    }
  })
}

function broadcastMessage(room, message) {
  const messageToSend = {
    type: 'MESSAGE',
    message
  }
  
  room.participants.forEach(participantId => {
    const client = clients.get(participantId)
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(messageToSend))
    }
  })
} 