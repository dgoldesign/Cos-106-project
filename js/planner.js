/* ============================================================
   planner.js – Academic Planner task manager
   Tasks live in an array of objects: { id, title, due, done }
   They are drawn into the page with DOM manipulation and
   saved to localStorage so they survive a page refresh.
   ============================================================ */

/* ---------- Elements we need from the page ---------- */
var taskForm = document.getElementById('taskForm');
var taskInput = document.getElementById('taskInput');
var taskDate = document.getElementById('taskDate');
var taskError = document.getElementById('taskError');
var taskList = document.getElementById('taskList');
var emptyState = document.getElementById('emptyState');
var taskTabs = document.getElementById('taskTabs');

// Summary column elements
var progressText = document.getElementById('progressText');
var progressFill = document.getElementById('progressFill');
var progressPercent = document.getElementById('progressPercent');
var pendingCount = document.getElementById('pendingCount');
var completedCount = document.getElementById('completedCount');

/* ---------- State ---------- */
var tasks = [];           // the array of task objects
var currentFilter = 'all'; // which tab is active: all / pending / completed

/* The sample tasks used the very first time the page opens */
var sampleTasks = [
  { id: 1, title: 'Finish COS 106 term project', due: '2026-11-20', done: false },
  { id: 2, title: 'Revise for CA test',          due: '2026-11-22', done: false },
  { id: 3, title: 'Read chapter 4 notes',        due: '2026-11-25', done: false },
  { id: 4, title: 'Submit lab report',           due: '2026-11-10', done: true },
  { id: 5, title: 'Watch lecture recording',     due: '2026-11-12', done: true }
];

/* ---------- Saving and loading (localStorage) ---------- */

function saveTasks() {
  // try/catch in case the browser blocks storage (e.g. private mode)
  try {
    localStorage.setItem('plannerTasks', JSON.stringify(tasks));
  } catch (error) {
    console.warn('Could not save tasks:', error);
  }
}

function loadTasks() {
  try {
    var stored = localStorage.getItem('plannerTasks');
    if (stored === null) {
      // First visit: start with the sample tasks
      tasks = sampleTasks;
      saveTasks();
    } else {
      tasks = JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Could not load tasks:', error);
    tasks = sampleTasks;
  }
}

/* ---------- Helpers ---------- */

/* Turns "2026-11-20" into "20 Nov" for the meta line */
function formatDate(dateString) {
  if (!dateString) return '';
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var parts = dateString.split('-'); // [year, month, day]
  return parseInt(parts[2], 10) + ' ' + months[parseInt(parts[1], 10) - 1];
}

/* ---------- Core actions ---------- */

function addTask(title, due) {
  tasks.push({
    id: Date.now(),  // the current time makes an easy unique id
    title: title,
    due: due,
    done: false
  });
  saveTasks();
  renderTasks();
  updateSummary();
}

function toggleTask(id) {
  tasks.forEach(function (task) {
    if (task.id === id) {
      task.done = !task.done; // flip between pending and completed
    }
  });
  saveTasks();
  renderTasks();
  updateSummary();
}

function deleteTask(id) {
  // Keep every task except the one with this id
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  saveTasks();
  renderTasks();
  updateSummary();
}

/* ---------- Drawing the list (DOM manipulation) ---------- */

/* Builds one <li> task row with createElement/appendChild */
function buildTaskRow(task) {
  var row = document.createElement('li');
  row.className = 'task-row' + (task.done ? ' done' : '');

  // Checkbox: ticking it marks the task completed
  var checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-check';
  checkbox.checked = task.done;
  checkbox.addEventListener('change', function () {
    toggleTask(task.id);
  });

  // Title + meta line
  var info = document.createElement('div');
  info.className = 'task-info';

  var title = document.createElement('p');
  title.className = 'task-title';
  title.textContent = task.title;

  var meta = document.createElement('p');
  meta.className = 'task-meta';
  if (task.due) {
    meta.textContent = (task.done ? 'Done · due ' : 'Due ') + formatDate(task.due);
  } else {
    meta.textContent = task.done ? 'Done' : 'No due date';
  }

  info.appendChild(title);
  info.appendChild(meta);

  // Status pill
  var pill = document.createElement('span');
  pill.className = 'pill ' + (task.done ? 'pill-done' : 'pill-pending');
  pill.textContent = task.done ? 'Completed' : 'Pending';

  // Delete (trash) button
  var deleteBtn = document.createElement('button');
  deleteBtn.className = 'task-delete';
  deleteBtn.innerHTML = '&#128465;'; // trash can symbol
  deleteBtn.setAttribute('aria-label', 'Delete task');
  deleteBtn.addEventListener('click', function () {
    // Fade the row out, then remove the task
    row.classList.add('leaving');
    setTimeout(function () {
      deleteTask(task.id);
    }, 250);
  });

  row.appendChild(checkbox);
  row.appendChild(info);
  row.appendChild(pill);
  row.appendChild(deleteBtn);

  return row;
}

/* Clears the list and redraws it, respecting the active filter tab */
function renderTasks() {
  taskList.innerHTML = '';

  // Which tasks should be visible right now?
  var visible = tasks.filter(function (task) {
    if (currentFilter === 'pending') return !task.done;
    if (currentFilter === 'completed') return task.done;
    return true; // 'all'
  });

  visible.forEach(function (task) {
    var row = buildTaskRow(task);
    row.classList.add('entering');       // start invisible
    taskList.appendChild(row);
    // Next frame: remove the class so the row fades in
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        row.classList.remove('entering');
      });
    });
  });

  // Show the empty-state message when there is nothing to show
  if (visible.length === 0) {
    emptyState.classList.add('show');
  } else {
    emptyState.classList.remove('show');
  }
}

/* ---------- Live summary numbers ---------- */

function updateSummary() {
  var total = tasks.length;
  var done = tasks.filter(function (task) { return task.done; }).length;
  var pending = total - done;
  var percent = total === 0 ? 0 : Math.round((done / total) * 100);

  progressText.textContent = done + ' of ' + total + ' done';
  progressFill.style.width = percent + '%';
  progressPercent.textContent = percent + '% complete. Keep going!';
  pendingCount.textContent = pending;
  completedCount.textContent = done;
}

/* ---------- Event handling ---------- */

// Adding a task with the form
taskForm.addEventListener('submit', function (event) {
  event.preventDefault(); // stop the page from reloading

  var title = taskInput.value.trim();

  // Don't allow empty tasks
  if (title === '') {
    taskError.classList.add('show');
    return;
  }

  taskError.classList.remove('show');
  addTask(title, taskDate.value);

  // Clear the form for the next task
  taskInput.value = '';
  taskDate.value = '';
  taskInput.focus();
});

// Hide the error as soon as the user starts typing again
taskInput.addEventListener('input', function () {
  taskError.classList.remove('show');
});

// Filter tabs: All / Pending / Completed
taskTabs.addEventListener('click', function (event) {
  var tab = event.target.closest('.task-tab');
  if (!tab) return;

  taskTabs.querySelectorAll('.task-tab').forEach(function (t) {
    t.classList.remove('active');
  });
  tab.classList.add('active');

  currentFilter = tab.dataset.filter;
  renderTasks();
});

/* ---------- Start up ---------- */
loadTasks();
renderTasks();
updateSummary();
