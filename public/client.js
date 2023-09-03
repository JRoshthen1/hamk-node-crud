const taskFormElement = document.getElementById("task-form-element");

const taskFormContainer = document.getElementById("new-task-form-container");
taskFormContainer.style.display = "none";
function closeNewTaskModal() {
  taskFormContainer.style.display = "none";
}
var openNewTaskForm = document.getElementById("open-new-task-form");
openNewTaskForm.addEventListener("click", function () {
  taskFormContainer.style.display = "flex";
});
document.addEventListener("DOMContentLoaded", function () {
  // fetch tasks when page loads
  fetchTasks();
  // clear form when page loads
  taskFormElement.reset();
});

async function fetchTasks() {
  fetch("/fetch-tasks")
    .then((response) => response.text())
    .then((allTasksList) => updateTasksContainer(allTasksList))
    .catch((error) => console.error("Error fetching tasks:", error));
}

// Function to update the tasks container with the retrieved tasks HTML
async function updateTasksContainer(allTasksList) {
  try {
    const taskHtmlTags = JSON.parse(allTasksList)
      .result.map((task) => {
        const taskID = task._ObjId;
        const taskName = task.name;
        const taskDesc = task.description;
        const taskPrio = task.priority;
        const taskDue = task.due;
        return `<div class="task-card">
          <h2>${taskName}</h2>
          <div>${
            "●".repeat(Math.min(taskPrio, 3)) +
            "○".repeat(Math.max(0, 3 - taskPrio))
          }</div>
          <span>${taskDue}</span>
          <p>${taskDesc}</p>
          <aside>
            <button id="updateButton" onclick="updateTask(
              '${taskID}','${taskName}','${taskDesc}','${taskPrio}','${taskDue}'
            )">/</button>
            <button id="deleteButton" onclick="deleteTask(${taskID})">X</button>
          </aside>
          </div>`;
      })
      .join("");
    document.getElementById("tasks-container").innerHTML = taskHtmlTags;
  } catch (error) {
    console.log(error);
  }
}

// DELETE TASK REQUEST
async function deleteTask(taskId) {
  try {
    const deleteRequest = { id: taskId };
    const response = await fetch("/delete-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(deleteRequest),
    });
    const data = await response.json();
    console.log(data.msg.status);
  } catch (error) {
    console.error("Error occurred while deleting the task:", error);
  } finally {
   // fetchTasks();
    location.reload()
  }
}

// ADD NEW TASK REQUEST
var openNewTaskForm = document.getElementById("open-new-task-form");
openNewTaskForm.addEventListener("click", function () {
  taskFormElement.reset();
  taskFormContainer.style.display = "flex";

  document.getElementById("submit-button-display-handle").innerHTML =
    '<button id="new-task-submit" type="submit">Add Task</button>';

    taskFormElement
    .addEventListener("submit", async function (event) {
      try {
        event.preventDefault();
        // Create an object from the form data
        const formData = new FormData(event.target);
        const taskData = {};
        for (const [key, value] of formData.entries()) {
          taskData[key] = value;
        }
        const dataToUpdate = JSON.stringify(taskData);
        const response = await fetch("/create-task", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: dataToUpdate,
        });
        const data = await response.json();
        console.log(data.msg.status);
      } catch (error) {
        console.error("Error occurred while creating the task:", error);
      } finally {
        //fetchTasks();
        //closeNewTaskModal();
        location.reload()

      }
    });
});


// UPDATE TASK REQUEST
function updateTask(id, name, desc, prio, due) {
  const values = [name, desc, prio, due];// collect selected task values and input them into the submit form
  var formInputs = document.getElementsByClassName("form-inputs");
   function assignValuesByClass(inputs, values) {
     for (let i = 0; i < inputs.length; i++) {
       const inputField = inputs[i];

       if (inputField) {
         inputField.value = values[i];
       }
     }
   }
   assignValuesByClass(formInputs, values);
   taskFormContainer.style.display = "flex";
   // insert 'update' button with destinct id
   document.getElementById("submit-button-display-handle").innerHTML =
     '<button id="update-task-submit" type="submit">Update Task</button>';

   document
     .getElementById("update-task-submit")
     .addEventListener("click", function () {
       taskFormElement.addEventListener("submit", async function (event) {
         event.preventDefault();

         try {
          event.preventDefault();
          // Create an object from the form data
          const formData = new FormData(event.target);
          const taskData = {};
          taskData['id'] = id
          for (const [key, value] of formData.entries()) {
            taskData[key] = value;
          }
          const dataToUpdate = JSON.stringify(taskData);
          const response = await fetch("/update-task", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: dataToUpdate,
          });
          const data = await response.json();
            console.log(data.msg.status);
        } catch (error) {
            console.error("Error occurred while updating the task:", error);
        } finally {
          // fetchTasks();
          // closeNewTaskModal();
          location.reload()
        };
       });
     });
    };
    

    // document.getElementById('checkdbButton').onclick = async () => {
    //   const response = await fetch("/create-task", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: "tasksDB"
    //   });
    //   const data = await response.json();
    //   console.log(data.msg.status);
    // }

    // document.getElementById('deletedbButton').onclick = async () => {
    //   try {
    //     const response = await fetch("/delete-task", {
    //       method: "POST",
    //       headers: { "Content-Type": "text/plain" },
    //       body: "tasksDB"
    //     });
    //     const data = await response.json();
    //     console.log(data.msg.status);
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }