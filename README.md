# ✨🥜 Toohak 🥜✨

Toohak is a quiz game platform inspired by Kahoot, built as part of a backend-focused project. It enables admins to create and manage quizzes, while players can join and compete interactively. The project provides a REST API for frontend integration.

## 📖 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Setup and Installation](#️-setup-and-installation)
- [Usage](#-usage)
- [Future Plans](#-future-plans)

## 🌈 Overview
Toohak gamifies quizzes to enhance student engagement during lectures and tutorials. Built as a backend service, it allows:
- Admins to create, update, and manage quizzes.
- Players to join quizzes via a game code and participate interactively.
- Full compatibility with a frontend for seamless integration.

## 🛠 Features
### Admin Features:
- **User Authentication**: Secure login and session management.
- **Quiz Management**: Create, edit, delete, and view quizzes.
- **Game Control**: Manage quiz sessions, including question states and leaderboard generation.

### Player Features:
- **Join Quizzes**: Enter a game code to participate.
- **Real-Time Interaction**: Submit answers and view results in real time.

### Backend Features:
- **REST API**: A robust API following a predefined interface.
- **Data Persistence**: Store and retrieve user and quiz data reliably.
- **Session Management**: Secure token-based authentication.

## 💻 Tech Stack
- **Backend Framework**: Node.js with Express.js
- **Database**: JSON-based data storage (iteration 2) and persistent state handling
- **Languages**: TypeScript
- **APIs**: RESTful APIs
- **Testing**: Jest for unit and integration tests
- **Deployment**: Vercel

## ⚙️ Setup and Installation

### Prerequisites:
- Node.js (v16+ recommended)
- npm or yarn

### Steps:
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm start
   ```
4. **Run tests**:
   ```bash
   npm test
   ```
5. **Lint the code**:
   ```bash
   npm run lint
   ```

## 🚀 Usage

### Endpoints
Toohak exposes RESTful endpoints for admins and players. Example routes include:

#### Admin Routes:
- `POST /v1/admin/auth/register`: Register a new admin user.
- `POST /v1/admin/quiz`: Create a new quiz.
- `DELETE /v1/admin/quiz/{quizId}`: Delete an existing quiz.

#### Player Routes:
- `POST /v1/player/join`: Join a quiz using a game code.
- `POST /v1/player/answer`: Submit an answer for a question.

For detailed API documentation, refer to the Swagger spec in `swagger.yaml`.

### Running with Frontend
1. Clone the frontend repository (if available).
2. Start the backend server using `npm start`.
3. Configure the frontend to connect to the backend server's URL.
