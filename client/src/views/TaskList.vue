<template>
  <div class="task-container">
    <el-header class="header">
      <h1>任务管理系统</h1>
      <div class="user-info">
        <span>欢迎，{{ username }}</span>
        <el-button @click="logout" type="danger" size="small">退出</el-button>
      </div>
    </el-header>

    <el-main>
      <el-card class="toolbar">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="searchText" placeholder="搜索任务..." clearable @input="handleSearch" />
          </el-col>
          <el-col :span="4">
            <el-select v-model="statusFilter" placeholder="状态筛选" clearable @change="handleFilterChange">
              <el-option label="待办" value="todo" />
              <el-option label="进行中" value="in_progress" />
              <el-option label="已完成" value="done" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="loadTasks">刷新</el-button>
          </el-col>
          <el-col :span="8">
            <el-button type="success" @click="openAddDialog" style="float: right;">
              新建任务
            </el-button>
          </el-col>
        </el-row>
      </el-card>

      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header><div class="card-header"><span>待办</span><el-tag type="info">{{ todoTasks.length }}</el-tag></div></template>
            <draggable :list="todoTasks" item-key="id" group="tasks" @change="handleDragChange($event, 'todo')">
              <template #item="{ element }">
                <el-card class="task-card" style="margin-bottom: 10px; cursor: move;" @click="editTask(element)">
                  <div class="task-title">{{ element.title }}</div>
                  <div class="task-meta">
                    <el-tag :type="getPriorityType(element.priority)" size="small">{{ getPriorityText(element.priority) }}</el-tag>
                    <span v-if="element.due_date" class="due-date">{{ element.due_date }}</span>
                  </div>
                  <div v-if="element.description" class="task-desc">{{ element.description }}</div>
                </el-card>
              </template>
            </draggable>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card shadow="hover">
            <template #header><div class="card-header"><span>进行中</span><el-tag type="warning">{{ inProgressTasks.length }}</el-tag></div></template>
            <draggable :list="inProgressTasks" item-key="id" group="tasks" @change="handleDragChange($event, 'in_progress')">
              <template #item="{ element }">
                <el-card class="task-card" style="margin-bottom: 10px; cursor: move;" @click="editTask(element)">
                  <div class="task-title">{{ element.title }}</div>
                  <div class="task-meta">
                    <el-tag :type="getPriorityType(element.priority)" size="small">{{ getPriorityText(element.priority) }}</el-tag>
                    <span v-if="element.due_date" class="due-date">{{ element.due_date }}</span>
                  </div>
                  <div v-if="element.description" class="task-desc">{{ element.description }}</div>
                </el-card>
              </template>
            </draggable>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card shadow="hover">
            <template #header><div class="card-header"><span>已完成</span><el-tag type="success">{{ doneTasks.length }}</el-tag></div></template>
            <draggable :list="doneTasks" item-key="id" group="tasks" @change="handleDragChange($event, 'done')">
              <template #item="{ element }">
                <el-card class="task-card done" style="margin-bottom: 10px; cursor: move;" @click="editTask(element)">
                  <div class="task-title">{{ element.title }}</div>
                  <div class="task-meta">
                    <el-tag :type="getPriorityType(element.priority)" size="small">{{ getPriorityText(element.priority) }}</el-tag>
                    <span v-if="element.due_date" class="due-date">{{ element.due_date }}</span>
                  </div>
                  <div v-if="element.description" class="task-desc">{{ element.description }}</div>
                </el-card>
              </template>
            </draggable>
          </el-card>
        </el-col>
      </el-row>
    </el-main>

    <el-dialog v-model="showAddDialog" :title="isEdit ? '编辑任务' : '新建任务'" width="500px">
      <el-form :model="currentTask" label-width="80px">
        <el-form-item label="标题"><el-input v-model="currentTask.title" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="currentTask.description" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="currentTask.priority">
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止日期">
          <el-date-picker v-model="currentTask.due_date" type="date" value-format="YYYY-MM-DD" style="width: 100%;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" @click="saveTask">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import { ref, computed, onMounted, watch } from 'vue'

