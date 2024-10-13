import React, { useState, useContext } from "react";
import axios from "axios";
import "../css/SearchBookForm.css"; // Import the new CSS
import { UserContext } from "../context/UserContextProvider";

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
  firstDonator: string;
  currentOwner: string;
}

const SearchBookForm: React.FC = () => {
  const [isbn, setIsbn] = useState<string>("");
  const [books, setBooks] = useState<Book[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const context = useContext(UserContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsbn(e.target.value);
  };

  const refetch = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("User not authenticated");
    }
    const response = await axios.get(
      `http://localhost:3009/books/search?isbn=${isbn}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setBooks(response.data);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("User not authenticated");
      }
      const response = await axios.get(
        `http://localhost:3009/books/search?isbn=${isbn}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response", response);
      if (response.data.length == 0) {
        alert("The book is currently unavailable");
      }
      setBooks(response.data);
      setError(null);
    } catch (error) {
      setError("No books found with that ISBN or an error occurred.");
      setBooks(null);
      console.error("Error searching for book", error);
    }
  };

  const handleClaimBook = async (bookId: string) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("User not authenticated");
      }

      await axios.post(
        `http://localhost:3009/books/claim/${bookId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      refetch();
      alert("Book claimed successfully");
    } catch (error) {
      console.error("Error claiming the book", error);
      alert("Error claiming the book");
    }
  };

  return (
    <div className="search-book-page flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="mt-3 text-xl">Search Book</h1>
        <form onSubmit={handleSearch} className="search-form mt-4">
          <input
            type="text"
            value={isbn}
            onChange={handleChange}
            placeholder="Enter ISBN"
            required
            className="isbn-input"
          />
          <button type="submit" className="search-btn">
            Search Book
          </button>
        </form>

        {error && <div className="error mt-4">{error}</div>}

        {books && books.length > 0 && (
          <div className="books-list mt-4">
            <h3>Books Found</h3>
            {books.map((book, index) => (
              <div key={index} className="book-item mt-4">
                <h4>{book.title}</h4>
                <p>Authors: {book.authors.join(", ")}</p>
                <p>Publisher: {book.publisher}</p>
                <p>Published Date: {book.publishedDate}</p>
                <p>Description: {book.description}</p>
                <p>Page Count: {book.pageCount}</p>
                <p>Categories: {book.categories.join(", ")}</p>
                <p>Rating: {book.averageRating || "N/A"}</p>
                <p>Language: {book.language}</p>
                <p>ISBN: {book.isbn}</p>
                <p>First Donator: {book.firstDonator}</p>
                <p>Current Owner: {book.currentOwner}</p>
                {book.image && <img src={book.image} alt="Book cover" />}
                <button
                  onClick={() => handleClaimBook(book._id)}
                  className="claim-btn mt-4"
                >
                  Claim this book
                </button>
                <hr />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBookForm;
