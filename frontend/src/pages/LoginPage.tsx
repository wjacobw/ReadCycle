import React, { useContext } from "react";
import { UserContext } from "../context/UserContextProvider";
import { useNavigate, Navigate } from "react-router-dom";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import "../css/LoginPage.css";

export default function LoginPage() {
  const context = useContext(UserContext);
  const { loggedIn, setToken, setLoggedIn } = context!;
  const navigate = useNavigate();

  if (loggedIn) {
    return <Navigate to={"/books-page"} />;
  }

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3009/auth/google";
  };

  return (
    <div className="login flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="mt-3 text-7xl">Readcycle</h1>
        <p className="mt-4 text-3xl">
          Share, Exchange, and Pass on Knowledge <br /> Interviews!
        </p>
        <div className="googleButton mt-4">
          <GoogleLogin onSuccess={handleGoogleLogin} ux_mode="popup" />
        </div>
      </div>
    </div>
  );
}
