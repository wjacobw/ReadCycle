import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContextProvider";

export default function QuestionsPage() {
  const context = useContext(UserContext);

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

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
}