export default {
  name: 'TaskList',
  components: { draggable },
  setup() {
    const router = useRouter()
    const tasks = ref([])
    const searchText = ref('')
    const statusFilter = ref('')
    const showAddDialog = ref(false)
    const isEdit = ref(false)
    const username = localStorage.getItem('username')
    const token = localStorage.getItem('token')

    const currentTask = ref({
      title: '',
      description: '',
      priority: 'medium',
      due_date: ''
    })

    const api = axios.create({
      baseURL: 'http://localhost:3001/api',
      headers: { Authorization: `Bearer ${token}` }
    })

    const todoTasks = ref([])
    const inProgressTasks = ref([])
    const doneTasks = ref([])

    const loadTasks = async () => {
      try {
        const params = {}
        if (statusFilter.value) params.status = statusFilter.value
        if (searchText.value) params.search = searchText.value
        const res = await api.get('/tasks', { params })
        tasks.value = res.data
        updateGroupedTasks()
      } catch (e) {
        console.error('加载任务失败:', e)
      }
    }

    const updateGroupedTasks = () => {
      todoTasks.value = tasks.value.filter(t => t.status === 'todo')
      inProgressTasks.value = tasks.value.filter(t => t.status === 'in_progress')
      doneTasks.value = tasks.value.filter(t => t.status === 'done')
    }

    const handleSearch = () => {
      loadTasks()
    }

    const handleFilterChange = () => {
      loadTasks()
    }

    const handleDragChange = async (evt, newStatus) => {
      if (evt.added) {
        const task = evt.added.element
        try {
          await api.put(`/tasks/${task.id}`, { ...task, status: newStatus })
          task.status = newStatus
        } catch (e) {
          console.error('更新状态失败:', e)
          loadTasks()
        }
      }
    }

    const openAddDialog = () => {
      isEdit.value = false
      currentTask.value = {
        title: '',
        description: '',
        priority: 'medium',
        due_date: ''
      }
      showAddDialog.value = true
    }

    const editTask = (task) => {
      isEdit.value = true
      currentTask.value = { ...task }
      showAddDialog.value = true
    }

    const saveTask = async () => {
      if (!currentTask.value.title) {
        alert('请输入标题')
        return
      }
      try {
        if (isEdit.value) {
          await api.put(`/tasks/${currentTask.value.id}`, currentTask.value)
        } else {
          await api.post('/tasks', { ...currentTask.value, status: 'todo' })
        }
        showAddDialog.value = false
        loadTasks()
      } catch (e) {
        alert('保存失败')
        console.error(e)
      }
    }

    const cancelDialog = () => {
      showAddDialog.value = false
    }

    const getPriorityType = (p) => ({ low: 'info', medium: 'warning', high: 'danger' }[p] || 'info')
    const getPriorityText = (p) => ({ low: '低', medium: '中', high: '高' }[p] || '中')

    const logout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('username')
      router.push('/login')
    }

    onMounted(loadTasks)

    return {
      tasks,
      searchText,
      statusFilter,
      showAddDialog,
      currentTask,
      isEdit,
      username,
      todoTasks,
      inProgressTasks,
      doneTasks,
      getPriorityType,
      getPriorityText,
      editTask,
      saveTask,
      cancelDialog,
      openAddDialog,
      loadTasks,
      handleSearch,
      handleFilterChange,
      handleDragChange,
      logout
    }
  }
}
</script>

<style scoped>
.task-container {
  min-height: 100vh;
  background: #f0f2f5;
}
.header {
  background: #409eff;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.header h1 {
  margin: 0;
  font-size: 24px;
}
.user-info {
  display: flex;
  gap: 15px;
  align-items: center;
}
.toolbar {
  margin-bottom: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.task-card {
  transition: all 0.3s;
}
.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.task-card.done {
  opacity: 0.7;
}
.task-title {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 8px;
}
.task-meta {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
}
.due-date {
  font-size: 12px;
  color: #909399;
}
.task-desc {
  font-size: 14px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>