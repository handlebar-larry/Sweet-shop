
#  Sweet Shop Management System – Backend

This repository contains the **backend** of the Sweet Shop Management System, built with **Node.js, Express.js, and MongoDB**.  
It provides APIs for user authentication, sweet management, and inventory operations.

---

## Features

### User Features
- **Authentication:** Users can register, log in, and log out securely using **JWT-based authentication**.
- **Dashboard:** User-specific dashboard showing available sweets (admin or user).
- **Search & Filter:** Users can search sweets by **name, category, or price**.
- **Purchase:** Users can purchase sweets by specifying quantity.  

### Admin Features
- **Dashboard:** Admin-specific dashboard for managing the shop.
- **CRUD Operations:** Admins can **add, delete, update, and restock sweets**.
- **Inventory Management:** Track sweet quantities and ensure stock availability.
- **All User Features:** Admins can also search and purchase sweets like normal users.

---
## AI Usage with ChatGPT

During development, **ChatGPT (AI)** was used as a tool to accelerate the initial setup and design of the Sweet Shop Management System. It helped in the following ways:

1. **Backend Skeleton Generation**
   - ChatGPT provided the **initial structure** for the backend, including:
     - Setting up Express routes for CRUD operations on sweets.
     - Creating Mongoose schemas for the sweets and users.
     - Structuring controller files with placeholder functions.
   - This allowed me to focus on implementing the **actual logic** such as purchase handling, quantity validation, and authentication rather than boilerplate setup.

2. **Frontend Skeleton Design**
   - ChatGPT assisted in generating the **basic React component structure**, including:
     - Dashboard layouts for both user and admin.
     - SweetCard component to display sweets.
     - Routing with React Router.
     - Initial popup design for actions like purchase or restock.
   - AI suggested **component hierarchy and styling** with Tailwind CSS, giving a clean starting point for the UI.

3. **Code Examples & Guidance**
   - ChatGPT provided examples of:
     - Handling form inputs and popups.
     - Making API calls with axios.
     - Conditional rendering based on user roles (admin vs user).
   - These examples were **adapted and customized** by me to implement project-specific logic, like securely handling JWT, validating purchase quantities, and updating the database.

4. **Testing Assistance**
   - ChatGPT suggested **test structures and approaches** using Jest:
     - How to test React components (unit tests for SweetCard, popups).
     - How to test backend routes using Supertest.
     - How to implement **Red-Green-Refactor cycle** for TDD.
   - I wrote all the actual test cases and logic myself, ensuring the tests fit my application.

5. **Role of AI**
   - ChatGPT acted as a **development assistant**, saving time on boilerplate code, best practices, and design patterns.
   - **All functional logic, authentication, purchase/restock calculations, and integration with the database were implemented manually.**
   - AI helped with **ideas, structure, and examples**, but the system’s business logic is my own work.

**In summary:** AI with ChatGPT was used as a scaffolding and guidance tool to speed up development and ensure proper structure, but every functional feature, database interaction, and security measure was independently designed and implemented.  


---

## Authentication

- **JWT-based authentication** is used for both users and admins.
- Tokens are securely stored in cookies with proper handling.
- Different dashboards are rendered based on user role (`user` vs `admin`).

---

## Technology Stack

- **Frontend:** React.js, Tailwind CSS, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, Cookies
- **Testing:** Jest

---

## Testing (TDD Approach)

The backend was developed following the **RED → GREEN → REFACTOR** cycle:

### RED – Write Failing Tests
- Created routes for `user` and `sweet` without controllers.  
- Tests failed as expected.  

---

### GREEN – Make Tests Pass
- Implemented controllers for user and sweet routes.  
- All tests passed successfully.  

---

### REFACTOR – Improve Code
- Refined and cleaned up controller logic.  
- Improved maintainability and readability.  
- Ensured consistent folder structure (`routes/`, `controllers/`, `models/`).

---

## How to Clone & Run the Backend

Follow these steps to set up the backend locally:

1. Clone the repository  
2. cd SweetCorner_Backend
3. npm install
4. add MONGOURL,JWT_SECRET,PORT,BACKEND_URL,FRONTEND_URL to your .env file
5. npm run dev


