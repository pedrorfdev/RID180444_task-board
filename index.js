const getTasksFromLocalStorage = () => {
  const localTasks = JSON.parse(window.localStorage.getItem("tasks"));
  return localTasks
    ? localTasks
    : [
        { id: 1, description: "Comprar pão", tag: "UX", checked: false },
        { id: 2, description: "Academia", tag: "BackEnd", checked: false },
        { id: 3, description: "Ler um livro", tag: "FrontEnd", checked: false },
      ];
};

const setTasksInLocalStorage = (tasks) => {
  window.localStorage.setItem("tasks", JSON.stringify(tasks));
};

const completeTask = (taskId) => {
  const taskElement = document.getElementById(taskId);
  const tasks = getTasksFromLocalStorage();
  const tasksCounter = document.getElementById("tasks-counter");

  if (taskElement) {
    // 1. Adiciona a classe "task-completed" ao título (h3)
    const taskTitle = taskElement.querySelector("h3");
    if (taskTitle) {
      taskTitle.classList.add("task-completed"); // Alterna a classe (riscado/normal)

      taskTitle.style.textDecoration =
        taskTitle.style.textDecoration === "line-through"
          ? "none"
          : "line-through";
    }
    // 2. Substitui o botão "Concluir" pelo ícone "checked"
    const completeButton = taskElement.querySelector(".complete-task-button"); // Seleciona pela classe
    const checkedIcon = taskElement.querySelector(".checked-icon"); // Seleciona o ícone, se existir

    if (completeButton) {
      const icon = document.createElement("span");
      icon.textContent = "\u2713";
      icon.classList.add("checked-icon");
      icon.onclick = () => completeTask(taskId); // Permite desmarcar

      completeButton.parentNode.replaceChild(icon, completeButton);
    } else if (checkedIcon) {
      // Se o ícone já existe
      const button = document.createElement("button");
      button.textContent = "Concluir";
      button.classList.add("complete-task-button");
      button.onclick = () => completeTask(taskId);

      checkedIcon.parentNode.replaceChild(button, checkedIcon);
    }
    // Atualiza o array de tasks (opcional, se você ainda precisar dele)
    updatedTasks = tasks.map((task) => {
      if (task.id === parseInt(taskId)) {
        return { ...task, checked: !task.checked }; // Inverte o status (true/false)
      }
      return task;
    });

    setTasksInLocalStorage(updatedTasks);

    const completedTasks = updatedTasks.filter((task) => task.checked).length; // Recalcula as tarefas concluidas
    tasksCounter.textContent = `${completedTasks} tarefas concluídas`;
  }
};

const createTaskListItem = (task, taskInput) => {
  const list = document.getElementById("todo-list");
  const toDo = document.createElement("li");

  toDo.id = task.id;
  toDo.appendChild(taskInput); // Primeiro, adiciona o conteúdo (título, tag e data)

  if (task.checked) {
    // Verifica se a tarefa já está marcada como concluída
    const checkedIcon = document.createElement("span");
    checkedIcon.textContent = "\u2713";
    checkedIcon.classList.add("checked-icon");
    checkedIcon.onclick = () => completeTask(task.id);
    toDo.appendChild(checkedIcon); // Depois, adiciona o ícone
  } else {
    const completeTaskButton = document.createElement("button");
    completeTaskButton.textContent = "Concluir";
    completeTaskButton.ariaLabel = "Concluir tarefa";
    completeTaskButton.classList.add("complete-task-button");
    completeTaskButton.onclick = () => completeTask(task.id);
    toDo.appendChild(completeTaskButton); // Depois, adiciona o botão
  }

  list.appendChild(toDo);

  return toDo;
};

const getTaskInput = ({ id, description, tag }) => {
  const title = document.createElement("h3");
  const etiqueta = document.createElement("p");
  const wrapper = document.createElement("div");
  const createdAt = document.createElement("p");

  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();

  const formatedDate = `${day}/${month}/${year}`;
  createdAt.textContent = `criado em: ${formatedDate}`;

  const taskId = `${id}-task`;

  title.id = taskId;
  title.textContent = description;
  etiqueta.textContent = tag;
  createdAt.className = "createdAt";

  wrapper.className = "wrapper-taskInput";
  wrapper.appendChild(title);
  wrapper.appendChild(etiqueta);
  wrapper.appendChild(createdAt);

  return wrapper;
};

const getNewTaskId = () => {
  const tasks = getTasksFromLocalStorage();
  const lastId = tasks[tasks.length - 1]?.id;
  return lastId ? lastId + 1 : 1;
};

const getNewTaskData = (event) => {
  const description = event.target.elements.description.value;
  const tag = event.target.elements.tag.value;
  const id = getNewTaskId();

  return {
    description,
    tag,
    id,
  };
};

const createTask = (event) => {
  event.preventDefault();

  const newTaskData = getNewTaskData(event);
  const checkbox = getTaskInput(newTaskData);

  createTaskListItem(newTaskData, checkbox);

  const tasks = getTasksFromLocalStorage();
  const updatedTasks = [
    ...tasks,
    {
      id: newTaskData.id,
      description: newTaskData.description,
      tag: newTaskData.tag,
      checked: false,
    },
  ];
  setTasksInLocalStorage(updatedTasks);

  document.getElementById("description").value = "";
  document.getElementById("tag").value = "";
};

window.onload = function () {
  const form = document.getElementById("create-task-form");
  form.addEventListener("submit", createTask);

  const tasks = getTasksFromLocalStorage();
  tasks.forEach((task) => {
    const taskInput = getTaskInput(task);
    createTaskListItem(task, taskInput);
  });

  const completedTasks = tasks.filter((task) => task.checked).length;
  const tasksCounter = document.getElementById("tasks-counter");
  tasksCounter.textContent = `${completedTasks} tarefas concluídas`;
};
