const http = require('http');

// Empty list for books
let books = [];

// Helper function to parse JSON body
const getRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
};



// Validate book data
const validateBook = (book, isPartialUpdate = false) => {
  const requiredFields = ['title', 'author', 'publisher', 'publishedDate', 'isbn'];
  if (!isPartialUpdate) {
    for (let field of requiredFields) {
      if (!book[field]) {
        return `${field} is required`;
      }
    }
  }
  if (book.isbn !== undefined && isNaN(book.isbn)) {
    return 'ISBN must be a valid number';
  }
  return null;
};

// Handle GET requests
const handleGet = (req, res) => {
  const parts = req.url.split('/');
  if (parts[1] === 'books') {
    if (parts.length === 2) {
      // GET /books
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(books));
    } else if (parts.length === 3) {
      // GET /books/:isbn
      const book = books.find(b => b.isbn === parts[2]);
      if (book) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(book));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Book not found' }));
      }
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
};

// Handle POST requests
const handlePost = async (req, res) => {
  if (req.url === '/books') {
    try {
      const book = await getRequestBody(req);
      const validationError = validateBook(book);
      if (validationError) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: validationError }));
        return;
      }
      books.push(book);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(book));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
};


// Handle PUT requests
const handlePut = async (req, res) => {
  const parts = req.url.split('/');
  if (parts[1] === 'books' && parts.length === 3) {
    const isbn = parts[2];
    const index = books.findIndex(b => b.isbn === isbn);
    if (index !== -1) {
      try {
        const updatedFields = await getRequestBody(req);
        const validationError = validateBook(updatedFields, true);
        if (validationError) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: validationError }));
          return;
        }
        books[index] = { ...books[index], ...updatedFields };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(books[index]));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Book not found' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
};



// Create the server
const server = http.createServer((req, res) => {
  switch (req.method) {
    case 'GET':
      handleGet(req, res);
      break;
    case 'POST':
      handlePost(req, res);
      break;
    case 'PUT':
      handlePut(req, res);
      break;
    default:
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});