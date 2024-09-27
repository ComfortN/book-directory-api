# Book Directory API

This is a simple RESTful API for managing a book directory. It's built with Node.js using the built-in `http` module.

## Features

- List all books
- Get a specific book by ISBN
- Add a new book
- Update an existing book
- Delete a book

## Prerequisites

- Node.js

## Installation

1. Clone this repository or download the source code.

```
    git clone https://github.com/ComfortN/book-directory-api.git
```

2. Navigate to the project directory in your terminal.

```
    cd book-directory-api
```


3. Run the following command to start the server:

```
   node server.js
```

   The server will start running on `http://localhost:3000`.


## API Endpoints

### GET /books

Returns a list of all books in the directory.

### GET /books/:isbn

Returns the details of a specific book identified by its ISBN.

### POST /books

Adds a new book to the directory. The request body should contain the book details in JSON format.

### PUT /books/:isbn

Updates the details of an existing book identified by its ISBN. The request body should contain the fields to be updated in JSON format.

### DELETE /books/:isbn

Removes a book from the directory based on its ISBN.

## Usage Examples

Here are some example requests you can make to the API:

### List all books

```
    GET http://localhost:3000/books
```

### Get a specific book

```
    GET http://localhost:3000/books/9781405664264
```

### Add a new book

```
    POST http://localhost:3000/books
    Content-Type: application/json

    {
        "title": "House of Night Chosen",
        "author": "Kristin Cast",
        "publisher": "Macmillan Publishers",
        "publishedDate": "2008-03-04",
        "isbn": "9781405664264"
    }
```

### Update a book

```
    PUT http://localhost:3000/books/9781405664264
    Content-Type: application/json

    {
        "publisher": "Updated Publisher"
    }
```

### Delete a book

```
    DELETE http://localhost:3000/books/9781405664264
```

## Error Handling

The API includes basic error handling:

- 400 Bad Request: For invalid input or JSON parsing errors
- 404 Not Found: When a requested book doesn't exist
- 405 Method Not Allowed: For unsupported HTTP methods

