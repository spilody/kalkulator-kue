import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap aplikasi dengan AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
console.log("main.jsx loaded");