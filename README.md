# Student Management System

This project is a simple API built with Node.js, Express, JWT, bcryptjs, and dotenv. It simulates a student management system, allowing you to perform operations like login, registration, and managing student information such as grades and approval status.

## Technologies Used

- **Node.js**: JavaScript runtime environment on the server.
- **Express**: Framework for building APIs.
- **JWT (JSON Web Tokens)**: For authentication and authorization.
- **bcryptjs**: For hashing and verifying passwords.
- **dotenv**: To securely load environment variables.

## Prerequisites

- **Node.js** (>=v14.x)
- **npm** (or **yarn**)

## Running the Project

1. Clone the repository to your local machine:
    ```bash
    git clone https://github.com/your-username/repository-name.git
    cd repository-name
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your JWT secret key:
    ```
    JWT_SECRET=your-secret-key
    ```

4. Start the server:
    ```bash
    npm start
    ```

5. The server will be running at [http://localhost:3000](http://localhost:3000).

## API Endpoints

The API provides the following endpoints:

### 1. **User Registration**
   - **POST** `/register`
   - Request body:
     ```json
     {
       "username": "your_username",
       "password": "your_password"
     }
     ```
   - Response:
     ```json
     {
       "message": "User successfully registered."
     }
     ```

### 2. **User Login**
   - **POST** `/login`
   - Request body:
     ```json
     {
       "username": "your_username",
       "password": "your_password"
     }
     ```
   - Response (on success):
     ```json
     {
       "message": "Login successful for user your_username",
       "jwt": "your-jwt-token-here"
     }
     ```

### 3. **List All Students**
   - **GET** `/alunos`
   - Response:
     ```json
     [
       {
         "id": 1,
         "name": "Coringa Movie",
         "ra": "11111",
         "grade1": 9.0,
         "grade2": 4.3
       },
       {
         "id": 2,
         "name": "Literally My Cousin",
         "ra": "22222",
         "grade1": 6.0,
         "grade2": 6.0
       }
     ]
     ```

### 4. **Get Student Details (by ID)**
   - **GET** `/alunos/:id`
   - Response:
     ```json
     {
       "id": 1,
       "name": "Coringa Movie",
       "ra": "11111",
       "grade1": 9.0,
       "grade2": 4.3
     }
     ```

### 5. **Student Grades**
   - **GET** `/alunos/medias`
   - Response:
     ```json
     [
       {
         "name": "Coringa Movie",
         "average": "6.65"
       },
       {
         "name": "Literally My Cousin",
         "average": "6.00"
       }
     ]
     ```

### 6. **Student Approval Status**
   - **GET** `/alunos/aprovados`
   - Response:
     ```json
     [
       {
         "name": "Coringa Movie",
         "status": "failed"
       },
       {
         "name": "Literally My Cousin",
         "status": "passed"
       }
     ]
     ```

### 7. **Add New Student**
   - **POST** `/alunos`
   - Request body:
     ```json
     {
       "id": 4,
       "name": "New Student",
       "ra": "44444",
       "grade1": 8.0,
       "grade2": 7.0
     }
     ```
   - Response:
     ```json
     {
       "message": "Student successfully registered."
     }
     ```

### 8. **Update Student Information**
   - **PUT** `/alunos/:id`
   - Request body:
     ```json
     {
       "name": "Updated Name",
       "grade1": 7.5,
       "grade2": 8.0
     }
     ```
   - Response:
     ```json
     {
       "message": "Student successfully updated."
     }
     ```

### 9. **Delete Student**
   - **DELETE** `/alunos/:id`
   - Response:
     ```json
     {
       "message": "Student successfully deleted."
     }
     ```

## Authentication

To access any route that involves student data (except `/register` and `/login`), you must provide a **valid JWT token**. The token is generated upon login and must be included in the request header as `Authorization: Bearer <your-jwt-token>`.

Example:
```bash
Authorization: Bearer your-jwt-token-here
