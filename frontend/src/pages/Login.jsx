import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import "./Login.css";
import LoginCard from "../components/LoginCard";

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function Login() {
  const { login } = useAuth();
  const [error, setError] = useState(null); // Error message state
  const navigate = useNavigate(); // For redirecting after login
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Ensure only UMBC emails are allowed
      if (!user.email.endsWith("@umbc.edu")) {
        await signOut(auth);
        setError("Only UMBC emails are allowed.");
        setLoading(false);
        return;
      }

      const idToken = await user.getIdToken();
      localStorage.setItem("authData", JSON.stringify({ idToken }));

      let loginRes;
      try {
        // First try login
        loginRes = await axios.post("http://localhost:8000/auth/login", {
          id_token: idToken,
        });

        // If the login request returns a 404, create the user
      } catch (err) {
        if (err.response?.status === 404) {
          // User doesn't exist, create the user
          console.log("User doesn't exist, creating...");
          await axios.post("http://localhost:8000/users/", {
            firebase_uid: user.uid,
            email: user.email,
            name: user.displayName,
            role: "student", // Default role -> To be changed by admin if necessary
          });

          console.log("User created...");
          // Retry login after registration
          loginRes = await axios.post("http://localhost:8000/auth/login", {
            id_token: idToken,
          });

          console.log("User created, logged in:", user);
        } else if (
          err.response?.status === 400 &&
          err.response?.data?.detail === "User is soft deleted"
        ) {
          // If user exists but is soft deleted, restore them
          console.log("User exists but is soft deleted, restoring...");
          const userId = err.response?.data?.user?.id; // user can be identified by either 
          await axios.put(`http://localhost:8000/users/${userId}/undelete`);
        
          console.log("User undeleted...");
          // Retry login after undeleting
          loginRes = await axios.post("http://localhost:8000/auth/login", {
            id_token: idToken,
          });
        } else {
          throw err;
        }
      }

      const { token, role, id, name, email } = loginRes.data;


      // Final login + redirect
      login({ token, role, id, name, email });


      console.log("User logged in:", user);
      console.log("Current user role:", role);

      console.log(
        "Redirecting to:",
        role === "admin" ? "/admin/dashboard" : "/student/dashboard"
      );

      navigate(role === "admin" ? "/admin/dashboard" : "/student/dashboard");
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginCard
      error={error}
      loading={loading}
      handleGoogleLogin={handleGoogleLogin}
    />
  );
}
