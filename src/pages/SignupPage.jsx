// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State untuk show/hide password
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      alert("Email tidak valid!");
      return;
    }
    if (password.length < 6) {
      alert("Password minimal 6 karakter!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Password tidak cocok!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Akun berhasil dibuat!");
      navigate("/");
    } catch (error) {
      alert("Pendaftaran gagal: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Daftar Akun</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // Toggle antara "text" dan "password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            {/* Tombol Show/Hide Password */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Toggle state showPassword
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            >
              {showPassword ? (
                <span className="text-gray-500">Hide</span>
              ) : (
                <span className="text-gray-500">Show</span>
              )}
            </button>
          </div>
          {/* Confirm Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // Toggle antara "text" dan "password"
              placeholder="Konfirmasi Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            {/* Tombol Show/Hide Password */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Toggle state showPassword
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            >
              {showPassword ? (
                <span className="text-gray-500">Hide</span>
              ) : (
                <span className="text-gray-500">Show</span>
              )}
            </button>
          </div>
          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Daftar
          </button>
        </form>
        {/* Link to Login Page */}
        <p className="text-center mt-4">
          Sudah punya akun?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;