const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

// 创建应用和数据库
const app = express();
const db = new Database('todos.db');

// 中间件
app.use(cors());
app.use(express.json());

// 初始化数据库表
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    done INTEGER DEFAULT 0
  )
`);

// ===== API 接口 =====

// 获取所有待办事项
app.get('/todos', (req, res) => {
  const todos = db.prepare('SELECT * FROM todos').all();
  res.json(todos);
});

// 添加待办事项
app.post('/todos', (req, res) => {
  const { text } = req.body;
  const result = db.prepare('INSERT INTO todos (text) VALUES (?)').run(text);
  res.json({ id: result.lastInsertRowid, text, done: 0 });
});

// 切换完成状态
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  const newDone = todo.done === 0 ? 1 : 0;
  db.prepare('UPDATE todos SET done = ? WHERE id = ?').run(newDone, id);
  res.json({ ...todo, done: newDone });
});

// 删除待办事项
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  res.json({ success: true });
});

// 启动服务器
app.listen(3000, () => {
  console.log('服务器启动成功！访问 http://localhost:3000');
});