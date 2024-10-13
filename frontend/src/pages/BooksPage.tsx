import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContextProvider";
import "../css/BooksPage.css"; // Create a new CSS file for styling
import { useNavigate, useLocation } from "react-router-dom";

interface Book {
  _id: string;
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  pageCount: number;
  categories: string[];
  averageRating?: number;
  image?: string;
  language: string;
  isbn: string;
}

export default function BooksPage() {
  const context = useContext(UserContext);
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!context) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }

  const { setToken, setLoggedIn } = context;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    if (token) {
      setToken(token);
      setLoggedIn(true);
      localStorage.setItem("access_token", token);
      navigate("/create-book", { replace: true });
    }
  }, [location.search, setToken, setLoggedIn, navigate]);

  if (!context) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }

  const { token } = context;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:3009/books", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooks(response.data);
      } catch (err) {
        setError("Error fetching books");
        console.error(err);
      }
    };

    if (token) {
      fetchBooks();
    }
  }, [token]);

  const handleBorrowBook = async (bookId: string) => {
    try {
      await axios.post(
        `http://localhost:3009/books/borrow/${bookId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Book borrowed successfully!");
    } catch (err) {
      alert("Error borrowing book");
      console.error(err);
    }
  };

  return (
    <div className="books-page">
      <h1>Available Books for Borrowing</h1>
      {error && <p className="error">{error}</p>}
      {books.length > 0 ? (
        <div className="books-grid">
          {books.map((book) => (
            <div key={book._id} className="book-card">
              <img
                src={book.image || "https://via.placeholder.com/150"}
                alt={`${book.title} cover`}
                className="book-image"
              />
              <div className="book-info">
                <h3>{book.title}</h3>
                <p>Authors: {book.authors.join(", ")}</p>
                <p>Publisher: {book.publisher}</p>
                <p>ISBN: {book.isbn}</p>
                <p>Language: {book.language}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No books available for borrowing.</p>
      )}
    </div>
  );
}
