import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import { getAuth, onIdTokenChanged, signOut } from "firebase/auth";
import { app } from "../firebase/firebase";

// Create authentication context
const AuthContext = createContext();
const auth = getAuth(app);

// AuthProvider manages user authentication state
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage to see if user data exists
    const storedAuthData = localStorage.getItem("authData");
    if (storedAuthData) {
      setCurrentUser(JSON.parse(storedAuthData));
      setLoading(false); // Done loading if we have data in localStorage
    } else {
      setLoading(false); // Done loading if no stored data exists
    }

    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();

        // fetch the user from the backend based on Firebase user
        try {
          const response = await fetch("http://localhost:8000/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id_token: token }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          // Parse the JSON response
          const fetchedUser = await response.json();

          // Update the user state
          setCurrentUser({
            token, 
            role: fetchedUser.role, 
            id: fetchedUser.id, 
            name: fetchedUser.name,
            email: fetchedUser.email,
          });

          // Store the user data in localStorage -> MAY NEED A MORE SECURE IMPLEMENTATION
          localStorage.setItem("authData", JSON.stringify(fetchedUser));
          console.log("User data stored in localStorage:", fetchedUser);

        } catch (error) {
          console.error("Error fetching user:", error);
          setCurrentUser(null); // clear the user in case of failure
        }
      } else {
        setCurrentUser(null); // C lear the current user
      }

      // Done loading, set to false after all operations
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Function to update user state -> Log in
  const login = (data) => {
    localStorage.setItem("authData", JSON.stringify(data));
    setCurrentUser(data);
  };

  // Function to clear user state -> Log out
  const logout = () => {
    localStorage.removeItem("authData");
    signOut(auth) // Firebase logout
      .then(() => {
        setCurrentUser(null); // Reset currentUser
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing authentication context
export const useAuth = () => useContext(AuthContext);
