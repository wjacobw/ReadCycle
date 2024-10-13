import React, { useState } from "react";
import axios from "axios";
import "../css/BooksPage.css";

const BookRecommendations: React.FC = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        "http://localhost:3009/books/recommend",
        {
          params: { input: userInput },
        }
      );
      setRecommendations(response.data);
      setError(null);
    } catch (err: unknown) {
      console.log("error is", err);

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          setError(
            "Rate limit exceeded. Please try again later or upgrade your plan."
          );
        } else if (err.response?.data?.error?.code === "insufficient_quota") {
          setError(
            "Insufficient quota. Please check your plan and billing details."
          );
        } else {
          setError(
            "Rate limit exceeded. Please try again later or upgrade your plan."
          );
        }
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }

      setRecommendations([]);
    }
  };

  return (
    <div className="create-book-page"> 
      <h1 className="text-center">Get Book Recommendations</h1>
      <form className="donate-form" onSubmit={handleSearch}> 
        <input
          className="isbn-input" 
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Describe your book freely"
        />
        <button className="donate-btn" type="submit"> 
          Search
        </button>
      </form>

      {error && <p className="please-login">{error}</p>}

      {recommendations.length > 0 && (
        <div className="book-details"> 
          <h2>Top 3 Recommendations</h2>
          <ul>
            {recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BookRecommendations;
