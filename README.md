# Backend Specialist Coding Assignment

## Overview
This repository contains a backend service designed for a family photo management application. The service integrates with public APIs and provides user authentication, CRUD operations for managing albums and photos, and efficient data handling.

## Features
- **User Authentication**: Create and authenticate users with a simple authentication mechanism.
- **API Integration**: Seamless integration with public APIs:
  - [Users API](https://jsonplaceholder.typicode.com/users)
  - [User Albums API](https://jsonplaceholder.typicode.com/users/{userId}/albums)
  - [Photos API](https://jsonplaceholder.typicode.com/photos)
- **CRUD Operations**:
  - Create, update, and delete user photos and albums.
  - Fetch albums and photos of other users in read-only mode.
- **Error Handling**: Graceful handling of API errors with meaningful responses.
- **Data Storage**: persistent database to store user-specific data.

## Tech Stack
- **Language**: TypeScript
- **Framework**: Nest.js
- **Database**: PostgreSQL

## Installation
### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 20 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Docker and docker compose

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/rodrigotmuniz/family-photo-management.git
   cd repository-name
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
2. Start the db container:
   ```sh
   docker-compose up -d
   ```
4. Start the server:
   ```sh
   npm run start:dev
   # or
   yarn dev
   ```

## API Endpoints
To test the application endpoints, import the following JSON file into Postman or Insomnia:
[Postman.json](family-photo.postman_collection.json)

## Error Handling
- Uses standardized error responses with appropriate HTTP status codes.
- Handles external API failures gracefully with fallback mechanisms where applicable.

## Testing
- Unit and integration tests implemented using Jest.
- Run tests using:
  ```sh
  npm test
  ```

## Development Time Consideration
Development is limited to **8 hours**, focusing on core functionality, code quality, and maintainability.

Due to time constraints, only basic tests were conducted on the `photo-service`. However, in a real-world environment, implementing comprehensive automated testing, detailed monitoring, and efficient logging across all services is crucial to ensure system stability and reliability.

All these points are recognized areas for improvement and should be addressed in future iterations.

