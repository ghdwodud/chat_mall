<template>
  <div class="auth-container">
    <el-card class="auth-card">
      <template #header>
        <div class="auth-header">
          <h2>{{ isLogin ? '로그인' : '회원가입' }}</h2>
          <el-button link @click="toggleAuthMode">
            {{ isLogin ? '회원가입하기' : '로그인하기' }}
          </el-button>
        </div>
      </template>

      <el-form 
        :model="formData" 
        :rules="rules"
        ref="formRef"
        label-position="top"
        @submit.prevent="handleSubmit"
      >
        <el-form-item label="이메일" prop="email">
          <el-input 
            v-model="formData.email" 
            placeholder="이메일을 입력하세요"
          />
        </el-form-item>

        <el-form-item label="비밀번호" prop="password">
          <el-input 
            v-model="formData.password" 
            type="password" 
            placeholder="비밀번호를 입력하세요"
            show-password
          />
        </el-form-item>

        <template v-if="!isLogin">
          <el-form-item label="비밀번호 확인" prop="confirmPassword">
            <el-input 
              v-model="formData.confirmPassword" 
              type="password" 
              placeholder="비밀번호를 다시 입력하세요"
              show-password
            />
          </el-form-item>

          <el-form-item label="닉네임" prop="nickname">
            <el-input 
              v-model="formData.nickname" 
              placeholder="닉네임을 입력하세요"
            />
          </el-form-item>
        </template>

        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="loading" block>
            {{ isLogin ? '로그인' : '회원가입' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useChatStore } from '../stores/chat'
import { useRouter } from 'vue-router'

export default {
  name: 'AuthView',
  setup() {
    const chatStore = useChatStore()
    const router = useRouter()
    const formRef = ref(null)
    const isLogin = ref(true)
    const loading = ref(false)

    const formData = reactive({
      email: '',
      password: '',
      confirmPassword: '',
      nickname: ''
    })

    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('비밀번호를 입력해주세요'))
      } else {
        if (formData.confirmPassword !== '') {
          formRef.value.validateField('confirmPassword')
        }
        callback()
      }
    }

    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('비밀번호를 다시 입력해주세요'))
      } else if (value !== formData.password) {
        callback(new Error('비밀번호가 일치하지 않습니다'))
      } else {
        callback()
      }
    }

    const rules = {
      email: [
        { required: true, message: '이메일을 입력해주세요', trigger: 'blur' },
        { type: 'email', message: '올바른 이메일 형식이 아닙니다', trigger: 'blur' }
      ],
      password: [
        { required: true, validator: validatePass, trigger: 'blur' },
        { min: 6, message: '비밀번호는 최소 6자 이상이어야 합니다', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, validator: validatePass2, trigger: 'blur' }
      ],
      nickname: [
        { required: true, message: '닉네임을 입력해주세요', trigger: 'blur' },
        { min: 2, message: '닉네임은 최소 2자 이상이어야 합니다', trigger: 'blur' }
      ]
    }

    const handleSubmit = async () => {
      if (!formRef.value) return

      try {
        await formRef.value.validate()
        loading.value = true

        if (isLogin.value) {
          // TODO: 실제 로그인 API 호출
          await new Promise(resolve => setTimeout(resolve, 1000)) // 임시 딜레이
          chatStore.setCurrentUser(formData.email)
          router.push('/')
        } else {
          // TODO: 실제 회원가입 API 호출
          await new Promise(resolve => setTimeout(resolve, 1000)) // 임시 딜레이
          isLogin.value = true
          formData.confirmPassword = ''
          formData.nickname = ''
        }
      } catch (error) {
        console.error('Validation failed:', error)
      } finally {
        loading.value = false
      }
    }

    const toggleAuthMode = () => {
      isLogin.value = !isLogin.value
      formRef.value?.resetFields()
    }

    return {
      formRef,
      formData,
      rules,
      isLogin,
      loading,
      handleSubmit,
      toggleAuthMode
    }
  }
}
</script>

<style scoped>
.auth-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--el-bg-color-page);
}

.auth-card {
  width: 100%;
  max-width: 400px;
  margin: 0 20px;
}

.auth-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.auth-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--el-text-color-primary);
}
</style> 