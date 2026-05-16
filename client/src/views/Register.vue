<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2>注册</h2>
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="form.confirmPassword" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register" style="width: 100%;">注册</el-button>
        </el-form-item>
      </el-form>
      <p>已有账户？ <router-link to="/login">登录</router-link></p>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const form = reactive({ username: '', password: '', confirmPassword: '' })
    
    const register = async () => {
      if (form.password !== form.confirmPassword) {
        alert('两次密码不一致！')
        return
      }
      try {
        await axios.post('http://localhost:3001/api/register', {
          username: form.username,
          password: form.password
        })
        alert('注册成功！')
        router.push('/login')
      } catch (e) {
        alert('注册失败：' + (e.response?.data?.error || '未知错误'))
      }
    }
    
    return { form, register }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.register-card {
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
