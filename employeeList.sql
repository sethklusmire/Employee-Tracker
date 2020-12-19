DROP DATABASE IF EXISTS employee_trackerDB;
CREATE DATABASE employee_trackerDB;
USE employee_trackerDB;

CREATE TABLE department (
id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
dept_name VARCHAR(30)
);

CREATE TABLE company_role (
id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
title VARCHAR(30),
salary DECIMAL(10,2) NULL,
department_id INT
);

CREATE TABLE employee (
id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT,
manager_id INT
);

INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Sean", "Armstrong", 2, 1), ("Tad", "Darmstrong", 3, null), ("Clark", "Flarmstrong", 5, null);
INSERT INTO department(dept_name) VALUES("Sales"), ("Tech"), ("Legal");
INSERT INTO company_role(title, salary, department_id) VALUES("Sales Lead", 50000, 1), ("Sales Staff", 34000, 1), ("Tech Lead", 65000, 2), ("Tech Staff", 45000, 2), ("Legal Lead", 60000, 3), ("Legal Staff", 50000, 3);

SELECT * FROM department;
SELECT * FROM employee;
SELECT * FROM company_role;
