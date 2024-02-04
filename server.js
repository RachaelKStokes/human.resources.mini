//import necessary packages
const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

const db = mysql.createConnection({
    database: 'employees',
    user: 'root',
}, () => console.log('connected'));

// function after connection is established and welcome image shows 
afterConnection = () => {
    console.log("===================================");
    console.log("|        EMPLOYEE MANAGER         |");
    console.log("===================================");
    promptUser();
  };

const prompt = inquirer.createPromptModule();

//Options menu
prompt({
    message: 'Please select an option',
    type: 'rawlist',
    name: 'view',
    choices: [
          'View All Employees',
          'View All Roles',
          'View All Departments',
          'View All Employees By Department',
          'Update Employee Role',
          'Update Employee Manager',
          'Add Employee',
          'Add Role',
          'Add Department',
          'Remove Employee',
          'Exit'
    ]
}).then((answers) => {
    const {choices} = answers;

    if (choices === 'View All Employees') {
        showEmployees();
    }

    if (choices === 'View All Roles') {
        showRoles();
    }

    if (choices === 'View All Departments') {
        showDepartments();
    }

    if (choices === 'View All Employees By DEpartment') {
        showEmployeesByDept();
    }

    if (choices === 'Update Employee Role') {
        updateRole();
    }

    if (choices === 'Update Employee Manager') {
        updateManager();
    }

    if (choices === 'Add Employee') {
        addEmployee();
    }

    if (choices === 'Add Role') {
        addRole();
    }

    if (choices === 'Add Department') {
        addDepartment();
    }

    if (choices === 'Remove Employee') {
        removeEmployee();
    }

    if (choices === 'Exit') {
        connection.end();
    }
});

//Options pages------------

//View roles

showEmployees = () => {
    let sql = `SELECT employee.id, 
                  employee.first_name, 
                  employee.last_name, 
                  role.title, 
                  department.name AS department, 
                  role.salary
                  CONCAT (manager.first_name, "", manager.last_name) AS manager
                FROM employee, role, department 
                  WHERE department.id = role.department_id 
                  AND role.id = employee.role_id
                  ORDER BY employee.id ASC`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};
  
