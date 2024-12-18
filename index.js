let tasks = [
  { id: 1, description: "Comprar pão", tag: "UX", checked: false },
  { id: 2, description: "Academia", tag: "BackEnd", checked: false },
  { id: 3, description: "Ler um livro", tag: "FrontEnd", checked: false },
];

const completeTask = (taskId) => {
  tasks = tasks.filter(({ id }) => parseInt(id) !== parseInt(taskId));

  document
    .getElementById("todo-list")
    .removeChild(document.getElementById(taskId));
};

const createTaskListItem = (task, checkbox) => {
  const list = document.getElementById("todo-list");
  const toDo = document.createElement("li");

  const completeTaskButton = document.createElement("button");
  completeTaskButton.textContent = "Concluir";
  completeTaskButton.ariaLabel = "Concluir tarefa";

  completeTaskButton.onclick = () => completeTask(task.id);

  toDo.id = task.id;
  toDo.appendChild(checkbox);
  toDo.appendChild(completeTaskButton);
  list.appendChild(toDo);

  return toDo;
};

const getCheckboxInput = ({ id, description, checked }) => {
  const checkbox = document.createElement("input");
  const label = document.createElement("label");
  const wrapper = document.createElement("div");

  const checkboxId = `${id}-checkbox`;

  checkbox.type = "checkbox";
  checkbox.id = checkboxId;
  checkbox.checked = checked || false;

  label.textContent = description;
  label.htmlFor = checkboxId;

  wrapper.className = "wrapper-checkbox";
  wrapper.appendChild(checkbox);
  wrapper.appendChild(label);

  return wrapper;
};

const getNewTaskId = () => {
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
  const checkbox = getCheckboxInput(newTaskData);

  createTaskListItem(newTaskData, checkbox);

  tasks = [
    ...tasks,
    {
      id: newTaskData.id,
      description: newTaskData.description,
      tag: newTaskData.tag,
      checked: false,
    },
  ];
};

window.onload = function () {
  const form = document.getElementById("create-task-form");
  form.addEventListener("submit", createTask);

  tasks.forEach((task) => {
    const checkbox = getCheckboxInput(task);
    createTaskListItem(task, checkbox);
  });
};
