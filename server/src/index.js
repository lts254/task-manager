const express = require('express');
const cors = require('cors');
const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secret-key-keep-it-safe';

app.use(cors());
app.use(express.json());

let db;

const initDatabase = async () => {
  const SQL = await initSqlJs({
    locateFile: file => path.join(__dirname, '../node_modules/sql.js/dist', file)
  });
  
  const dbPath = path.join(__dirname, '../task-manager.db');
  let data = [];
  if (fs.existsSync(dbPath)) {
    data = fs.readFileSync(dbPath);
  }
  
  db = new SQL.Database(data);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'todo',
      due_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  return db;
};

const saveDatabase = () => {
  const data = db.export();
  const dbPath = path.join(__dirname, '../task-manager.db');
  fs.writeFileSync(dbPath, Buffer.from(data));
};

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  try {
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    saveDatabase();
    
    const result = db.exec('SELECT last_insert_rowid() AS id');
    const userId = result[0].values[0][0];
    res.json({ success: true, userId });
  } catch (e) {
    res.status(400).json({ success: false, error: 'Username already exists' });
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const result = db.exec('SELECT * FROM users WHERE username = ?', [username]);
  
  if (result.length === 0) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
  
  const user = {
    id: result[0].values[0][0],
    username: result[0].values[0][1],
    password: result[0].values[0][2]
  };
  
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, token, userId: user.id, username: user.username });
});

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

app.get('/api/tasks', authMiddleware, (req, res) => {
  const { status, search } = req.query;
  let sql = 'SELECT * FROM tasks WHERE user_id = ?';
  const params = [req.userId];
  
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  
  if (search) {
    sql += ' AND (title LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  
  sql += ' ORDER BY created_at DESC';
  
  const result = db.exec(sql, params);
  const tasks = result.length > 0 ? result[0].values.map(row => ({
    id: row[0],
    user_id: row[1],
    title: row[2],
    description: row[3],
    priority: row[4],
    status: row[5],
    due_date: row[6],
    created_at: row[7]
  })) : [];
  
  res.json(tasks);
});

app.post('/api/tasks', authMiddleware, (req, res) => {
  const { title, description, priority, due_date } = req.body;
  db.run(
    'INSERT INTO tasks (user_id, title, description, priority, due_date) VALUES (?, ?, ?, ?, ?)',
    [req.userId, title, description, priority || 'medium', due_date]
  );
  saveDatabase();
  
  const result = db.exec('SELECT last_insert_rowid() AS id');
  const taskId = result[0].values[0][0];
  
  const taskResult = db.exec('SELECT * FROM tasks WHERE id = ?', [taskId]);
  if (taskResult.length > 0) {
    const row = taskResult[0].values[0];
    res.json({
      id: row[0],
      user_id: row[1],
      title: row[2],
      description: row[3],
      priority: row[4],
      status: row[5],
      due_date: row[6],
      created_at: row[7]
    });
  } else {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.put('/api/tasks/:id', authMiddleware, (req, res) => {
  const { title, description, priority, status, due_date } = req.body;
  db.run(
    'UPDATE tasks SET title = ?, description = ?, priority = ?, status = ?, due_date = ? WHERE id = ? AND user_id = ?',
    [title, description, priority, status, due_date, req.params.id, req.userId]
  );
  saveDatabase();
  
  const taskResult = db.exec('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
  if (taskResult.length > 0) {
    const row = taskResult[0].values[0];
    res.json({
      id: row[0],
      user_id: row[1],
      title: row[2],
      description: row[3],
      priority: row[4],
      status: row[5],
      due_date: row[6],
      created_at: row[7]
    });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.delete('/api/tasks/:id', authMiddleware, (req, res) => {
  db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
  saveDatabase();
  res.json({ success: true });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

async function startServer() {
  try {
    await initDatabase();
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
    
    process.on('SIGINT', () => {
      server.close(() => {
        process.exit(0);
      });
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
