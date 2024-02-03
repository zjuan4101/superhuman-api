# Superhuman API
## Introduction
The Superhuman API allows you to manage superhuman entities with various abilities and attributes.

## Prerequisites
Make sure you have the following installed on your machine:

- Node.js
- npm (Node Package Manager)

## Installation
1. Clone the repository:
```
git clone https://github.com/zjuan4101/superhuman-api.git
```
2. Navigate to the project directory:
```
cd superhuman-api
```
3. Install dependencies:
```
npm i
```

## Configuration
Create a .env file in the root directory of the project.

Add the following environment variables to the .env file:
```
PORT=3000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
```
Replace your-mongodb-connection-string with your MongoDB connection string and your-secret-key with your JWT secret key.
You can create a simple SHA56 hash at [link] (https://emn178.github.io/online-tools/sha256.html)

## Usage
Start the server:
```
npm start
```

Access the API endpoints using your favorite HTTP client or tools like curl or Postman. You'll use localhost:3000/users or localhost:3000/superhumans

## API Endpoints
### Superhuman API
- POST /superhumans: Create a new superhuman.
- GET /superhumans: Get all superhumans.
- GET /superhumans/:id: Get a specific superhuman by ID.
- PUT /superhumans/:id: Update a superhuman by ID.
- DELETE /superhumans/:id: Delete a superhuman by ID.

### User API
- POST /users: Register a new user.
- POST /users/login: Login an existing user.
- GET /users: Get all users.
- GET /users/:id: Get a specific user by ID.
- PUT /users/:id: Update a user by ID.
- DELETE /users/:id: Delete a user by ID.

## Testing
To run tests, use the following command:
```
npm run test
```

## Development
During development, you can use `nodemon` to automatically restart the server when changes are detected. Use the following command:
```
npm run dev
```

To configure Jest for testing, add the following to your `package.json` file:
```json
"scripts": {
  "test": "jest",
  "dev": "nodemon",
  "start": "node server.js"
},
"jest": {
  "testEnvironment": "node"
}
```

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

## Creating a New Repository
If you want to create your own repository for the Superhuman API:

1. Navigate to the directory where you want to initialize the repository.
2. Run the following command to initialize a new Git repository:
```
git init
```
3. Add the remote repository URL using the following command:
```
git remote add origin https://github.com/your-username/superhuman-api.git
```
Replace your-username with your GitHub username.
4. Now you can push your code to the remote repository:
```
git push -u origin main
```
That's it! You've now created a new repository for the Superhuman API.