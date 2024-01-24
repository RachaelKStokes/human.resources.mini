const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

const db = mysql.createConnection({
    database: 'employees',
    user: 'root',
}, () => console.log('connected'));

const prompt = inquirer.createPromptModule();

prompt({
    message: 'Please select an option',
    type: 'rawlist',
    name: 'view',
    choices: [
        'View All Employees',
    ]
}).then((answers) => {
    console.log(answers);
});