



async function loadTasks() {
  const taskLists = {
    todo: document.querySelector("#todo .tasks-container"),
    doing: document.querySelector("#doing .tasks-container"),
    done: document.querySelector("#done .tasks-container")
  };

  try {
    // Show loading message
    Object.values(taskLists).forEach(list => {
      list.innerHTML = "<p>Loading...</p>";
    });

    // Fetch tasks from API
    const response = await fetch("https://jsl-kanban-api.vercel.app/");
    if (!response.ok) throw new Error("Failed to fetch tasks");

    const tasks = await response.json();

    // Save tasks to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Render tasks
    renderTasks(tasks, taskLists);
  } catch (error) {
    console.error("Error:", error);
    Object.values(taskLists).forEach(list => {
      list.innerHTML = "<p style='color:red;'>Error loading tasks</p>";
    });
  }
}

function renderTasks(tasks, taskLists) {
  // Clear old content
  Object.values(taskLists).forEach(list => list.innerHTML = "");

  tasks.forEach(task => {
    const card = document.createElement("div");
    card.classList.add("task");
    card.innerHTML = `
      <h4>${task.title}</h4>
      <p>${task.description}</p>
    `;
    taskLists[task.status].appendChild(card);
  });
}

// Load tasks on page start
document.addEventListener("DOMContentLoaded", () => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    renderTasks(JSON.parse(savedTasks), {
      todo: document.querySelector("#todo .tasks-container"),
      doing: document.querySelector("#doing .tasks-container"),
      done: document.querySelector("#done .tasks-container")
    });
  }
  loadTasks(); // Fetch latest tasks from API
});
 export { loadTasks, renderTasks };
