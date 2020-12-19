const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const logo = require("asciiart-logo");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "NewOrleans1!",
  database: "employee_trackerDB",
});
// inquire each prompt
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
        "View All Roles",
        "Add Role",
        "Remove Role",
        "View Departments",
        "Add Department",
        "Remove Department",
        "Exit",
      ],
    })
    // each switch statement shoots you to the correct function
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
// heck of a join to show employee info
const viewEmployees = (err) => {
  if (err) throw err;
  const query = `SELECT employee.id, 
    employee.first_name, 
    employee.last_name, 
    company_role.title, 
    department.dept_name, 
    company_role.salary, 
    employee_manager.first_name AS manager_first_name,
    employee_manager.last_name AS manager_last_name
    FROM employee 
    INNER JOIN company_role ON company_role.id = employee.role_id 
    INNER JOIN department ON department.id = company_role.department_id
    LEFT JOIN employee AS employee_manager ON employee_manager.id = employee.manager_id;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startQuestions();
  });
};

const viewByDepartment = (err) => {
  if (err) throw err;
  // Select from department
  const query1 = "SELECT * FROM department";
  connection.query(query1, (err, res) => {
    if (err) throw err;
    let departmentChoices = [];
    res.forEach((department) => {
      departmentChoices.push({ name: department.dept_name });
    });
    // inquire into the correct place, which department in this case
    inquirer
      .prompt([
        {
          name: "department",
          type: "list",
          message: "What department are you looking for?",
          choices: departmentChoices,
        },
      ])
      // calling from SQL to show the correct information
      .then((data) => {
        const query2 = `SELECT employee.id, 
          employee.first_name, 
          employee.last_name, 
          company_role.title, 
          department.dept_name, 
          company_role.salary, 
          employee.manager_id 
          FROM employee 
          INNER JOIN company_role ON company_role.id = employee.role_id 
          INNER JOIN department ON department.id = company_role.department_id WHERE ?`;
        connection.query(query2, { dept_name: data.department }, (err, res) => {
          if (err) throw err;
          console.table(res);
          startQuestions();
        });
      });
  });
};
// Select from managers. In this case I made managers the value of null.
const viewByManager = (err) => {
  if (err) throw err;
  const query = `SELECT employee.id, 
    employee.first_name, 
    employee.last_name, 
    company_role.title 
    FROM employee 
    INNER JOIN company_role ON company_role.id = employee.role_id WHERE manager_id IS null`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startQuestions();
  });
};

const addEmployee = (err) => {
  if (err) throw err;
  // set a new variable to place data in
  let newEmployee = {
    first_name: "",
    last_name: "",
    role_id: "",
    manager_id: "",
  };
  // prompt for first and last name of employee
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
    // Set the new first and last name in the newEmployee variable
    .then((data) => {
      newEmployee.first_name = data.first_name;
      newEmployee.last_name = data.last_name;
      const queryRoles = "SELECT id, title FROM company_role";
      connection.query(queryRoles, (err, res) => {
        if (err) throw err;
        // establish a variable that's an empty array to store roles
        let rolesChoice = [];
        res.forEach((company_role) => {
          rolesChoice.push({
            value: company_role.id,
            name: company_role.title,
          });
        });
        inquirer
        // put into the array
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
              // same thing, establish that a manager is NULL
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
  // get your correct sql info
  const query1 = "SELECT id, first_name, last_name FROM employee";
  connection.query(query1, (err, res) => {
    if (err) throw err;
    let removeChoice = [];
    res.forEach((employee) => {
      removeChoice.push({
        value: employee.id,
        name: `${employee.first_name} ${employee.last_name}`,
      });
    });
    // inquire to remove it
    inquirer
      .prompt([
        {
          name: "removeEmployee",
          message: "Which employee would you like to remove?",
          type: "list",
          choices: removeChoice,
        },
      ])
      // Use DELETE to remove from data
      .then((data) => {
        const query2 = "DELETE FROM employee WHERE ?";
        connection.query(query2, { id: data.removeEmployee }, (err) => {
          if (err) throw err;
          startQuestions();
        });
      });
  });
};

const updateEmpRole = (err) => {
  if (err) throw err;
  let updateRole = {
    id: 0,
    title: "",
    salary: 0,
  };
  // This join is a mess. Everything from company_role joined with department name.
  // I also did them in ascending order to alphabetize them
  const query1 = `
  SELECT company_role.*, department.dept_name FROM company_role
  INNER JOIN department ON department.id = company_role.department_id
  ORDER BY company_role.title ASC`;
  connection.query(query1, (err, res) => {
    if (err) throw err;
    // store the new data in an array
    let updateChoices = [];
    res.forEach((company_role) => {
      updateChoices.push({
        value: company_role,
        name: `${company_role.title} - ${company_role.dept_name} ($${company_role.salary})`,
      });
    });
    // inquire the role and put the input into the array
    inquirer
      .prompt([
        {
          name: "selectRole",
          message: "Which role would you like to update?",
          type: "list",
          choices: updateChoices,
        },
      ])
      .then((data) => {
        updateRole.id = data.selectRole.id;
        return inquirer.prompt([
          {
            name: "newTitle",
            message: "Title?",
            default: data.selectRole.title,
          },
          {
            name: "newSalary",
            message: "Enter the salary.",
            default: data.selectRole.salary,
          },
        ]);
      })
      // put the data in the newTitle and newSalary
      .then((data) => {
        updateRole.title = data.newTitle;
        updateRole.salary = data.newSalary;
        const query3 = `
  UPDATE company_role SET
  title = ?,
  salary = ?
  WHERE id = ?`;
        connection.query(
          query3,
          [updateRole.title, updateRole.salary, updateRole.id],
          (err, res) => {
            if (err) throw err;
            startQuestions();
          }
        );
      });
  });
};
// Select company_roles from SQL
const viewRoles = (err) => {
  if (err) throw err;
  const query = "SELECT title, salary, department_id FROM company_role";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startQuestions();
  });
};

const addRole = (err) => {
  if (err) throw err;
  // call an array to put inputs into
  let departmentArray = [];
  queryDepartment = "SELECT * FROM department";
  connection.query(queryDepartment, (err, res) => {
    if (err) throw err;
    res.forEach((department) => {
      departmentArray.push({
        name: department.dept_name,
        value: department.id,
      });
    });
  });
// variable to put the new role data into
  let newRole = {
    title: "",
    salary: "",
    department_id: "",
  };
  inquirer
    .prompt([
      {
        name: "title",
        message: "What is the title of the new role?",
      },
      {
        name: "salary",
        message: "What is the salary of the new role?",
      },
      {
        name: "department_id",
        message: "What department should the role be added to?",
        type: "list",
        choices: departmentArray,
      },
    ])
    // insert new data into newRole
    .then((data) => {
      newRole.title = data.title;
      newRole.salary = data.salary;
      newRole.department_id = data.department_id;
      const query = "INSERT INTO company_role SET ?";
      connection.query(query, newRole, (err) => {
        if (err) throw err;
        startQuestions();
      });
    });
};

const removeRole = (err) => {
  if (err) throw err;
  const query1 = "SELECT * FROM company_role";
  connection.query(query1, (err, res) => {
    if (err) throw err;
    let removeArray = [];
    res.forEach((company_role) => {
      removeArray.push({
        value: company_role.id,
        name: company_role.title,
      });
    });
    inquirer
      .prompt([
        {
          name: "removeRole",
          message: "Which role would you like to remove?",
          type: "list",
          choices: removeArray,
        },
      ])
      .then((data) => {
        const query2 = "DELETE FROM company_role WHERE ?";
        connection.query(query2, { id: data.removeRole }, (err) => {
          if (err) throw err;
          startQuestions();
        });
      });
  });
};

const viewDepartment = (err) => {
  if (err) throw err;
  const query = "SELECT * FROM department";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startQuestions();
  });
};

const addDepartment = (err) => {
  if (err) throw err;
  inquirer
    .prompt({
      name: "dept_name",
      message: "What department would you like to add?",
      type: "input",
    })
    .then((data) => {
      const query = "INSERT INTO department SET ?";
      connection.query(query, { dept_name: data.dept_name }, (err, res) => {
        if (err) throw err;
        startQuestions();
      });
    });
};

const removeDepartment = (err) => {
  if (err) throw err;
  const query1 = "SELECT * FROM department";
  connection.query(query1, (err, res) => {
    if (err) throw err;
    let removeChoice = [];
    res.forEach((department) => {
      removeChoice.push({
        value: department.id,
        name: department.dept_name,
      });
    });
    inquirer
      .prompt([
        {
          name: "removeDepartment",
          message: "Which department would you like to remove?",
          type: "list",
          choices: removeChoice,
        },
      ])
      .then((data) => {
        const query2 = "DELETE FROM department WHERE ?";
        connection.query(query2, { id: data.removeDepartment }, (err) => {
          if (err) throw err;
          startQuestions();
        });
      });
  });
};

connection.connect((err) => {
  if (err) throw err;
  console.log(`Connection at id ${connection.threadId}`);
 
  console.log(logo({ name: "Employee Manager" }).render());
  
  startQuestions();
});
