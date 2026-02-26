KnowledgeDock – Backend

Node.js + Express + MySQL API Server

The backend of KnowledgeDock provides a secure RESTful API for managing users, articles, authentication, and AI-assisted features. It follows the MVC architecture pattern and implements JWT-based authentication with strict authorization checks.



Tech Stack --

* Node.js

* Express.js

* MySQL

* JWT (jsonwebtoken)

* bcrypt

* dotenv

* CORS

AI Integration Layer:

OpenAI-ready service abstraction (Mocked for submission)





Architecture Overview --

The backend follows the MVC (Model-View-Controller) pattern to ensure separation of concerns and maintainability.

backend/
│
├── config/         # Database configuration
├── controllers/    # Business logic
├── routes/         # Route definitions
├── models/         # Database queries
├── middleware/     # Authentication & error handling
├── services/       # AI service layer
└── server.js       # Application entry point


Design Decisions:

* RESTful API structure

* Middleware-based JWT verification

* Centralized error handling

* AI service abstraction for easy integration

* Ownership validation for article modification




Authentication & Authorization --

Authentication :

* JWT token generated upon login

* Password hashing using bcrypt

* Token verified via middleware


Authorization Logic :

Before updating or deleting an article:

if (article.author_id !== req.user.id) {
  return res.status(403).json({ message: "Unauthorized" });
}

This ensures only the article author can modify content.





Key API Endpoints--

Authentication :

Method		Endpoint		Description
POST		/api/auth/signup	Register user
POST		/api/auth/login		Login user

Articles :

Method		Endpoint		Description
GET		/api/articles		Get all articles
GET		/api/articles/:id	Get single article
POST		/api/articles		Create article (Auth required)
PUT		/api/articles/:id	Update article (Author only)
DELETE		/api/articles/:id	Delete article (Author only)






AI Service Layer --

The backend contains a modular AI service located in:

services/aiService.js


It provides:

* improveContent()

* generateSummary()

* suggestTags()

Note: Mock responses are currently used for submission purposes.
The service is fully structured for real OpenAI API integration by simply adding a valid API key in the .env file.




Database Schema --

Users Table :

* id

* username

* email

* password (hashed)

* created_at


Articles Table :

* id

* title

* content

* summary

* category

* tags

* author_id (Foreign Key → Users.id)

* created_at

* updated_at




Setup Instructions --

1. Install Dependencies

npm install

2️. Configure Environment Variables

Create .env file:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=knowledgedock
JWT_SECRET=your_secret_key
OPENAI_API_KEY=mock-key

3. Start Server

npm run dev

or

node server.js

Server runs on:

http://localhost:5000



Future Improvements --

* Live OpenAI API integration

* Pagination support

* Rate limiting middleware

* Logging system