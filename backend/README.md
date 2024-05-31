# Blackjack Card Game - Backend Part

## Table of Contents

- [Introduction](#introduction)
- [Backend Architecture](#backend-architecture)
- [Endpoints](#endpoints)
- [Possible Responses](#possible-responses)
- [Dependencies](#dependencies)
- [Design Decisions](#design-decisions)
- [Available Scripts](#available-scripts)

## Introduction

This project implements the backend for a Blackjack game using Node.js, Express, and Sequelize. The goal is to provide a robust API for managing players and games, maintaining a persistent state in the database.

## Backend Architecture

The backend architecture is modularly organized to facilitate maintenance and scalability.

### Component Details

- **Controllers:** Manage the logic of HTTP requests.
- **DAOs (Data Access Objects):** Abstract the logic of database access.
- **Database:** Database configuration.
- **Models:** Define system entities.
- **Routers:** Define API routes.
- **Services:** Contain business logic.

## Endpoints

### Player Endpoints

#### POST /api/v1/player/login

- **Description:** Logs in an existing player or creates a new player.

### Game Endpoints

#### POST /api/v1/game/start

- **Description:** Starts a new game or returns an existing in-progress game.

#### POST /api/v1/game/hit

- **Description:** Adds a card to the player's hand.

#### POST /api/v1/game/stand

- **Description:** Dealer draws cards while under 17 points and while there are cards remaining, then, the winner is announced, and the game ends.

## Possible Responses

- **200 OK:** The request has succeeded.
- **201 Created:** The request has succeeded and a new resource has been created.
- **404 Not Found:** The server can not find the requested resource.
- **500 Internal Server Error:** The server has encountered a situation it doesn't know how to handle.

## Dependencies

- **Node.js:** JavaScript runtime environment.
- **Express:** Web framework for Node.js.
- **Sequelize:** Promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite, and Microsoft SQL Server.
- **SQLite3:** Database engine for SQLite.
- **Cors:** Middleware for enabling CORS (Cross-Origin Resource Sharing) with various options.
- **Nodemon:** Tool for automatically restarting the node application when file changes are detected.
- **Jest:** JavaScript testing framework.
- **Supertest:** Library for testing Node.js HTTP servers.

## Design Decisions

- **Express Framework:** Chosen for its simplicity and flexibility in creating RESTful APIs.
- **Sequelize ORM:** Provides a robust and flexible ORM for handling database operations, supporting multiple database dialects.
- **Modular Architecture:** Organizing the code into routers, controllers, services, DAOs and models to separate concerns, making the codebase more maintainable and scalable.
- **SQLite for Development:** Using SQLite for simplicity and ease of setup during development and testing. Configured to use in-memory storage for tests to ensure test isolation.
- **Jest and Supertest for Testing:** Jest provides a comprehensive testing framework, and Supertest allows for easy testing of HTTP endpoints.

## Available Scripts

- **npm start:** Starts the application.
- **npm run start:dev:** Starts the application with Nodemon for development.
- **npm test:** Runs all tests.
- **npm run test:unit:** Runs unit tests.
- **npm run test:integration:** Runs integration tests.
- **npm run test:coverage:** Runs tests and generates a coverage report.