// View all roles

  showRoles = () => {
  
    const sql = `SELECT role.id, role.title, department.name AS department
                 FROM role
                 INNER JOIN department ON role.department_id = department.id`;
    
    connection.promise().query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows); 
      promptUser();
    })
  };
  
  // View all departments

  showDepartments = () => {
    const sql = `SELECT department.id AS id, department.name AS department FROM department`; 
  
    connection.promise().query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      promptUser();
    });
  };
  
  // View all employees by dept

  showEmployeesByDept = () => {
    const sql = `SELECT employee.first_name, 
                        employee.last_name, 
                        department.name AS department
                 FROM employee 
                 LEFT JOIN role ON employee.role_id = role.id 
                 LEFT JOIN department ON role.department_id = department.id`;
  
    connection.promise().query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows); 
      promptUser();
    });          
  };
  
  // Add an employee

  addEmployee = () => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "What is the employee's first name?",
        validate: addFirst => {
          if (addFirst) {
              return true;
          } else {
              console.log('Please enter a first name');
              return false;
          };
        };
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
        validate: addLast => {
          if (addLast) {
              return true;
          } else {
              console.log('Please enter a last name');
              return false;
          };
        }
      }
    ])
      .then(answer => {
      const params = [answer.firstName, answer.lastName]
      const roleSql = `SELECT role.id, role.title FROM role`;
    
      connection.promise().query(roleSql, (err, data) => {
        if (err) throw err; 
        
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
  
        inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: roles
              }
            ])
              .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);
  
                const managerSql = `SELECT * FROM employee`;
  
                connection.promise().query(managerSql, (err, data) => {
                  if (err) throw err;
  
                  const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
                  inquirer.prompt([
                    {
                      type: 'list',
                      name: 'manager',
                      message: "Who is the employee's manager?",
                      choices: managers
                    }
                  ])
                    .then(managerChoice => {
                      const manager = managerChoice.manager;
                      params.push(manager);
  
                      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                      VALUES (?, ?, ?, ?)`;
  
                      connection.query(sql, params, (err, result) => {
                      if (err) throw err;
                      console.log("Employee has been added!")
  
                      showEmployees();
                });
              });
            });
          });
       });
    });
  };
  //continue HERE
  // Add a New Role
  const addRole = () => {
    const sql = 'SELECT * FROM department'
    connection.promise().query(sql, (error, response) => {
        if (error) throw error;
        let deptNamesArray = [];
        response.forEach((department) => {deptNamesArray.push(department.department_name);});
        deptNamesArray.push('Create Department');
        inquirer
          .prompt([
            {
              name: 'departmentName',
              type: 'list',
              message: 'Which department is this new role in?',
              choices: deptNamesArray
            }
          ])
          .then((answer) => {
            if (answer.departmentName === 'Create Department') {
              this.addDepartment();
            } else {
              addRoleResume(answer);
            }
          });
  
        const addRoleResume = (departmentData) => {
          inquirer
            .prompt([
              {
                name: 'newRole',
                type: 'input',
                message: 'What is the name of your new role?',
                validate: validate.validateString
              },
              {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of this new role?',
                validate: validate.validateSalary
              }
            ])
            .then((answer) => {
              let createdRole = answer.newRole;
              let departmentId;
  
              response.forEach((department) => {
                if (departmentData.departmentName === department.department_name) {departmentId = department.id;}
              });
  
              let sql =   `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
              let crit = [createdRole, answer.salary, departmentId];
  
              connection.promise().query(sql, crit, (error) => {
                if (error) throw error;
                console.log(chalk.yellow.bold(`====================================================================================`));
                console.log(chalk.greenBright(`Role successfully created!`));
                console.log(chalk.yellow.bold(`====================================================================================`));
                viewAllRoles();
              });
            });
        };
      });
    };
  
  // Add a department
  const addDepartment = () => {
      inquirer
        .prompt([
          {
            name: 'newDepartment',
            type: 'input',
            message: 'What is the name of your new Department?',
            validate: validate.validateString
          }
        ])
        .then((answer) => {
          let sql =     `INSERT INTO department (department_name) VALUES (?)`;
          connection.query(sql, answer.newDepartment, (error, response) => {
            if (error) throw error;
            console.log(``);
            console.log(chalk.greenBright(answer.newDepartment + ` Department successfully created!`));
            console.log(``);
            viewAllDepartments();
          });
        });
  };
  
  // Update a role
  const updateEmployeeRole = () => {
      let sql =       `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
                      FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
      connection.promise().query(sql, (error, response) => {
        if (error) throw error;
        let employeeNamesArray = [];
        response.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});
  
        let sql =     `SELECT role.id, role.title FROM role`;
        connection.promise().query(sql, (error, response) => {
          if (error) throw error;
          let rolesArray = [];
          response.forEach((role) => {rolesArray.push(role.title);});
  
          inquirer
            .prompt([
              {
                name: 'chosenEmployee',
                type: 'list',
                message: 'Which employee has a new role?',
                choices: employeeNamesArray
              },
              {
                name: 'chosenRole',
                type: 'list',
                message: 'What is their new role?',
                choices: rolesArray
              }
            ])
            .then((answer) => {
              let newTitleId, employeeId;
  
              response.forEach((role) => {
                if (answer.chosenRole === role.title) {
                  newTitleId = role.id;
                }
              });
  
              response.forEach((employee) => {
                if (
                  answer.chosenEmployee ===
                  `${employee.first_name} ${employee.last_name}`
                ) {
                  employeeId = employee.id;
                }
              });
  
              let sqls =    `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
              connection.query(
                sqls,
                [newTitleId, employeeId],
                (error) => {
                  if (error) throw error;
                  console.log(chalk.greenBright.bold(`====================================================================================`));
                  console.log(chalk.greenBright(`Employee Role Updated`));
                  console.log(chalk.greenBright.bold(`====================================================================================`));
                  promptUser();
                }
              );
            });
        });
      });
    };
  
  // Update an Employee's Manager
  const updateEmployeeManager = () => {
      let sql =       `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id
                      FROM employee`;
       connection.promise().query(sql, (error, response) => {
        let employeeNamesArray = [];
        response.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});
  
        inquirer
          .prompt([
            {
              name: 'chosenEmployee',
              type: 'list',
              message: 'Which employee has a new manager?',
              choices: employeeNamesArray
            },
            {
              name: 'newManager',
              type: 'list',
              message: 'Who is their manager?',
              choices: employeeNamesArray
            }
          ])
          .then((answer) => {
            let employeeId, managerId;
            response.forEach((employee) => {
              if (
                answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`
              ) {
                employeeId = employee.id;
              }
  
              if (
                answer.newManager === `${employee.first_name} ${employee.last_name}`
              ) {
                managerId = employee.id;
              }
            });
  
            if (validate.isSame(answer.chosenEmployee, answer.newManager)) {
              console.log(chalk.redBright.bold(`====================================================================================`));
              console.log(chalk.redBright(`Invalid Manager Selection`));
              console.log(chalk.redBright.bold(`====================================================================================`));
              promptUser();
            } else {
              let sql = `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`;
  
              connection.query(
                sql,
                [managerId, employeeId],
                (error) => {
                  if (error) throw error;
                  console.log(chalk.greenBright.bold(`====================================================================================`));
                  console.log(chalk.greenBright(`Employee Manager Updated`));
                  console.log(chalk.greenBright.bold(`====================================================================================`));
                  promptUser();
                }
              );
            }
          });
      });
  };
  
  // Delete an Employee
  const removeEmployee = () => {
      let sql =     `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;
  
      connection.promise().query(sql, (error, response) => {
        if (error) throw error;
        let employeeNamesArray = [];
        response.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});
  
        inquirer
          .prompt([
            {
              name: 'chosenEmployee',
              type: 'list',
              message: 'Which employee would you like to remove?',
              choices: employeeNamesArray
            }
          ])
          .then((answer) => {
            let employeeId;
  
            response.forEach((employee) => {
              if (
                answer.chosenEmployee ===
                `${employee.first_name} ${employee.last_name}`
              ) {
                employeeId = employee.id;
              }
            });
  
            let sql = `DELETE FROM employee WHERE employee.id = ?`;
            connection.query(sql, [employeeId], (error) => {
              if (error) throw error;
              console.log(chalk.redBright.bold(`====================================================================================`));
              console.log(chalk.redBright(`Employee Successfully Removed`));
              console.log(chalk.RedBright.bold(`====================================================================================`));
              viewAllEmployees();
            });
          });
      });
    };
