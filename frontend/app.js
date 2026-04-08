const API = 'https://todo-app-production-c006.up.railway.app/todos';

const input = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

// 页面加载时，从数据库获取所有待办
async function loadTodos() {
  const res = await fetch(API);
  const todos = await res.json();
  todoList.innerHTML = '';
  todos.forEach(todo => renderTodo(todo));
}

// 把一条待办渲染到页面上
function renderTodo(todo) {
  const li = document.createElement('li');
  if (todo.done) li.classList.add('done');

  li.innerHTML = `
    <span>${todo.text}</span>
    <button class="delete-btn" onclick="deleteTodo(${todo.id}, this)">删除</button>
  `;

  // 点击文字切换完成状态
  li.querySelector('span').onclick = () => toggleTodo(todo.id, li);

  todoList.appendChild(li);
}

// 添加待办
async function addTodo() {
  const text = input.value.trim();
  if (!text) return;

  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const todo = await res.json();
  renderTodo(todo);
  input.value = '';
  input.focus();
}

// 切换完成状态
async function toggleTodo(id, li) {
  const res = await fetch(`${API}/${id}`, { method: 'PUT' });
  const todo = await res.json();
  if (todo.done) {
    li.classList.add('done');
  } else {
    li.classList.remove('done');
  }
}

// 删除待办
async function deleteTodo(id, btn) {
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  btn.parentElement.remove();
}

// 事件绑定
addBtn.onclick = addTodo;
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

// 启动
loadTodos();
