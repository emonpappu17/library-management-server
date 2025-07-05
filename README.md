# Library Management System API

A full-featured RESTful API for managingg books and borrow records using **Express.js**, **TypeScript**, and **MongoDB** (with Mongoose). Built as an assignment project.

---

## Features

- Book CRUD oparations
- Borrow system with availability check
- Schema validation and error handling
- Aggregation pipeline to summarize borrowed books
- Static & instance methods, pre & post middlewares
- Filter, sort, and limit queries supported

---

## Tech Stack

- **Backend**: Express.js + TypeScript
- **Database**: MongoDB (with Mongoose ODM)
- **Validation**: Mongoose schema validation
- **Error Handling**: Centrelized global error handler

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB URI (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/emonpappu17/library-management-server.git
cd library-management-server

# Install dependencies
npm install

# Create a .env file
cp .env.example .env

# Set environment variables
MONGODB_URI=your-mongo-db-uri

# Run the server
npm run dev

```

---

## API Endpoints

### 1. Create Book

```
POST /api/books

```

**Body:**

```json
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5,
  "available": true
}

```

### 2. Get All Books

```
GET /api/books

```

### 3. Get Book by ID

```
GET /api/books/:bookId

```

### 4. Update Book

```
PUT /api/books/:bookId

```

**Body:**

```json
{
  "copies": 50
}

```

### 5. Delete Book

```
DELETE /api/books/:bookId

```

### 6. Borrow a Book

```
POST /api/borrow

```

**Body:**

```json
{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}

```

### 7. Borrow Summary

```
GET /api/borrow

```

**Returns:**

```json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    }
  ]
}

```

---

## Error Handling Format

All errors follow this structure:

```json
{
  "message": "Validation failed",
  "success": false,
  "error": {
    "name": "ValidationError",
    "errors": {
      "copies": {
        "message": "Copies must be a positive number",
        "name": "ValidatorError",
        "kind": "min",
        "path": "copies",
        "value": -5
      }
    }
  }
}

```

