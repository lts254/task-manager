<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>登录</h2>
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" style="width: 100%;">登录</el-button>
        </el-form-item>
      </el-form>
      <p>还没有账户？ <router-link to="/register">注册</router-link></p>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const form = reactive({ username: '', password: '' })
    
    const login = async () => {
      try {
        const res = await axios.post('http://localhost:3001/api/login', form)
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('userId', res.data.userId)
        localStorage.setItem('username', res.data.username)
        router.push('/tasks')
      } catch (e) {
        alert('登录失败：' + (e.response?.data?.error || '未知错误'))
      }
    }
    
    return { form, login }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-card {
  width: 400px;
  padding: 20px;
}
h2 {
  text-align: center;
  margin-bottom: 30px;
}
p {
  text-align: center;
}
</style>
