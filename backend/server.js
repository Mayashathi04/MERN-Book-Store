const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Temporary mock database array
let booksCollection = [
  { _id: "1", title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Fiction", price: 15, description: "Classic novel" },
  { _id: "2", title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic Fiction", price: 12, description: "Pulitzer prize winner" }
];

// GET all books
app.get('/books', (req, res) => {
  res.json(booksCollection);
});

// POST a new book
app.post('/books', (req, res) => {
  const { title, author, genre, price, description } = req.body;
  if (!title || !author || !genre || !price) {
    return res.status(400).json({ errors: ['Missing required fields'] });
  }
  const newBook = { _id: Date.now().toString(), title, author, genre, price: Number(price), description };
  booksCollection.push(newBook);
  res.status(201).json(newBook);
});

// PUT update a book
app.put('/books/:id', (req, res) => {
  const { title, author, genre, price, description } = req.body;
  const book = booksCollection.find(b => b._id === req.params.id);
  if (!book) return res.status(404).json({ errors: ['Book not found'] });

  if (title) book.title = title;
  if (author) book.author = author;
  if (genre) book.genre = genre;
  if (price) book.price = Number(price);
  if (description) book.description = description;

  res.json(book);
});

// DELETE a book
app.delete('/books/:id', (req, res) => {
  booksCollection = booksCollection.filter(b => b._id !== req.params.id);
  res.json({ message: 'Book deleted successfully' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log('Connected smoothly to mock local database.');
  console.log(`Server executing seamlessly on port ${PORT}`);
});