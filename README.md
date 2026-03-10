# Google Forms Lite

A simplified Google Forms clone created as a test task.

The application allows users to create forms, fill them, and view submitted responses.

## Tech Stack

Frontend:
- React
- TypeScript
- Redux Toolkit (RTK Query)
- React Router
- TailwindCSS

Backend:
- Node.js
- GraphQL
- In-memory data store

## Project Structure

- client/ → React application
- server/ → GraphQL API
- README.md

## Features

- Create forms with different question types (Text, Multiple Choice, Checkbox, Date)
- Fill forms and submit answers
- View submitted responses

## Running the Project

- Start the server
cd server
npm install
npm run dev

- Start the client
cd client
npm install
npm run dev


Client runs on: http://localhost:5173  
GraphQL server runs on: http://localhost:4000

## Note

Data is stored in memory and resets after server restart.
