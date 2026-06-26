# 🍔 Swiggy Clone - Full Stack Food Ordering Application

A full-stack food ordering web application developed using **React.js**, **Spring Boot**, and **MySQL**. The application allows users to browse food items, manage carts, and perform CRUD operations through REST APIs.

---

# 🚀 Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript (ES6)
- Axios
- Bootstrap

### Backend
- Java
- Spring Boot
- Spring MVC
- Spring Data JPA
- Maven

### Database
- MySQL

---

# 📁 Project Structure

```
Swiggy-Final/
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── mvnw
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

---

# ✅ Prerequisites

Make sure the following software is installed before running the project.

- Java 17 (or the version used in the project)
- Maven
- Node.js
- npm
- MySQL
- Git
- VS Code / IntelliJ IDEA / Eclipse

---

# 📥 Clone the Repository

```bash
git clone https://github.com/<your-username>/<repository-name>.git
```

Navigate to the project folder.

```bash
cd Swiggy-Final
```

---

# ⚙️ Backend Setup

### Navigate to the backend folder

```bash
cd backend
```

### Install Maven dependencies

```bash
mvn clean install
```

### Run the Spring Boot application

```bash
mvn spring-boot:run
```

Or, if using the Maven Wrapper:

```bash
./mvnw spring-boot:run
```

For Windows:

```bash
mvnw.cmd spring-boot:run
```

The backend server starts on:

```
http://localhost:8080
```

---

# 💻 Frontend Setup

Open a new terminal.

Navigate to the frontend folder.

```bash
cd frontend
```

### Install dependencies

```bash
npm install
```

### Start the React application

```bash
npm start
```

The frontend starts on:

```
http://localhost:3000
```

---

# 📦 Required Configuration Files

## Backend

- `pom.xml`
- `application.properties`
- `mvnw`
- `mvnw.cmd`

## Frontend

- `package.json`
- `package-lock.json`

---

# 🔄 Build Commands

## Backend

```bash
mvn clean install
```

Create JAR

```bash
mvn package
```

Run JAR

```bash
java -jar target/<project-name>.jar
```

---

## Frontend

Create Production Build

```bash
npm run build
```

Run Development Server

```bash
npm start
```

---

# 📚 API Communication

The React frontend communicates with the Spring Boot backend using **Axios** and **REST APIs**.

```
React UI
      │
      ▼
Axios HTTP Requests
      │
      ▼
Spring Boot REST APIs
      │
      ▼
MySQL Database
```

---

# 🛠️ Common Commands

### Install Backend Dependencies

```bash
mvn clean install
```

### Start Backend

```bash
mvn spring-boot:run
```

### Install Frontend Dependencies

```bash
npm install
```

### Start Frontend

```bash
npm start
```

### Build React App

```bash
npm run build
```

### Clean Maven Project

```bash
mvn clean
```

---

# 📌 Features

- Browse food items
- Add food to cart
- Update cart quantity
- Remove food from cart
- REST API Integration
- Responsive UI
- CRUD Operations
- MySQL Database Integration

---

# 👨‍💻 Author

**Sam Jeban**

Java Full Stack Developer

---

# 📄 License

This project is intended for learning and educational purposes.
