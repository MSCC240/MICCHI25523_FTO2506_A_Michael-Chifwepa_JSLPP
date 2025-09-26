import { initialTasks } from "./initialData.js";
import { loadTasks } from "./api.js";

let tasks = [];
let currentTaskId = null; // track the task being edited

/**
 * Save tasks array to localStorage
 */
function saveTasksToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/**
 * Load tasks from localStorage or fallback to initial tasks
 */
function loadTasksFromLocalStorage() {
  const saved = localStorage.getItem("tasks");
  return saved ? JSON.parse(saved) : initialTasks;
}

/**
 * Create task DOM element
 */
function createTaskElement(task) {
  const taskDiv = document.createElement("div");
  taskDiv.className = "task-div";
  taskDiv.textContent = task.title;
  taskDiv.dataset.taskId = task.id;

  taskDiv.addEventListener("click", () => {
    openTaskModal(task);
  });

  return taskDiv;
}

/**
 * Get container by status
 */
function getTaskContainerByStatus(status) {
  const column = document.querySelector(`.column-div[data-status="${status}"]`);
  return column ? column.querySelector(".tasks-container") : null;
}

/**
 * Clear all tasks in DOM
 */
function clearExistingTasks() {
  document
    .querySelectorAll(".tasks-container")
    .forEach((c) => (c.innerHTML = ""));
}

/**
 * Render tasks to DOM
 */
function renderTasks(tasks) {
  clearExistingTasks();
  tasks.forEach((task) => {
    const container = getTaskContainerByStatus(task.status);
    if (container) container.appendChild(createTaskElement(task));
  });
}

/**
 * Open modal in "view/edit task" mode
 */
function openTaskModal(task) {
  const modal = document.getElementById("task-modal");
  const titleInput = document.getElementById("task-title");
  const descInput = document.getElementById("task-desc");
  const statusSelect = document.getElementById("task-status");
  const modalTitle = document.getElementById("modal-title");
  const createBtn = document.getElementById("create-task-btn");
  const saveBtn = document.getElementById("save-changes-btn");
  const deleteBtn = document.getElementById("delete-task-btn");

  // Fill values
  titleInput.value = task.title;
  descInput.value = task.description;
  statusSelect.value = task.status;

  // Switch buttons
  modalTitle.textContent = "View Task";
  createBtn.style.display = "none";
  saveBtn.style.display = "inline-block";
  deleteBtn.style.display = "inline-block";

  currentTaskId = task.id;

  modal.showModal();
}

/**
 * Setup modal close
 */
function setupModalCloseHandler() {
  const modal = document.getElementById("task-modal");
  const closeBtn = document.getElementById("close-modal-btn");
  closeBtn.addEventListener("click", () => {
    modal.close();
  });
}

/**
 * Setup Add Task logic
 */
function setupAddTaskHandler() {
  const addTaskBtn = document.getElementById("add-task-btn");
  const modal = document.getElementById("task-modal");
  const form = document.getElementById("task-form");
  const modalTitle = document.getElementById("modal-title");
  const createBtn = document.getElementById("create-task-btn");
  const saveBtn = document.getElementById("save-changes-btn");
  const deleteBtn = document.getElementById("delete-task-btn");

  // Open in add mode
  addTaskBtn.addEventListener("click", () => {
    form.reset();
    modalTitle.textContent = "Add New Task";
    createBtn.style.display = "block";
    saveBtn.style.display = "none";
    deleteBtn.style.display = "none";
    currentTaskId = null;
    modal.showModal();
  });

  // Handle create new task
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("task-title").value.trim();
    const description = document.getElementById("task-desc").value.trim();
    const status = document.getElementById("task-status").value;

    if (!title) return;

    const newTask = {
      id: Date.now(),
      title,
      description,
      status,
    };

    tasks.push(newTask);
    saveTasksToLocalStorage(tasks);
    renderTasks(tasks);
    modal.close();
  });
}

/**
 * Setup Save & Delete logic
 */
function setupEditDeleteHandlers() {
  const modal = document.getElementById("task-modal");
  const saveBtn = document.getElementById("save-changes-btn");
  const deleteBtn = document.getElementById("delete-task-btn");

  saveBtn.addEventListener("click", () => {
    if (currentTaskId == null) return;

    const title = document.getElementById("task-title").value.trim();
    const description = document.getElementById("task-desc").value.trim();
    const status = document.getElementById("task-status").value;

    tasks = tasks.map((t) =>
      t.id === currentTaskId ? { ...t, title, description, status } : t
    );

    saveTasksToLocalStorage(tasks);
    renderTasks(tasks);
    modal.close();
  });

  deleteBtn.addEventListener("click", () => {
    if (currentTaskId == null) return;
    if (confirm("Are you sure you want to delete this task?")) {
      tasks = tasks.filter((t) => t.id !== currentTaskId);
      saveTasksToLocalStorage(tasks);
      renderTasks(tasks);
      modal.close();
    }
  });
}

/**
 * Init app
 */
function initTaskBoard() {
  tasks = loadTasksFromLocalStorage();
  renderTasks(tasks);
  setupModalCloseHandler();
  setupAddTaskHandler();
  setupEditDeleteHandlers();

  // Try loading tasks from API too
  loadTasks().then((fetchedTasks) => {
    if (fetchedTasks && fetchedTasks.length > 0) {
      tasks = fetchedTasks;
      saveTasksToLocalStorage(tasks);
      renderTasks(tasks);
    }
  });
}

document.addEventListener("DOMContentLoaded", initTaskBoard);

// Sidebar toggle
const sidebar = document.getElementById("sidebar");
const hideSidebarBtn = document.getElementById("hideSidebar");
const showSidebarBtn = document.getElementById("showSidebar");

hideSidebarBtn.addEventListener("click", () => {
  sidebar.style.display = "none";
  showSidebarBtn.classList.remove("hidden");
});

showSidebarBtn.addEventListener("click", () => {
  sidebar.style.display = "flex";
  showSidebarBtn.classList.add("hidden");
});

// Dark mode toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", themeToggle.checked);
  
  

});
// Dark mode toggle
const logo = document.getElementById("logo");

themeToggle.addEventListener("change", () => {
  const isDark = themeToggle.checked;
  document.body.classList.toggle("dark", isDark);

  // Swap logo based on theme
  logo.src = isDark ? "./assets/logo-dark.svg" : "./assets/logo-light.svg";
});


// Mobile logo opens/closes sidebar
const mobileLogo = document.querySelector(".logo-mobile");

mobileLogo.addEventListener("click", () => {
  sidebar.classList.toggle("show-sidebar"); // add/remove .show-sidebar
});


