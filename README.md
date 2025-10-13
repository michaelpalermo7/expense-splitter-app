# OWELY: Full-Stack Expense Splitter 
A web application that helps groups or roommates split shared expenses easily and fairly. 

## Live Demo
Frontend (Vercel): https://owely.io/  
Backend (Render): https://owely-backend.onrender.com  

> The frontend is deployed on **Vercel**, and the backend API is hosted on **Render**.  
> Changes pushed to the `main` branch are automatically deployed through GitHub Actions CI/CD.

## Table of Contents 
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Usage](#usage)

## About 
The **Expense Splitter App** allows users to log shared expenses and automatically calculates who owes whom. Perfect for roommates, travel groups, or anyone managing shared costs. 

## Features 
- Create groups or households
- Add multiple participants
- Log expenses with descriptions and payers
- Automatically calculate how much each person owes or is owed
- View balance summaries
- Persistent data storage with backend API

## Tech Stack 
| Layer | Technology | 
|-------|-------------| 
| **Frontend** | React + TailwindCSS | 
| **Backend** | Spring Boot | 
| **Database** | PostgreSQL | 
| **Containerization** | Docker + Docker Compose | 
| **Version Control** | Git + GitHub | 
| **CI/CD** | Github Actions Workflow | 

## Backend Details
- **Framework:** Spring Boot 3 (RESTful API)
- **Persistence:** Spring Data JPA with Hibernate ORM  
- **Database:** PostgreSQL  
- **Migrations:** Managed with Flyway
- **Testing** JUnit 5 for unit testing + Spring Boot Test for integration testing
- **Build Tool:** Maven  
- **Deployed on:** Render (Dockerized service)

## Getting Started Prerequisites: Ensure you have installed: 
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Java 17+](https://adoptium.net/)
- [Maven](https://maven.apache.org/)

### Clone the Repository
```bash
git clone https://github.com/michaelpalermo7/expense-splitter-app.git
cd expense-splitter-app
```

## Run with Docker (Recommended)
```bash
docker-compose up --build
```
This will start: 
- Backend API at http://localhost:8080
- PostgreSQL Database on port 5432

## Manual Setup 
Backend (Spring Boot)
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables Backend (application.properties or .env)
```properties
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/expense_splitter
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_db_password
JWT_SECRET=your_secret_key
SERVER_PORT=8080
```

## Usage
- Start backend and frontend (or use Docker). 
- Open the app at http://localhost:3000.
- Create a group and add participants.
- Add expenses and track balances.
