import "./style.css";
import $ from "jquery";

// ===== DARK BUTTON ===== //

// === 1. Séléction des éléments === //
const darkButton = document.querySelector("#dark-button");
const darkButtonTitle = document.querySelector("#dark-button-title");
const darkButtonIcon = document.querySelector("ion-icon");

// === 2. Sauvegarde de thèmes === //
const savedTheme = localStorage.getItem("theme");

// ==== 3. Fonction de la mise à jour du bouton ==== //
function updateThemeButton() {
  const isDark = document.documentElement.classList.contains("dark");
  darkButtonTitle.textContent = isDark ? "Mode claire" : "Mode sombre";
  darkButtonIcon.name = isDark ? "sunny-outline" : "moon-outline";
}

// ==== 4. Vérifier le thème ==== //
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
}
updateThemeButton();

// ==== 5. Le click ==== //
darkButton.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  updateThemeButton();
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// ===== SCRIPT TO DO LIST ===== //

// ===== ADD BUTTON et CREATION DES TACHES ===== //

// === 1. Séléction des éléments === //
const addButton = document.querySelector("#add-btn");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const addButtonPopup = document.querySelector("#add-btn-popup");
const addCardPopup = document.querySelector("#add-popup-card");
const tasksContainer = document.querySelector("#tasks-container");

addButton.addEventListener("click", (event) => {
  event.preventDefault();

  addCardPopup.classList.replace("-z-20", "z-20");
  addCardPopup.classList.replace("opacity-0", "opacity-100");
});

function createTask(taskText) {
  const liTask = document.createElement("li");
  liTask.classList.add("list-style", "list-border");
  taskList.appendChild(liTask);

  const divTaskTitle = document.createElement("div");
  divTaskTitle.classList.add("div-task-title");
  liTask.appendChild(divTaskTitle);

  const ionIcon = document.createElement("ion-icon");
  ionIcon.name = "radio-button-off-outline";
  ionIcon.classList.add("done-task", "text-lg", "cursor-pointer");
  divTaskTitle.appendChild(ionIcon);

  ionIcon.addEventListener("click", (ionEvent) => {
    ionEvent.stopPropagation();
    editButton.desabled = ionIcon.click;

    ionIcon.classList.toggle("text-task-done");
    taskTitle.classList.toggle("line-through");
    taskTitle.classList.toggle("text-text-second/70");
    taskTitle.classList.toggle("dark:text-dark-text-second/80");
    if (ionIcon.classList.contains("text-task-done")) {
      ionIcon.name = "checkmark-done-circle";
      editButton.disabled = true;
      editButton.classList.add("disabled:bg-principal/50");
      editButton.classList.replace("edit-button", "edit-button-disabled");
    } else {
      ionIcon.name = "radio-button-off-outline";
      editButton.disabled = false;
      editButton.classList.remove("disabled:bg-principal/50");
      editButton.classList.replace("edit-button-disabled", "edit-button");
    }
  });

  const taskTitle = document.createElement("span");
  taskTitle.textContent = taskText;
  divTaskTitle.appendChild(taskTitle);

  const divButtons = document.createElement("div");
  divButtons.classList.add("div-buttons");
  liTask.appendChild(divButtons);

  const editButton = document.createElement("button");
  editButton.classList.add("edit-button");
  editButton.innerHTML = '<ion-icon name="create-outline"></ion-icon>';
  divButtons.appendChild(editButton);

  const supButton = document.createElement("button");
  supButton.classList.add("sup-button");
  supButton.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';
  divButtons.appendChild(supButton);

  taskInput.value = "";

  $(supButton).on("click", () => {
    let taskStorages = JSON.parse(localStorage.getItem("taskStorages")) || [];
    console.log(`Avant: ${taskStorages}`);
    console.log(`Tâche à supprimer: ${taskText}`);
    taskStorages = taskStorages.filter((supTask) => {
      return supTask !== taskText;
    });

    console.log(`Après : ${taskStorages}`);

    localStorage.setItem("taskStorages", JSON.stringify(taskStorages));
    liTask.remove();
  });
}

addButtonPopup.addEventListener("click", (event) => {
  event.preventDefault();

  addCardPopup.classList.replace("z-20", "-z-20");
  addCardPopup.classList.replace("opacity-100", "opacity-0");

  if (taskInput.value === "" || taskInput.value === null) {
    return;
  }

  let taskText = taskInput.value.trim();

  let taskStorages = JSON.parse(localStorage.getItem("taskStorages")) || [];
  taskStorages.push(taskText);

  localStorage.setItem("taskStorages", JSON.stringify(taskStorages));

  createTask(taskText);
});

let taskStorages = JSON.parse(localStorage.getItem("taskStorages")) || [];

taskStorages.forEach((taskStorage) => {
  createTask(taskStorage);
});

const doneTaskButton = document.querySelector(".done-task");
const taskTitl = document.querySelector("#task-title");

$(doneTaskButton).on("click", () => {
  doneTaskButton.classList.toggle("text-task-done");
  const isDone = doneTaskButton.classList.contains("text-task-done");
  doneTaskButton.name = isDone
    ? "checkmark-done-circle"
    : "radio-button-off-outline";
  taskTitl.classList.toggle("line-through");
});
