import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  UserContextProvider,
  UserContext,
} from "./context/UserContextProvider";
import LoginPage from "./pages/LoginPage";
import CreateBookForm from "./component/CreateBookForm";
import BooksPage from "./pages/BooksPage";
import SearchBookForm from "./component/SearchBookForm";
import UserPointPage from "./pages/UserPointPage";
import NotificationPage from "./pages/NotificationPage";
import QuestionsPage from "./pages/QuestionsPage";
import BookRecommendations from "./pages/BooksRecommendation";
import "./css/NavBar.css";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "your-client-id";

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <UserContextProvider>
        <Router>
          <AppContent />
        </Router>
      </UserContextProvider>
    </GoogleOAuthProvider>
  );
}

const AppContent: React.FC = () => {
  const context = useContext(UserContext);
  const isLoggedIn = context && context.loggedIn;
  const navigate = useNavigate();

  const handleLogout = () => {
    if (context) {
      context.setToken(null);
      context.setLoggedIn(false);
      navigate("/");
    }
  };

  return (
    <div>
      {isLoggedIn && (
        <nav className="navbar">
          <ul className="navbar-list">
            <li>
              <Link to="/create-book">Donate Book</Link>
            </li>
            <li>
              <Link to="/search-book">Search Book</Link>
            </li>
            <li>
              <Link to="/books-page">All Books</Link>
            </li>
            <li>
              <Link to="/points">User Points</Link>
            </li>
            <li>
              <Link to="/notifications">Contributions</Link>
            </li>
            <li>
              <Link to="/recommendation-page">AI</Link>
            </li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/create-book" element={<CreateBookForm />} />
        <Route path="/search-book" element={<SearchBookForm />} />
        <Route path="/books-page" element={<BooksPage />} />
        <Route path="/points" element={<UserPointPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/questions-page" element={<QuestionsPage />} />
        <Route path="/recommendation-page" element={<BookRecommendations />} />
      </Routes>
    </div>
  );
};

export default App;
