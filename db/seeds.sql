USE employees;

INSERT INTO `department` (name, id)
VALUES ("Engineering", 1), 
       ("Operations", 2), 
       ("Sales", 3), 
       ("Marketing", 4);
      

INSERT INTO `role` (title, id, salary, department_id)
VALUES ("Engineer", 1, 80000, 1), 
       ("Senior Engineer", 2, 150000, 1), 
       ("Operations Analyst", 3, 70000, 2), 
       ("Sales Associate", 4, 60000, 3),
       ("Sales Manager", 5, 120000, 3),
       ("Marketing Associate", 6, 35000, 4);

INSERT INTO `employee` (first_name, last_name, role_id, manager_id)
VALUES ("Rick", "Randall", 1, NULL), 
       ("Roberta", "Rose", 1, 1), 
       ("Rachael", "Roper", 2, NULL), 
       ("Renaldo", "Riviera", 3, 2), 
       ("Reba", "Radcliffe", 3, NULL),
       ("Randy", "Rogers", 4, NULL);







       