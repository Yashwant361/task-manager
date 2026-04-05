const API = "/api/tasks";

let allTasks = [];
let currentFilter = "all";
let deleteTargetId = null;
const taskForm     = document.getElementById("taskForm");
const titleInput   = document.getElementById("titleInput");
const descInput    = document.getElementById("descInput");
const priorityInput= document.getElementById("priorityInput");
const categoryInput= document.getElementById("categoryInput");
const dueDateInput = document.getElementById("dueDateInput");
const editIdInput  = document.getElementById("editId");
const submitBtn    = document.getElementById("submitBtn");
const cancelBtn    = document.getElementById("cancelBtn");
const formLabel    = document.getElementById("formLabel");
const taskList     = document.getElementById("taskList");
const emptyState   = document.getElementById("emptyState");
const searchInput  = document.getElementById("searchInput");
const totalCount   = document.getElementById("totalCount");
const doneCount    = document.getElementById("doneCount");
const pendingCount = document.getElementById("pendingCount");
const modalOverlay = document.getElementById("modalOverlay");
const confirmDelete= document.getElementById("confirmDelete");
const cancelDelete = document.getElementById("cancelDelete");
const toast        = document.getElementById("toast");

async function fetchTasks() {
  try {
    const res = await fetch(API);
    allTasks = await res.json();
    renderTasks();
    updateStats();
  } catch (err) {
    showToast("Could not load tasks", "error");
  }
}

async function createTask(data) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

// Update an existing task
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

// Toggle complete/incomplete
async function toggleTask(id) {
  if (!res.ok) throw new Error("Failed to toggle task");
  return res.json();
}

// Delete a task
async function deleteTask(id) {
  if (!res.ok) throw new Error("Failed to delete task");
}

// ==========================================
// FORM SUBMIT — Add or Edit
// ==========================================
  const data = {
    title:       titleInput.value.trim(),
    description: descInput.value.trim(),
    priority:    priorityInput.value,
    category:    categoryInput.value.trim() || "General",
    dueDate:     dueDateInput.value || null,
  };

  if (!data.title) return showToast("Title is required!", "error");

  try {
    const id = editIdInput.value;

    if (id) {
      // EDIT MODE
      const updated = await updateTask(id, data);
      allTasks = allTasks.map(t => t._id === id ? updated : t);
      showToast("Task updated!", "success");
      resetForm();
    } else {
      const updated = await updateTask(id, data);
      allTasks = allTasks.map(t => t._id === id ? updated : t);
      showToast("Task updated!", "success");
      resetForm();
    } else {
    renderTasks();
    updateStats();
  } catch (err) {
    showToast(err.message, "error");
  }
});

// ==========================================
// EDIT — Fill form with task data
// ==========================================

function startEdit(task) {
  editIdInput.value   = task._id;
  titleInput.value    = task.title;
  descInput.value     = task.description || "";
  formLabel.textContent = "EDIT TASK";
  submitBtn.textContent = "UPDATE TASK";
  cancelBtn.style.display = "inline-flex";

  // Scroll to form on mobile
  document.querySelector(".panel-left").scrollIntoView({ behavior: "smooth" });
  titleInput.focus();
}

cancelBtn.addEventListener("click", resetForm);

function resetForm() {
  taskForm.reset();
  editIdInput.value = "";
  formLabel.textContent = "NEW TASK";
  cancelBtn.style.display = "none";
}

// ==========================================
// TOGGLE COMPLETE
// ==========================================

async function handleToggle(id) {
  try {
    const updated = await toggleTask(id);
    allTasks = allTasks.map(t => t._id === id ? updated : t);
    renderTasks();
    updateStats();
    showToast(updated.completed ? "✓ Marked complete" : "Marked as pending", "info");
  } catch (err) {
// ==========================================
// DELETE — with confirmation modal
// ==========================================

function openDeleteModal(id) {
  deleteTargetId = id;
  modalOverlay.classList.add("active");
}

confirmDelete.addEventListener("click", async () => {
  try {
    await deleteTask(deleteTargetId);
    allTasks = allTasks.filter(t => t._id !== deleteTargetId);
    renderTasks();
    updateStats();
    closeModal();
  }
});

cancelDelete.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

function closeModal() {
  modalOverlay.classList.remove("active");
  deleteTargetId = null;
}

// ==========================================
// FILTER
// ==========================================

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener("input", renderTasks);

function renderTasks() {
  const searchTerm = searchInput.value.toLowerCase();

  // Apply filter
  let tasks = allTasks.filter(task => {
    if (currentFilter === "all")       return true;
    if (currentFilter === "pending")   return !task.completed;
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "high")      return task.priority === "high";
searchInput.addEventListener("input", renderTasks);hTerm) ||
      (task.description && task.description.toLowerCase().includes(searchTerm)) ||
      (task.category && task.category.toLowerCase().includes(searchTerm))
    );
  }

  // Clear list
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">◎</div>
  let tasks = allTasks.filter(task => {
    if (currentFilter === "all")       return true;
    if (currentFilter === "pending")   return !task.completed;
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "high")      return task.priority === "high";
    if (currentFilter === "medium")    return task.priority === "medium";
    if (currentFilter === "low")       return task.priority === "low";
    return true;
  });

  if (searchTerm) {
    tasks = tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm) ||
      (task.description && task.description.toLowerCase().includes(searchTerm)) ||
      (task.category && task.category.toLowerCase().includes(searchTerm))
    );
  }

  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">◎</div>
        <p>${searchTerm ? "No tasks match your search." : "No tasks here."}</p>
      </div>`;
    return;
  }
ion ? `<div class="task-desc">${escapeHtml(task.description)}</div>` : ""}
      <div class="task-meta">
        <span class="badge badge-category">${escapeHtml(task.category || "General")}</span>
        <span class="badge badge-${task.priority}">${task.priority.toUpperCase()}</span>
        ${dueBadge}
      </div>
    </div>
    <div class="task-actions">
      <button class="icon-btn" title="Edit" onclick='startEdit(${JSON.stringify(task)})'>✎</button>
      <button class="icon-btn del" title="Delete" onclick="openDeleteModal('${task._id}')">✕</button>
    </div>
  `;

  return card;
}

//nction escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ==========================================
// STATS
// ==========================================

function updateStats() {
  totalCount.textContent   = allTasks.length;
  doneCount.textContent    = allTasks.filter(t => t.completed).length;
  pendingCount.textContent = allTasks.filter(t => !t.completed).length;
}

// ==========================================
// TOAST NOTIFICATION
// ==========================================

let toastTimer;
function showToast(message, type = "info") {
  toast.textContent = message;
  toast.className = `toast ${type} show`;

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);

// ==========================================
// THEME TOGGLE — Dark / Light Mode
// ==========================================

const themeToggle = document.getElementById("themeToggle");
const themeIcon   = document.getElementById("themeIcon");
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const isLight = document.body.classList.contains("light");
  applyTheme(isLight ? "dark" : "light");
});
    themeIcon.textContent  = "☾";
    themeLabel.textContent = "DARK";
  } else {
    document.body.classList.remove("light");
    themeIcon.textContent  = "☀";
    themeLabel.textContent = "LIGHT";
  }
  localStorage.setItem("taskr-theme", theme);
}

// ==========================================
// INIT — Load tasks on page load
// ==========================================

fetchTasks();
const themeToggle = document.getElementById("themeToggle");
const themeIcon   = document.getElementById("themeIcon");
const themeLabel  = document.getElementById("themeLabel");
