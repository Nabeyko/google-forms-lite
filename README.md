# Google Forms Lite

This project is a simplified Google Forms clone created as a test task.

The application allows users to create forms, fill them, and view submitted responses.

Tech stack:
React, TypeScript, Redux Toolkit (RTK Query), React Router, TailwindCSS, Node.js, GraphQL.

Project structure:
The repository is organized as a monorepo with two folders:
client – React application
server – GraphQL API

Features:
Create forms with different question types (text, multiple choice, checkbox, date).
Fill forms and submit answers.
View all submitted responses for a form.

Running the project:

Start the server

cd server
npm install
npm run dev

Start the client

cd client
npm install
npm run dev

The client runs on http://localhost:5173  
The GraphQL server runs on http://localhost:4000

Note:
Data is stored in memory on the server, so it will reset after restarting the server.
