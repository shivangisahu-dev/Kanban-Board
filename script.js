/*==========CREATING VARIABLES============*/
const todo = document.getElementById("todo");
const progress = document.getElementById("progress");
const done = document.getElementById("done");
let dropvalue = null;
let columns = [todo, progress, done];

/*============LOCAL STORAGE================*/
let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

savedTasks = savedTasks.filter((task) => {
  return task.title.trim() !== "" && task.description.trim() !== "";
});

localStorage.setItem("tasks", JSON.stringify(savedTasks));

/*============ADD NEW TASK ================*/

const addTask = document.getElementById("add_btn");
addTask.addEventListener("click", () => {
  let s1 = document.querySelector(".styling-div");
  s1.classList.add("active");
});

/*===============ADDING NEW TASK INTO COLUMN===========*/

function Adding_new_work(
  InputValue,
  DescValue,
  columnName = "todo",
  save = true,
) {
  /*-------EMPTY FIELD CHECK----------*/
  if (InputValue.trim() === "" || DescValue.trim() === "") {
    return;
  }

  /*-------CREATING DIV AND APPLY EVENTLSITENER----------*/
  const Adding_task = document.createElement("div");
  Adding_task.setAttribute("draggable", "true");
  Adding_task.setAttribute("class", "task");
  Adding_task.addEventListener("dragstart", () => {
    dropvalue = Adding_task;
  });

  /*-----------CREATING H2------------*/
  const h2 = document.createElement("h2");
  h2.textContent = InputValue;
  h2.style.cssText = "font-size:22px";

  /*------------CREATING P TAG-------*/
  const description = document.createElement("p");
  description.textContent = DescValue;

  /*-------------CREATING DELETE BUTTON-----------------*/
  const del = document.createElement("button");
  del.textContent = "Delete";
  del.setAttribute("class", "delete");
  del.addEventListener("click", () => {
    Adding_task.remove();

    savedTasks = savedTasks.filter((task) => {
      return !(task.title === InputValue && task.description === DescValue);
    });

    localStorage.setItem("tasks", JSON.stringify(savedTasks));

    columns.forEach((col) => {
      const tasks = col.querySelectorAll(".task");
      const count = col.querySelector(".right");

      count.innerText = tasks.length;
    });
  });

  /*---------APPEND INPUT ELEMENTS INTO DIV----------*/
  Adding_task.append(h2);
  Adding_task.append(description);
  Adding_task.append(del);

  /*--------------APPEND DIV INTO COLUMN---------*/
  const Final_Adding = document.querySelector("#" + columnName);
  Final_Adding.append(Adding_task);

  /*============SAVE NEW TASK================*/
  if (save) {
    savedTasks.push({
      title: InputValue,
      description: DescValue,
      column: columnName,
    });

    localStorage.setItem("tasks", JSON.stringify(savedTasks));
  }

  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    count.innerText = tasks.length;
  });
}

/*============VERIFYING INPUT VALUES================*/
const input = document.querySelector(".input");
const desc = document.querySelector(".desc");

function checkInput() {
  if (input.value.trim() === "" || desc.value.trim() === "") {
    ValueSelection.disabled = true;
  } else {
    ValueSelection.disabled = false;
  }
}

input.addEventListener("input", checkInput);
desc.addEventListener("input", checkInput);

/*=======TAKING VALUES FROM ADD BUTTON===========*/

const ValueSelection = document.querySelector(".add-task");

ValueSelection.addEventListener("click", () => {
  let InputValue = document.querySelector(".input").value.trim();
  let DescValue = document.querySelector(".desc").value.trim();

  /*============EMPTY FIELD CHECK================*/
  if (InputValue === "" || DescValue === "") {
    return;
  }

  let s1 = document.querySelector(".styling-div");
  s1.classList.remove("active");

  Adding_new_work(InputValue, DescValue);

  document.querySelector(".input").value = "";
  document.querySelector(".desc").value = "";

  checkInput();
});

const tasks = document.querySelectorAll(".task");

/*========LOAD TASKS FROM LOCAL STORAGE===========*/

savedTasks.forEach((task) => {
  Adding_new_work(task.title, task.description, task.column, false);
});

/*========DRAG AND DROP FUNCTIONALITIES===========*/

function dragenter(elem) {
  elem.addEventListener("dragenter", (e) => {
    e.preventDefault();
    elem.classList.add("hover-over");
  });

  elem.addEventListener("dragleave", (e) => {
    e.preventDefault();
    elem.classList.remove("hover-over");
  });

  elem.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  elem.addEventListener("drop", (e) => {
    e.preventDefault();

    elem.append(dropvalue);
    elem.classList.remove("hover-over");

    /*============SAVE NEW POSITION================*/

    savedTasks.forEach((task) => {
      if (
        task.title === dropvalue.querySelector("h2").innerText &&
        task.description === dropvalue.querySelector("p").innerText
      ) {
        task.column = elem.id;
      }
    });

    localStorage.setItem("tasks", JSON.stringify(savedTasks));

    columns.forEach((col) => {
      const tasks = col.querySelectorAll(".task");
      const count = col.querySelector(".right");

      count.innerText = tasks.length;
    });
  });
}

dragenter(todo);
dragenter(progress);
dragenter(done);
