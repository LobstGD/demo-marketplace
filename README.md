# Live Stream: [https://demo-marketplace-tau.vercel.app](https://demo-marketplace-tau.vercel.app)  
**Note:** The live demo is temporarily unavailable. To get access or enable the live demo, please contact the creator at **denisjr229@gmail.com**.

# MarketPlace Project

MarketPlace is a full-featured e-commerce platform built with modern web technologies. It allows users to browse products, add them to a shopping cart, place orders, and even interact with a support chatbot. The project is designed to be scalable, user-friendly, and easy to extend.

---

## Features

- **Product Catalog:** Browse and search for products.  
- **Sorting and Filtering:** Sort products by price, popularity, or category.  
- **Shopping Cart:** Add products to your cart and manage quantities.  
- **Order Placement:** Complete orders directly from the platform.  
- **Chatbot Support:** Interact with a customer support chatbot for quick help.  
- **Responsive UI:** Works seamlessly on both desktop and mobile devices.  

---

## Technologies Used

- **Frontend:** Vite + React, React Router for SPA navigation  
- **Backend:** Spring Boot (Java 26) with RESTful API  
- **Database:** PostgreSQL  
- **ORM:** Hibernate JPA  
- **Authentication:** Spring Security (JWT or session-based)  
- **Email Notifications:** Integrated with Gmail SMTP  
- **Payments:** YooMoney API integration  
- **Docker & Render:** Containerized deployment for backend and database  
- **Version Control:** GitHub for code management  

---

## Getting Started

### Prerequisites

- Java 26 (or compatible)  
- Maven 3.x  
- Node.js 18+ and npm  
- PostgreSQL (or use Render Postgres instance)  
- Docker (optional, for local containerized setup)  

### Installation

1. Clone the repository:

git clone https://github.com/LobstGD/demo-marketplace.git

2. Navigate to the backend folder and build the project:

cd marketplace-back
mvn clean package

3. Set environment variables (example .env or application.properties):

SPRING_DATASOURCE_URL=jdbc:postgresql://<DB_HOST>:<DB_PORT>/<DB_NAME>
SPRING_DATASOURCE_USERNAME=<DB_USER>
SPRING_DATASOURCE_PASSWORD=<DB_PASSWORD>

4. Start the backend:

java -jar target/market-place.jar

5. Navigate to the frontend folder:

cd ../marketplace-front
npm install
npm run dev

Deployment

- Backend is deployed on Render.

- Frontend is deployed on Vercel.

To deploy locally with Docker Compose:

docker-compose up --build

Contact

For questions, issues, or access to the live demo, contact Denis Jr at denisjr229@gmail.com
