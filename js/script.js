
const JSON_BIN_BASE_URL = "https://api.jsonbin.io/v3";
const JSON_BIN_ID = "66aa17f2ad19ca34f88f629f";

let employeeList = [];

async function loademployee() {
  console.log("loademployee triggered");
  const response = await axios.get(`${JSON_BIN_BASE_URL}/b/${JSON_BIN_ID}/latest`);
  return response.data.record.employee;
}

document.addEventListener("DOMContentLoaded", async function () {
  console.log("DOMContentLoaded event triggered");
  employeeList = await loademployee();
  renderList();
  console.log('Loaded employee list:', employeeList);
});

let addBtn = document.querySelector("#addBtn");
addBtn.addEventListener("click", function () {
  let id = document.querySelector("#create-id").value;
  let name = document.querySelector("#create-name").value;
  let post = document.querySelector("#create-post").value;
  let department = document.querySelector("#create-department").value;
  let salary = document.querySelector("#create-salary").value;
  addemployee(id, name, post, department, salary);
  renderList();
  console.log(employeeList);
});

let saveBtn = document.querySelector("#saveBtn");
saveBtn.addEventListener("click", async function () {
  await saveemployees(employeeList);
  renderList();
});

function addemployee(id, name, post, department, salary) {
  let employee = {
    id: id,
    name: name,
    post: post,
    department: department,
    salary: salary
  };
  employeeList.push(employee);
}

function renderList() {
  let listContainer = document.querySelector("#listContainer");
  listContainer.innerHTML = "";
  employeeList.forEach((employee, index) => {
    let listItem = document.createElement("div");
    listItem.innerHTML = `${index + 1}. 
                            Name: ${employee.name}, 
                            Post: ${employee.post}, 
                            Department: ${employee.department}, 
                            Salary: ${employee.salary}
                            <button class="editBtn" data-employeeid=${employee.id}>Edit Employee</button>
                            <button class="deleteBtn" data-employeeid=${employee.id}>Delete Employee</button>`;
    listContainer.appendChild(listItem);
  });

  // Attach event listeners for edit buttons
  let allEditButtons = document.querySelectorAll(".editBtn");
  for (let button of allEditButtons) {
    button.addEventListener("click", function (event) {
      console.log("edit btn");
      let clickedButton = event.target;
      let employeeId = Number(clickedButton.dataset.employeeid);
      let employeeName = prompt("Enter the new name");
      let employeePost = prompt("Enter the new Title");
      let employeeDepartment = prompt("Enter the new employee department");
      let employeeSalary = prompt("Enter the New Salary");
      updateemployee(employeeId, employeeName, employeePost, employeeDepartment, employeeSalary);
      renderList();
    });
  }

  // Attach event listeners for delete buttons
  let allDeleteButtons = document.querySelectorAll(".deleteBtn");
  for (let button of allDeleteButtons) {
    button.addEventListener("click", function (event) {
      let employeeId = event.target.dataset.employeeid;
      deleteEmployee(employeeId);
      renderList();
    });
  }
}

async function saveemployees() {
  let newData = {
    "employee": employeeList
  };
  console.log(newData);
  let response = await axios.put(`${JSON_BIN_BASE_URL}/b/${JSON_BIN_ID}`, newData);
  console.log(response.data);
  renderList();
}

function updateemployee(employeeId, employeeName, employeePost, employeeDepartment, employeeSalary) {
  console.log("editing employee");
  let employeeToEdit = null;
  for (let e of employeeList) {
    if (e.id == employeeId) {
      employeeToEdit = e;
      break;
    }
  }
  if (employeeToEdit) {
    employeeToEdit.name = employeeName;
    employeeToEdit.post = employeePost;
    employeeToEdit.department = employeeDepartment;
    employeeToEdit.salary = employeeSalary;
  }
}

function deleteEmployee(employeeId) {
  console.log("Deleting employee with ID:", employeeId);
  for (let i = 0; i < employeeList.length; i++) {
    if (String(employeeList[i].id) === String(employeeId)) {
      employeeList.splice(i, 1);
      console.log("Employee deleted:", employeeId);
      break;
    }
  }
}
