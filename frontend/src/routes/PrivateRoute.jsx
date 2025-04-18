import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// PrivateRoute component
export default function PrivateRoute({ children, allowedRoles }) {
  const { currentUser, loading } = useAuth(); 

  // If loading, return a loading indicator
  if (loading) return <div>Loading...</div>; // WILL NEED BETTER UI DESIGN ie Loading spinner

  // If user is not authenticated, redirect to login
  if (!currentUser) return <Navigate to="/login" replace/>;

  // If user doesn't have the required role, redirect to home 
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/login" replace/>;
  }

  return children;
}
