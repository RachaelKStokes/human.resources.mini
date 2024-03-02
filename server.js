'use strict'

//import necessary packages
const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

const db = mysql.createConnection({
    database: 'employees',
    user: 'root',
    password: '',
    host: 'localhost'
});

const prompt = inquirer.createPromptModule();

//Options menu
const start = () => {
    prompt({
        message: 'Please select an option',
        type: 'list',
        name: 'view',
        choices: [
            'View All Employees',
            'View All Roles',
            'View All Departments',
            'View All Employees By Department',
            'Update Employee Role',
            'Update Employee Manager',
            'Add Employee',
            'Add Department',
            'Add Role',
            'Remove Employee',
            'Exit'
        ]
    }).then(answers => {
        console.log(answers)
        const choices  = answers.view;
        console.log(choices)
        if (choices === 'View All Employees') {
            showEmployees();
        }

        if (choices === 'View All Roles') {
            showRoles();
        }

        if (choices === 'View All Departments') {
            showDepartments();
        }

        if (choices === 'View All Employees By Department') {
            showEmployeesByDept();
        }

        if (choices === 'Update Employee Role') {
            updateEmployee();
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
            db.end();
        }
    });
};

//Options pages------------

//View roles

const showEmployees = () => {
    let sql = `SELECT employee.first_name, employee.last_name, employee.role_id, role.title, salary 
                FROM employee, role
                WHERE employee.role_id = role.id
                ORDER BY employee.first_name ASC`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        start();
    });
};

// View all roles

const showRoles = () => {
    const sql = `SELECT role.id, role.title, role.salary, department.name
                 FROM role
                 INNER JOIN department ON role.department_id = department.id`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        start();
    })
};

// View all departments

const showDepartments = () => {
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        start();
    });
};

// View all employees by dept

const showEmployeesByDept = () => {
    const sql = `SELECT employee.first_name, 
                        employee.last_name, 
                        department.name AS department
                 FROM employee 
                 LEFT JOIN role ON employee.role_id = role.id 
                 LEFT JOIN department ON role.department_id = department.id`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        start();
    });
};

// Add an employee

const addEmployee = () => {
    prompt([
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
            }
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

            db.query(roleSql, (err, data) => {
                if (err) throw err;

                const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                prompt([
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

                        db.query(managerSql, (err, data) => {
                            if (err) throw err;

                            const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

                            prompt([
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

                                    db.query(sql, params, (err, result) => {
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

// Add a New Role

const addRole = () => {
    prompt([
        {
            type: 'input',
            name: 'role',
            message: "What role do you want to add?",
            validate: addRole => {
                if (addRole) {
                    return true;
                } else {
                    console.log('Please enter a role');
                    return false;
                }
            }
        }, {
            type: 'input',
            name: 'salary',
            message: "Please enter the salary for this role",
            validate: addSalary => {
                if (isNAN(addSalary)) {
                    return true;
                } else {
                    console.log('Please enter a salary');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const params = [answer.role, answer.salary];
            const roleSql = `SELECT name, id FROM department`;

            db.query(roleSql, (err, data) => {
                if (err) throw err;

                const dept = data.map(({ name, id }) => ({ name: name, value: id }));

                prompt([
                    {
                        type: 'list',
                        name: 'dept',
                        message: "Please select a department for this role",
                        choices: dept
                    }
                ])
                    .then(deptChoice => {
                        const dept = deptChoice.dept;
                        params.push(dept);

                        const sql = `INSERT INTO role (title, salary, department_id)
                        VALUES (?, ?, ?)`;

                        db.query(sql, params, (err, result) => {
                            if (err) throw err;
                            console.log('Added' + answer.role + " to roles");

                            showRoles();
                        });
                    });
            });
        });
};

// Add a department
const addDepartment = () => {
    prompt([
        {
            type: 'input',
            name: 'addDept',
            message: "Please enter the new department",
            validate: addDept => {
                if (addDept) {
                    return true;
                } else {
                    console.log('Please enter a department');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const sql = `INSERT INTO department (name)
                    VALUES (?)`;
            db.query(sql, answer.addDept, (err, result) => {
                if (err) throw err;
                console.log('Added ' + answer.addDept + " to departments");

                showDepartments();
            });
        });
};

// Update an employee role

const updateEmployee = () => {
    const employeeSql = `SELECT * FROM employee`;

    db.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employees
            }
        ])
            .then(empChoice => {
                const employee = empChoice.name;
                const params = [];
                params.push(employee);

                const roleSql = `SELECT * FROM role`;

                db.query(roleSql, (err, data) => {
                    if (err) throw err;

                    const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                    prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: "What is the employee's new role?",
                            choices: roles
                        }
                    ])
                        .then(roleChoice => {
                            const role = roleChoice.role;
                            params.push(role);

                            let employee = params[0]
                            params[0] = role
                            params[1] = employee

                            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                            db.query(sql, params, (err, result) => {
                                if (err) throw err;
                                console.log("Employee role has been updated");

                                showEmployees();
                            });
                        });
                });
            });
    });
};



// Delete an employee
const removeEmployee = () => {

    const employeeSql = `SELECT * FROM employee`;

    db.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        prompt([
            {
                type: 'list',
                name: 'name',
                message: "Select an employee to remove",
                choices: employees
            }
        ])
            .then(empChoice => {
                const employee = empChoice.name;

                const sql = `DELETE FROM employee WHERE id = ?`;

                db.query(sql, employee, (err, result) => {
                    if (err) throw err;
                    console.log("Employee removed successfully");

                    showEmployees();
                });
            });
    });
};

start();