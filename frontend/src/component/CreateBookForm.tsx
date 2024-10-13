import React, { useState, useContext } from "react";
import axios from "axios";
import "../css/CreateBookForm.css"; // Import the CSS file
import { UserContext } from "../context/UserContextProvider";

interface CreateBookDto {
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

const CreateBookForm: React.FC = () => {
  const [isbn, setIsbn] = useState<string>("");
  const [book, setBook] = useState<CreateBookDto | null>(null);

  const context = useContext(UserContext);

  if (!context || !context.token) {
    return <div className="please-login">Please log in to donate a book.</div>;
  }

  const { token } = context;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsbn(e.target.value);
  };

  const fetchBookFromGoogleBooks = async (isbn: string) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=AIzaSyBGjUzeHwnwiomtZYAiyyyh5tb_5n3V_xg`
      );
      const bookData = response.data.items[0].volumeInfo;

      const parsedBook: CreateBookDto = {
        title: bookData.title,
        authors: bookData.authors || ["Unknown"],
        publisher: bookData.publisher || "Unknown",
        publishedDate: bookData.publishedDate || "",
        description: bookData.description || "No description available",
        pageCount: bookData.pageCount || 0,
        categories: bookData.categories || ["Uncategorized"],
        averageRating: bookData.averageRating || 0,
        image: bookData.imageLinks?.thumbnail || "",
        language: bookData.language || "en",
        isbn: isbn,
      };

      setBook(parsedBook);
    } catch (error) {
      console.error("Error fetching book data", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isbn) {
      await fetchBookFromGoogleBooks(isbn);

      if (book) {
        try {
          await axios.post("http://localhost:3009/books/donate", book, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          alert("Book donated successfully!"); 
          console.log("Book donated successfully");
        } catch (error) {
          console.error("Error donating book", error);
          alert("Error donating book. Please try again.");
        }
      }
    }
  };

  return (
    <div className="create-book-page flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="mt-3 text-7xl">Donate a Book</h1>
        <form onSubmit={handleSubmit} className="donate-form mt-4">
          <input
            type="text"
            value={isbn}
            onChange={handleChange}
            placeholder="Enter ISBN"
            required
            className="isbn-input"
          />
          <button type="submit" className="donate-btn">
            Donate Book
          </button>
        </form>

        {book && (
          <div className="book-details mt-4">
            <h3>Book Details</h3>
            <div className="book-info">
              <div className="book-image-container">
                {book.image && (
                  <img
                    src={book.image}
                    alt="Book cover"
                    className="book-image"
                    style={{
                      width: "200px",
                      height: "auto",
                      maxHeight: "400px",
                      objectFit: "contain",
                    }}
                  />
                )}
              </div>
              <div className="book-data">
                <p>
                  <strong>Title:</strong> {book.title}
                </p>
                <p>
                  <strong>Authors:</strong> {book.authors.join(", ")}
                </p>
                <p>
                  <strong>Publisher:</strong> {book.publisher}
                </p>
                <p>
                  <strong>Published Date:</strong> {book.publishedDate}
                </p>
                <p>
                  <strong>Description:</strong> {book.description}
                </p>
                <p>
                  <strong>Page Count:</strong> {book.pageCount}
                </p>
                <p>
                  <strong>Categories:</strong> {book.categories.join(", ")}
                </p>
                <p>
                  <strong>Rating:</strong> {book.averageRating}
                </p>
                <p>
                  <strong>Language:</strong> {book.language}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBookForm;
