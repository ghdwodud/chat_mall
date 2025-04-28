<template>
    <div class="room-view">
        <el-container>
            <el-header class="header">
                <div class="header-left">
                    <el-button v-if="isMobile" icon="el-icon-arrow-left" @click="goBack"
                        class="back-button"></el-button>
                    <h1 class="room-title">{{ room?.name || '채팅방' }}</h1>
                </div>
                <div class="header-right">
                    <el-tag size="small">{{ participantsCount }}명 참여중</el-tag>
                    <el-button-group>
                        <el-button size="small" @click="inviteUser">
                            초대하기
                        </el-button>
                        <el-button size="small" type="danger" @click="leaveRoom">
                            나가기
                        </el-button>
                    </el-button-group>
                </div>
            </el-header>

            <el-main class="main-content">
                <div class="chat-messages" ref="messageContainer">
                    <el-scrollbar height="calc(100vh - 180px)" ref="scrollbar">
                        <div class="message-list">
                            <div v-for="message in messages" :key="message.id"
                                :class="['message', { 'message-mine': message.sender === currentUser }]">
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
                    <el-input v-model="newMessage" placeholder="메시지를 입력하세요" :rows="3" type="textarea"
                        @keyup.enter.exact="sendMessage">
                    </el-input>
                    <el-button type="primary" @click="sendMessage" :disabled="!newMessage.trim()">
                        전송
                    </el-button>
                </div>
            </el-main>
        </el-container>

        <el-dialog v-model="inviteDialogVisible" title="사용자 초대" width="90%" :fullscreen="isMobile">
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
    name: 'RoomView',
    setup() {
        const chatStore = useChatStore()
        const router = useRouter()
        const route = useRoute()
        const isMobile = computed(() => window.innerWidth <= 768)
        const participantsCount = ref(3)
        const newMessage = ref('')
        const inviteDialogVisible = ref(false)
        const inviteForm = ref({
            username: ''
        })

        const room = computed(() => chatStore.currentRoom)
        const messages = computed(() => chatStore.messages)
        const currentUser = computed(() => chatStore.currentUser)

        const formatTime = (timestamp) => {
            return new Intl.DateTimeFormat('ko-KR', {
                hour: '2-digit',
                minute: '2-digit'
            }).format(timestamp)
        }

        const sendMessage = () => {
            if (newMessage.value.trim()) {
                chatStore.sendMessage(newMessage.value)
                newMessage.value = ''
            }
        }

        const inviteUser = () => {
            inviteDialogVisible.value = true
        }

        const sendInvite = () => {
            if (inviteForm.value.username.trim()) {
                // TODO: 실제 초대 로직 구현
                inviteDialogVisible.value = false
                inviteForm.value.username = ''
            }
        }

        const leaveRoom = () => {
            chatStore.leaveRoom()
            router.push('/')
        }

        const goBack = () => {
            router.push('/')
        }

        // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
        watch(() => messages.value, () => {
            nextTick(() => {
                const scrollbar = document.querySelector('.el-scrollbar__wrap')
                if (scrollbar) {
                    scrollbar.scrollTop = scrollbar.scrollHeight
                }
            })
        })

        onMounted(() => {
            const roomId = route.params.id
            if (roomId) {
                const targetRoom = chatStore.rooms.find(r => r.id === roomId)
                if (targetRoom) {
                    chatStore.setCurrentRoom(targetRoom)
                } else {
                    router.push('/')
                }
            }
        })

        return {
            room,
            messages,
            currentUser,
            participantsCount,
            newMessage,
            inviteDialogVisible,
            inviteForm,
            isMobile,
            formatTime,
            sendMessage,
            inviteUser,
            sendInvite,
            leaveRoom,
            goBack
        }
    }
}
</script>

<style scoped>
.room-view {
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

.header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 12px;
}

.room-title {
    margin: 0;
    font-size: 1.2rem;
    font-weight: bold;
}

.back-button {
    padding: 8px;
    margin-right: 8px;
}

.main-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0;
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

@media (max-width: 768px) {
    .header {
        padding: 0 10px;
    }

    .room-title {
        font-size: 1.1rem;
    }

    .message {
        max-width: 85%;
    }

    .message-header {
        font-size: 0.8em;
    }

    .chat-input {
        padding: 12px;
    }

    .chat-input .el-button {
        height: 60px;
    }
}
</style>