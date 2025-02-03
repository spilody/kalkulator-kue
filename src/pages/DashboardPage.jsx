// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const DashboardPage = () => {
  const [totalIngredients, setTotalIngredients] = useState(0); // Total bahan
  const [totalRecipes, setTotalRecipes] = useState(0); // Total resep
  const [criticalStock, setCriticalStock] = useState(0); // Stok kritis

  // Fungsi untuk logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Logout dari Firebase
      alert("Anda telah keluar!");
      window.location.href = "/"; // Redirect ke halaman login
    } catch (error) {
      alert("Logout gagal: " + error.message);
    }
  };

  // Fungsi untuk mengambil data dari Firebase Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil total bahan
        const ingredientsSnapshot = await getDocs(collection(db, "ingredients"));
        setTotalIngredients(ingredientsSnapshot.docs.length);

        // Ambil total resep
        const recipesSnapshot = await getDocs(collection(db, "recipes"));
        setTotalRecipes(recipesSnapshot.docs.length);

        // Hitung stok kritis (misalnya, stok < 5)
        const criticalStockCount = ingredientsSnapshot.docs.filter(
          (doc) => doc.data().stock < 5
        ).length;
        setCriticalStock(criticalStockCount);
      } catch (error) {
        console.error("Gagal mengambil data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex space-x-4 items-center">
          <Link
            to="/ingredients"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Manajemen Bahan
          </Link>
          <Link
            to="/recipes"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Manajemen Resep
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Total Bahan */}
          <Link
            to="/ingredients-table"
            className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center space-y-4 cursor-pointer hover:bg-gray-50 transition duration-300"
          >
            <span className="text-4xl font-bold text-blue-500">{totalIngredients}</span>
            <p className="text-gray-700 text-center">Total Bahan Tersedia</p>
          </Link>

          {/* Card 2: Total Resep */}
          <Link
            to="/recipes-table"
            className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center space-y-4 cursor-pointer hover:bg-gray-50 transition duration-300"
          >
            <span className="text-4xl font-bold text-green-500">{totalRecipes}</span>
            <p className="text-gray-700 text-center">Total Resep Dibuat</p>
          </Link>

          {/* Card 3: Stok Kritis */}
          <Link
            to="/critical-stock-detail"
            className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center space-y-4 cursor-pointer hover:bg-gray-50 transition duration-300"
          >
            <span className="text-4xl font-bold text-red-500">{criticalStock}</span>
            <p className="text-gray-700 text-center">Stok Bahan Kritis</p>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 px-6 text-center">
        &copy;2025 Alyssa Corps. All rights reserved.
      </footer>
    </div>
  );
};

export default DashboardPage;