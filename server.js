const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "NewOrleans1!",
  database: "employee_trackerDB",
});

connection.connect((err) => {
  if(err) throw err;
  startQuestions();

})



const startQuestions = () => {
    inquirer.prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "View All Roles",
        "Add Role",
        "Remove Role",
        "View Departments",
        "Add Department",
        "Remove Department",
        "Exit"
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View All Employees":
          viewEmployees();
        break;
        case "View All Employees by Department":
          viewByDepartment();
        break;
        case "View All Employees by Manager":
          viewByManager();
        break;
        case "Add Employee":
          addEmployee();
        break;
        case "Remove Employee":
        removeEmployee();
        break;
        case "Update Employee Role":
        updateEmpRole();
        break;
        case "Update Employee Manager":
        updateEmpManager();
        break;
        case "View All Roles":
        viewRoles();
        break;
        case "Add Role":
        addRole();
        break;
        case "Remove Role":
        removeRole();
        break;
        case "View Departments":
          viewDepartment();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Remove Department":
          removeDepartment();
          break;
        case "Exit":
          connection.end();
      }

    });
    
};
const viewEmployees = (err) => {
  if (err) throw err;
    const query = "SELECT employee.id, employee.first_name, employee.last_name, company_role.title, department.dept_name, company_role.salary, employee.manager_id FROM employee INNER JOIN company_role ON company_role.id = employee.role_id INNER JOIN department ON department.id = company_role.department_id;";
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res)
      startQuestions();
    })
  

}
const viewByDepartment = (err) => {
  if (err) throw err;
  inquirer
  .prompt({
    name: "deptsearch",
    type: "list",
    message: "What department are you looking for?",
    choices: [
      "Sales",
      "Tech",
      "Legal",
      "Exit"
    ]    
  })
    
}

const viewByManager = (err) => {
  if (err) throw err;
  console.log("view manager")
}

const addEmployee = (err) => {
  if (err) throw err;
  let newEmployee = {
    first_name = "",
    last_name = "",
    role_id = "",
    manager_id = ""
  }
  inquirer
  .prompt([
    {
      name: "first_name",
      message: "What is the employee's First Name?",
    },
    {
      name: "last_name",
      message: "What is the employee's Last Name?"
    }
  ])
  .then((data) => {
    newEmployee.first_name = data.first_name;
    newEmployee.first_name = data.first_name;
    
  })
}

const removeEmployee = (err) => {
  if (err) throw err;
console.log("remove")
}

const updateEmpRole = (err) => {
  if (err) throw err;
  console.log("update role")
}

const updateEmpManager = (err) => {
  if (err) throw err;
  console.log("update manager")
}

const viewRoles = (err) => {
  if (err) throw err;
  console.log("view all roles")
}

const addRole = (err) => {
  if (err) throw err;
  console.log("add role")
}

const removeRole = (err) => {
  if (err) throw err;
  console.log("remove role")
}

const viewDepartment = (err) => {
  if (err) throw err;
  console.log("view department")
}
const addDepartment = (err) => {
  if (err) throw err;
  console.log("add department")
}
const removeDepartment = (err) => {
  if (err) throw err;
  console.log("remove department")
}

// res.forEach(({ first_name, last_name }) => {
//       //   console.log(first_name, last_name)
//       // })


// View all Employees
// View all employees by department
// view all employees by manager
// add employee
// remove employee
// update employee role
// update employee manager
// view all roles
// add role
// remove role