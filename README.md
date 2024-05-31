# Blackjack Card Game

## Table of Contents

- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)

## Introduction

This project is a full-stack implementation of a Blackjack card game. The backend is a REST API built with Node.js, Express, and Sequelize, while the frontend is a web application developed using Vanilla JavaScript. The goal is to provide a fun and interactive experience for users to play Blackjack.

## Project Structure

The project is organized into two main directories:

- **backend:** Contains the server-side code, managing game logic, player data, and database interactions.
- **frontend:** Contains the client-side code, responsible for the user interface and interaction with the backend API.

Each directory has its own README.md with detailed information about the respective part of the application.

### Backend

The backend part is implemented using Node.js and Express, with Sequelize for ORM. It provides various endpoints for player management and game operations. For more details, refer to the [Backend README](backend/README.md).

### Frontend

The frontend part is built with Vanilla JavaScript and uses Bootstrap for styling and Parcel for bundling. It communicates with the backend through REST API calls to provide a seamless gaming experience. For more details, refer to the [Frontend README](frontend/README.md).

## Getting Started

To get started with the development environment, follow these steps:

### Prerequisites

Ensure you have the following installed:

- Node.js v20.13.1
- npm v10.5.2

### Clone the Repository

```bash
git clone https://github.com/caiquelemos/blackjack-game.git
cd blackjack-game
```

### Setup Backend

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm run start:dev
   ```

### Setup Frontend

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Running the Application

Once both backend and frontend are set up and running, you can access the application by opening your web browser and navigating to `http://localhost:1234` (or the port specified in the frontend configuration).
