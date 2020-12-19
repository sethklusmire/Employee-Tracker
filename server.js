const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "NewOrleans1!",
  database: "employee_trackerDB",
});

connection.connect((err) => {
  if (err) throw err;
  startQuestions();
});

const startQuestions = () => {
  inquirer
    .prompt({
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
        "Exit",
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
  const query =
    "SELECT employee.id, employee.first_name, employee.last_name, company_role.title, department.dept_name, company_role.salary, employee.manager_id FROM employee INNER JOIN company_role ON company_role.id = employee.role_id INNER JOIN department ON department.id = company_role.department_id";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startQuestions();
  });
};
const viewByDepartment = (err) => {
  if (err) throw err;
  const query1 = "SELECT * FROM department";
  connection.query(query1, (err, res) => {
    if (err) throw err;
    let departmentChoices = [];
    res.forEach((department) => {
      departmentChoices.push({ name: department.dept_name });
    });
    inquirer.prompt([
      {
      name: "department",
      type: "list",
      message: "What department are you looking for?",
      choices: departmentChoices,
      }
    ])
    .then((data) => {
      const query2 = "SELECT employee.id, employee.first_name, employee.last_name, company_role.title, department.dept_name, company_role.salary, employee.manager_id FROM employee INNER JOIN company_role ON company_role.id = employee.role_id INNER JOIN department ON department.id = company_role.department_id WHERE ?"
      connection.query(query2, { dept_name: data.department }, (err,res) => {
        if (err) throw err;
        console.table(res);
        startQuestions();
      })

    })
  });
};

const viewByManager = (err) => {
  if (err) throw err;
  const query = "SELECT employee.id, employee.first_name, employee.last_name, company_role.title FROM employee INNER JOIN company_role ON company_role.id = employee.role_id WHERE manager_id IS null";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res)
    startQuestions()
  })
};

const addEmployee = () => {
  let newEmployee = {
    first_name: "",
    last_name: "",
    role_id: "",
    manager_id: "",
  };
  inquirer
    .prompt([
      {
        name: "first_name",
        message: "What is the employee's First Name?",
      },
      {
        name: "last_name",
        message: "What is the employee's Last Name?",
      },
    ])
    .then((data) => {
      newEmployee.first_name = data.first_name;
      newEmployee.last_name = data.last_name;
      const queryRoles = "SELECT id, title FROM company_role";
      connection.query(queryRoles, (err, res) => {
        if (err) throw err;
        let rolesChoice = [];
        res.forEach((company_role) => {
          rolesChoice.push({
            value: company_role.id,
            name: company_role.title,
          });
        });
        inquirer
          .prompt({
            name: "role_id",
            type: "list",
            message: "What role will the new Employee have?",
            choices: rolesChoice,
          })
          .then((data) => {
            newEmployee.role_id = data.role_id;
            const queryManager =
              "SELECT id, first_name, last_name FROM employee WHERE manager_id IS null";
            connection.query(queryManager, (err, res) => {
              if (err) throw err;
              let managerChoice = [{ value: null, name: "N/A" }];
              res.forEach((manager_id) => {
                managerChoice.push({
                  value: manager_id.id,
                  name: `${manager_id.first_name} ${manager_id.last_name}`,
                });
              });
              inquirer
                .prompt({
                  type: "list",
                  message: "Who will be the employee's manager?",
                  name: "manager_id",
                  choices: managerChoice,
                })
                .then((data) => {
                  //Stores to object
                  newEmployee.manager_id = data.manager_id;
                  //Insert new employee into database setting all available options and returns to menu
                  const queryEmp = "INSERT INTO employee SET ?";
                  connection.query(queryEmp, newEmployee, (err) => {
                    if (err) throw err;
                    startQuestions();
                  });
                });
            });
          });
      });
    });
};

const removeEmployee = (err) => {
  if (err) throw err;
  const query1 = "SELECT id, first_name, last_name FROM employee"
  connection.query(query1, (err, res) => {
    if (err) throw err;
    let removeChoice = []
    res.forEach((employee) => {
      removeChoice.push({
        value: employee.id,
        name: `${employee.first_name} ${employee.last_name}`
      })
    })
    inquirer.prompt([
      {
        name: "removeEmployee",
        message: "Which employee would you like to remove?",
        type: "list",
        choices: removeChoice,
      }
    ])
    .then((data) => {
const query2 = "DELETE FROM employee WHERE ?"
    connection.query(query2, { id: data.removeEmployee }, (err) => {
      if (err) throw err;
      startQuestions();
    })
    })
    
  })
};

const updateEmpRole = (err) => {
  if (err) throw err;
  console.log("update role");
};
const updateEmpManager = (err) => {
  if (err) throw err;
  console.log("update manager");
};
const viewRoles = (err) => {
  if (err) throw err;
  const query = "SELECT title, salary, department_id FROM company_role";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res)
    startQuestions()
  })
};
const addRole = (err) => {
  if (err) throw err;
  console.log("add role");
};
const removeRole = (err) => {
  if (err) throw err;
  console.log("remove role");
};
const viewDepartment = (err) => {
  if (err) throw err;
  const query = "SELECT * FROM department";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res)
    startQuestions()
  })
};
const addDepartment = (err) => {
  if (err) throw err;
  console.log("add department");
};
const removeDepartment = (err) => {
  if (err) throw err;
  console.log("remove department");
};

