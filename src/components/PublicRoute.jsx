import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types"; // Import PropTypes

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// Validasi PropTypes
PublicRoute.propTypes = {
  children: PropTypes.node.isRequired, // Validasi bahwa children harus ada dan merupakan node React
};

export default PublicRoute;