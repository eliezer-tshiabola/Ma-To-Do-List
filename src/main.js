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

// === 2. Click pour l'affichage du popup ADD === //
addButton.addEventListener("click", (event) => {
  event.preventDefault();

  addCardPopup.classList.replace("-z-20", "z-20");
  addCardPopup.classList.replace("opacity-0", "opacity-100");
});

function savedTask() {
  localStorage.setItem("taskStorages", JSON.stringify(taskStorages));
}

function loadTask() {
  return JSON.parse(localStorage.getItem("taskStorages")) || [];
}

//
function createTask(newTask) {
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
    ionEvent.stopPropagation(); // Empêche le clic sur l'icône de déclencher aussi les événements du parent.
    editButton.desabled = ionIcon.click; // Conserve ici l'affectation existante sans changer le reste du comportement.

    const taskDoneIndex = taskStorages.findIndex(
      (taskDone) => taskDone.id === newTask.id, // Repère la tâche correspondante dans les données en mémoire.
    );
    if (taskDoneIndex === -1) return; // Arrête le traitement si cette tâche n'existe plus dans la liste.

    taskStorages[taskDoneIndex].completed =
      !taskStorages[taskDoneIndex].completed; // Inverse l'état terminé de la tâche.
    savedTask(); // Enregistre immédiatement la liste mise à jour dans le localStorage.
    updateTaskVisualState(taskStorages[taskDoneIndex].completed); // Met à jour l'affichage selon le nouvel état.
  });

  const taskTitle = document.createElement("span");
  taskTitle.textContent = newTask.text;
  divTaskTitle.appendChild(taskTitle);

  const divButtons = document.createElement("div");
  divButtons.classList.add("div-buttons");
  liTask.appendChild(divButtons);

  // === Bouton de modification === //

  const editButton = document.createElement("button");
  editButton.classList.add("edit-button");
  editButton.innerHTML = '<ion-icon name="create-outline"></ion-icon>';
  divButtons.appendChild(editButton);

  function updateTaskVisualState(isCompleted) {
    ionIcon.name = isCompleted
      ? "checkmark-done-circle"
      : "radio-button-off-outline"; // Choisit l'icône de l'état.
    editButton.disabled = isCompleted; // Désactive la modification si la tâche est terminée.
    editButton.classList.toggle("disabled:bg-principal/50", isCompleted); // Synchronise le style désactivé.
    editButton.classList.toggle("edit-button", !isCompleted); // Restaure la classe du bouton actif si nécessaire.
    editButton.classList.toggle("edit-button-disabled", isCompleted); // Applique la classe du bouton désactivé.
    ionIcon.classList.toggle("text-task-done", isCompleted); // Synchronise la couleur de l'icône.
    taskTitle.classList.toggle("line-through", isCompleted); // Barre le titre lorsque la tâche est terminée.
    taskTitle.classList.toggle("text-text-second/70", isCompleted); // Synchronise la couleur en thème clair.
    taskTitle.classList.toggle("dark:text-dark-text-second/80", isCompleted); // Synchronise la couleur en thème sombre.
  }

  updateTaskVisualState(newTask.completed); // Restaure l'apparence enregistrée au chargement de la tâche.

  editButton.addEventListener("click", (editEvent) => {
    editEvent.stopPropagation();

    const bgPopupEdit = document.querySelector("#bg-popup-edit");
    bgPopupEdit.classList.replace("-z-20", "z-20");
    bgPopupEdit.classList.replace("opacity-0", "opacity-100");

    const editInput = document.querySelector("#edit-input");
    editInput.value = taskTitle.textContent;

    const editBtnPopup = document.querySelector("#edit-btn-popup");
    editBtnPopup.addEventListener("click", (editBntEvent) => {
      editBntEvent.preventDefault();
      editBntEvent.stopPropagation();
      bgPopupEdit.classList.replace("z-20", "-z-20");
      bgPopupEdit.classList.replace("opacity-100", "opacity-0");

      if (editInput.value === "" || editInput.value === null) {
        return;
      }

      taskTitle.textContent = editInput.value;
      let taskStorages = JSON.parse(localStorage.getItem("taskStorages")) || [];

      const taskIndex = taskStorages.findIndex(
        (taskEdited) => taskEdited.id === newTask.id,
      );
      taskStorages[taskIndex].text = editInput.value;

      localStorage.setItem("taskStorages", JSON.stringify(taskStorages));
    });
  });

  // === Bouton de suppression === //

  const supButton = document.createElement("button");
  supButton.classList.add("sup-button");
  supButton.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';
  divButtons.appendChild(supButton);

  taskInput.value = "";

  $(supButton).on("click", () => {
    let taskStorages = JSON.parse(localStorage.getItem("taskStorages")) || [];
    taskStorages = taskStorages.filter((supTask) => {
      return supTask.id !== newTask.id;
    });

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
  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
  };

  let taskStorages = JSON.parse(localStorage.getItem("taskStorages")) || [];
  taskStorages.push(newTask);

  localStorage.setItem("taskStorages", JSON.stringify(taskStorages));

  createTask(newTask);
});

let taskStorages = JSON.parse(localStorage.getItem("taskStorages")) || [];

taskStorages.forEach((taskStorage) => {
  createTask(taskStorage);
});
