const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// 1. GET /books - List all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error retrieving books', error: error.message });
    }
});

// 2. GET /books/:id - Get a book by ID
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid Book ID format', error: error.message });
    }
});

// 3. POST /books - Add a new book
router.post('/', async (req, res) => {
    try {
        const { title, author, genre, price, description } = req.body;
        const newBook = new Book({ title, author, genre, price, description });
        const savedBook = await newBook.save();
        res.status(201).json({ success: true, data: savedBook });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: 'Validation failed', errors: messages });
        }
        res.status(500).json({ success: false, message: 'Server error adding book', error: error.message });
    }
});

// 4. PUT /books/:id - Update book details
router.put('/:id', async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!updatedBook) {
            return res.status(404).json({ success: false, message: 'Book not found to update' });
        }
        res.status(200).json({ success: true, data: updatedBook });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: 'Validation failed', errors: messages });
        }
        res.status(400).json({ success: false, message: 'Invalid data or Book ID', error: error.message });
    }
});

// 5. DELETE /books/:id - Remove a book
router.delete('/:id', async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ success: false, message: 'Book not found to delete' });
        }
        res.status(200).json({ success: true, message: 'Book successfully deleted' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid Book ID', error: error.message });
    }
});

module.exports = router;
