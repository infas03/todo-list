
# Task-Management-System

This role-based application enables administrators to create and manage employee accounts. Employees receive personalized dashboards where they can create, update, and delete tasks, modify statuses and monitor deadlines.

## Features

- **Light/dark mode toggle**
- **Login screen**

#### Admin Side:
- **Log in**: Admin can log in to their accounts.
- **Add employees**: Admin can add new employees to the system.

#### User Side:
- **Log in**: Employees can log in to their accounts.
- **View to-do list**: Employees can view their personalized task list.
- **Add Task**: Employees can add their personalized task.
- **Update Task**: Employees can update their personalized task.
- **Update task status**: Employees can update the status of their assigned tasks.
- **View deadlines**: Employees can see the deadlines for each task.


## Demo

https://todo-list-pi-ten-59.vercel.app

## Optimizations

### Frontend Optimizations:
- **Authentication Management**: Correctly managed authentication providers to ensure secure login and session handling.
- **API Maintenance**: Properly structured API calls and handled them efficiently to reduce redundant requests.
- **Project Structure**: Ensured the frontend project is structured for scalability and maintainability, adhering to best practices for folder and component organization.
- **Architecture**: Followed a clean and modular architecture to separate concerns, ensuring easy extensibility and testing.

### Server-Side Optimizations:
- **Code Structure**: Correctly structured server-side code to improve maintainability and scalability. Organized routes, controllers, and models for clarity and performance.
- **Authentication & Authorization**: Implemented secure authentication and authorization using JWT, ensuring only authorized users can access protected resources.
- **API Authorization**: Handled API authorization to ensure that users can only access the data and resources they are authorized for, providing a secure environment.


## Run Locally Client

Clone the project

```bash
  git clone https://github.com/infas03/todo-list.git
```

Go to the client file

```bash
  cd client
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

Run test

```bash
  npm run test
```

## Run Locally Server

Go to the server file

```bash
  cd server
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

Run test

```bash
  npm run test
```
## Authors

- [@Infas03](https://www.github.com/infas03)


## Features


- **Light/dark mode toggle**
- **Login screen**
#### Admin Side:
- **Log in**: Admin can log in to their accounts.
- **Add employees**: Admin can add new employees to the system.
- **Assign tasks**: Admin can assign tasks to employees.

#### Employee Side:
- **Log in**: Employees can log in to their accounts.
- **View to-do list**: Employees can view their personalized task list.
- **Update task status**: Employees can update the status of their assigned tasks.
- **View deadlines**: Employees can see the deadlines for each task.


## Demo

https://to-do-infas.vercel.app

## Optimizations

### Frontend Optimizations:
- **Authentication Management**: Correctly managed authentication providers to ensure secure login and session handling.
- **API Maintenance**: Properly structured API calls and handled them efficiently to reduce redundant requests.
- **Project Structure**: Ensured the frontend project is structured for scalability and maintainability, adhering to best practices for folder and component organization.
- **Architecture**: Followed a clean and modular architecture to separate concerns, ensuring easy extensibility and testing.

### Server-Side Optimizations:
- **Code Structure**: Correctly structured server-side code to improve maintainability and scalability. Organized routes, controllers, and models for clarity and performance.
- **Authentication & Authorization**: Implemented secure authentication and authorization using JWT, ensuring only authorized users can access protected resources.
- **API Versioning**: Managed API versioning to ensure backward compatibility and smooth updates to the system without disrupting users.
- **API Authorization**: Handled API authorization to ensure that users can only access the data and resources they are authorized for, providing a secure environment.


## Run Locally

Clone the project

```bash
  git clone https://github.com/infas03/to-do-infas.git
```

Go to the client file

```bash
  cd client
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

Go to the server file

```bash
  cd server
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```
## API Reference

#### Register a new user
POST /api/auth/register
- `name`: **Required**. The user's name
- `email`: **Required**. The user's email address
- `password`: **Required**. The user's password

#### Login a user
POST /api/auth/login
- `email`: **Required**. The user's email address
- `password`: **Required**. The user's password

#### Get all users
GET /api/auth/users
- `api_key`: **Required**. Your API key

#### Update user information
PATCH /api/auth/users/${id}
- `id`: **Required**. The user ID to update
- `email`: **Optional**. New email for the user
- `name`: **Optional**. New name for the user
- `password`: **Optional**. New password for the user

#### Delete a user
DELETE /api/auth/users/${id}
- `id`: **Required**. The user ID to delete

#### Create a task
POST /api/tasks
- `title`: **Required**. The title of the task
- `description`: **Required**. The description of the task
- `due_date`: **Required**. The due date of the task

#### Get all tasks
GET /api/tasks
- `api_key`: **Required**. Your API key

#### Get a task by ID
GET /api/tasks/${id}
- `id`: **Required**. The ID of the task to fetch

#### Update a task
PATCH /api/tasks/${id}
- `id`: **Required**. The ID of the task to update
- `title`: **Optional**. The new title of the task
- `description`: **Optional**. The new description of the task
- `due_date`: **Optional**. The new due date of the task
- `status`: **Optional**. The new status of the task
- `priority`: **Optional**. The new priority of the task
- `dependencies`: **Optional**. The new dependencies of the task
- `recurrence`: **Optional**. The new recurrence of the task

#### Delete a task
DELETE /api/tasks/${id}
- `id`: **Required**. The ID of the task to delete

## Authors

- [@Infas03](https://www.github.com/infas03)

