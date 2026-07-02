import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/books';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({ title: '', author: '', genre: '', price: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setBooks(response.data);
    } catch (err) {
      setError('Could not retrieve records from backend.');
    } finally { setLoading(false); }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.genre || !formData.price) {
      setError('Please fill out all required fields.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        setSuccess('Book details updated!');
        setEditingId(null);
      } else {
        await axios.post(API_URL, formData);
        setSuccess('Book successfully created!');
      }
      setFormData({ title: '', author: '', genre: '', price: '', description: '' });
      fetchBooks();
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'An unexpected error occurred.');
    } finally { setLoading(false); }
  };

  const handleEdit = (book) => {
    setEditingId(book._id);
    setFormData({ title: book.title, author: book.author, genre: book.genre, price: book.price, description: book.description || '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setSuccess('Book removed successfully.');
        fetchBooks();
      } catch (err) {
        setError('Failed to complete delete request.');
      }
    }
  };

  return (
    <div className="app-container">
      <h2>📚 Book Store Management System</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="book-form">
        <h3>{editingId ? 'Edit Book Details' : 'Add New Book'}</h3>
        <input type="text" name="title" placeholder="Title *" value={formData.title} onChange={handleInputChange} />
        <input type="text" name="author" placeholder="Author *" value={formData.author} onChange={handleInputChange} />
        <input type="text" name="genre" placeholder="Genre *" value={formData.genre} onChange={handleInputChange} />
        <input type="number" name="price" placeholder="Price ($) *" value={formData.price} onChange={handleInputChange} />
        <textarea name="description" placeholder="Description..." value={formData.description} onChange={handleInputChange}></textarea>
        <button type="submit" className="btn-submit">{editingId ? 'Save Changes' : 'Insert Book'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ title:'', author:'', genre:'', price:'', description:'' }); }}>Cancel</button>}
      </form>

      <div className="inventory-section">
        <h3>Stored Inventory</h3>
        {loading && <p>Processing Request...</p>}
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Title</th><th>Author</th><th>Genre</th><th>Price</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(b => (
                <tr key={b._id}>
                  <td>{b.title}</td><td>{b.author}</td><td>{b.genre}</td><td>${b.price}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(b)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(b._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;