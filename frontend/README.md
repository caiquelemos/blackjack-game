# Blackjack Card Game - Frontend Part

## Table of Contents

- [Introduction](#introduction)
- [Frontend Architecture](#frontend-architecture)
- [Dependencies](#dependencies)
- [Design Decisions](#design-decisions)
- [Available Scripts](#available-scripts)

## Introduction

Welcome to the Blackjack game frontend! This project is a web-based implementation of the popular card game Blackjack, providing a fun and interactive experience for users. The frontend is built using Vanilla JavaScript and integrates seamlessly with a REST API backend to manage game logic and player data.

## Frontend Architecture

The architecture of the frontend is designed to be modular and maintainable. The key components and their interactions are as follows:

- **HTML Structure:** The `index.html` file provides the basic structure of the application, including modals for user interactions and sections for displaying game information.
- **CSS Styling:** The `styles.css` file in the `css` directory contains the styles for the application, ensuring a responsive and visually appealing interface.
- **JavaScript Modules:** The JavaScript functionality is divided into several modules:
  - `api.js`: Handles API calls to the backend.
  - `components.js`: Manages UI components like modals and card elements.
  - `helpers.js`: Contains utility functions for rendering the game and handling errors.
  - `index.js`: The main entry point, initializing the application and setting up event listeners.
- **Environment Variables:** The `.env` file in the root directory is used to define the environment variables like for example the `API_BASE_URL`.

## Dependencies

- **Bootstrap:** Used for styling the application and providing a responsive layout. The decision to use Bootstrap was based on its widespread adoption, ease of use, and comprehensive set of components.
- **Parcel:** Used for bundling the application. Parcel was chosen for its simplicity and zero-configuration setup, making it easy to get started and maintain.
- **dotenv:** Used to manage environment variables. This ensures that the API base URL and other configurations are easily managed.
- **Jest:** Used for unit testing. Jest provides a powerful testing framework with built-in mocking and assertions, making it ideal for testing JavaScript applications.
- **@testing-library/dom & @testing-library/jest-dom:** Used for DOM testing and assertions, providing utilities to interact with and assert on the DOM.

## Design Decisions

- **Modular JavaScript:** The decision to split the JavaScript code into multiple modules (api.js, components.js, helpers.js, and index.js) was made to enhance maintainability and readability. Each module has a specific responsibility, adhering to the single responsibility principle.
- **Bootstrap:** Provides a consistent and responsive design with minimal effort. The decision to use Bootstrap ensures that the UI is modern and accessible across different devices and screen sizes.
- **Parcel:** Chosen for its simplicity and performance. Parcel's zero-config bundling simplifies the development workflow.
- **Jest and Testing Library:** Ensures that the application is robust and free of bugs. The use of Jest and Testing Library for unit and integration tests provides confidence in the code's correctness and reliability.

## Available Scripts

- **npm start:** Starts the development server using Parcel. This script is used during development to serve the application with hot module replacement.
- **npm build:** Builds the application for production. This script bundles the JavaScript, CSS, and other assets into optimized files for deployment.
- **npm test:** Runs all tests.
- **npm run test:unit:** Runs unit tests.
- **npm run test:integration:** Runs integration tests.
- **npm run test:coverage:** Runs tests and generates a coverage report.
