import { Navigate } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes
import { useAuth } from "../context/AuthContext"; // Gunakan AuthContext

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth(); // Dapatkan status login dari AuthContext

  if (!currentUser) {
    return <Navigate to="/" />; // Redirect ke halaman login jika belum login
  }

  return children;
};

// Validasi PropTypes
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // Validasi bahwa children harus ada dan merupakan node React
};

export default ProtectedRoute;