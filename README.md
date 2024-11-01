# Course Management System

## Overview

The Course Management System is used to manage educational courses, including their modules and lessons. This project provides a user-friendly interface and a robust API for managing courses effectively.

## Features

- **Course Management**: Create, read, update, and delete courses.
- **Module Management**: Create, read, update, and delete modules associated with courses.
- **Lesson Management**: Create, read, update, and delete lessons within modules.
- **Caching**: Implemented caching to improve performance for retrieving courses and their details.
- **Validation**: Request validation using Joi to ensure data integrity.
- **Pagination**: Implemented pagination for retrieving lists of courses, modules, and lessons.
- **Error Handling**: Global error handling middleware for consistent error responses.
- **Logging**: Integrated logging using Winston for monitoring and debugging.
- **Rate Limiting**: Prevent abuse of the API by limiting the number of requests from a single client.
- **Swagger Documentation**: Automatically generated API documentation for easy exploration of endpoints.
- **Docker Configuration**: Dockerfile included for easy deployment of the application in a containerized environment.


## Technologies Used

- Node.js
- Express.js
- TypeScript
- MongoDB (or your chosen database)
- Joi for request validation
- Winston for logging
- Swagger for API documentation
- Docker for containerization

## Setup Instructions

### Prerequisites

- Node.js
- npm (Node Package Manager)

### Clone the Repository

```bash
git clone https://github.com/RavijaGunawardena/IngeniusCS.git
cd IngeniusCS
```

### Install Dependencies

```bash
npm install
```

### Running the Application

```bash
npm start or npx nodemon --exec ts-node src/server.ts
```

## API Usage

### Base URL

The base URL for the API is `http://localhost:3000`.

### Endpoints

#### Courses

- **Create a Course**
  - **POST** `/courses`
  - Request Body:
    ```json
    {
      "title": "Course Title",
      "description": "Course Description"
    }
    ```

- **Get All Courses**
  - **GET** `/courses?page=1&limit=10`

- **Get All Courses with more Data**
  - **GET** `/courses/details?page=1&limit=10`

- **Get Course by ID**
  - **GET** `/courses/:id`

- **Update a Course**
  - **PUT** `/courses/:id`
  - Request Body:
    ```json
    {
      "title": "Updated Title",
      "description": "Updated Description"
    }
    ```

- **Delete a Course**
  - **DELETE** `/courses/:id`

#### Modules

- **Create a Module**
  - **POST** `/modules`
  - Request Body:
    ```json
    {
      "courseId": "Course ID",
      "title": "Module Title"
    }
    ```

- **Get All Modules for a Course**
  - **GET** `/modules?courseId=Course ID&page=1&limit=10`

- **Update a Module**
  - **PUT** `/modules/:id`
  - Request Body:
    ```json
    {
      "title": "Updated Module Title"
    }
    ```

- **Delete a Module**
  - **DELETE** `/modules/:id`

#### Lessons

- **Create a Lesson**
  - **POST** `/lessons`
  - Request Body:
    ```json
    {
      "moduleId": "Module ID",
      "title": "Lesson Title",
      "description": "Lesson Description",
      "topics": ["Topic 1", "Topic 2"],
      "content": [
        {
          "type": "text",
          "data": "Lesson content in text format."
        }
      ]
    }
    ```

- **Get All Lessons for a Module**
  - **GET** `/lessons?moduleId=Module ID&page=1&limit=10`

- **Update a Lesson**
  - **PUT** `/lessons/:id`
  - Request Body:
    ```json
    {
      "title": "Updated Lesson Title",
      "description": "Updated Lesson Description",
      "topics": ["Updated Topic 1", "Updated Topic 2"],
      "content": [
        {
          "type": "video",
          "data": "Updated lesson content in video format."
        }
      ]
    }
    ```

- **Delete a Lesson**
  - **DELETE** `/lessons/:id`

### Swagger Documentation

You can access the API documentation via Swagger UI at `http://localhost:3000/api-docs`.

### Sample JSON Files

Sample JSON files with initial data can be found in the data folder

