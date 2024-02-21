INSERT INTO department(name)
VALUES("Engineering"), 
      ("Operations"), 
      ("Sales"), 
      ("Marketing"), 
      

INSERT INTO role(title, salary, department_id)
VALUES("Engineer", 80000, 1), 
      ("Senior Engineer", 150000, 1), 
      ("Operations Analyst", 70000, 2), 
      ("Sales Associate", 60000, 3),
      ("Sales Manager", 120000, 3),
      ("Marketing Associate", 35000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Rick', 'Randall', 1, 2, NULL), 
       ('Roberta', 'Rose', 1, 1, 1), 
       ('Rachael', 'Roper', 2, 2, NULL), 
       ('Renaldo', 'Riviera', 3, 1, 5), 
       ('Reba', 'Radcliffe', 3, 2, NULL),
       ('Randy', 'Rogers', 4, 1, NULL);







       