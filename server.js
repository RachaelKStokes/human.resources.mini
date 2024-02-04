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