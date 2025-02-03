// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const RecipesTable = () => {
  const [recipes, setRecipes] = useState([]);

  // Ambil data resep dari Firestore
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "recipes"));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRecipes(data);
      } catch (error) {
        console.error("Gagal mengambil data resep: ", error);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl space-y-6">
        {/* Back Button */}
        <Link
          to="/dashboard"
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
        >
          Kembali ke Dashboard
        </Link>

        <h2 className="text-2xl font-bold text-center">Daftar Resep</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Nama Resep</th>
              <th className="p-3 text-left">Total Biaya</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((item) => (
              <tr
                key={item.id}
                className="border-b cursor-pointer hover:bg-gray-50 transition duration-300"
              >
                <td className="p-3">
                  <Link to={`/recipe-detail/${item.id}`} className="text-blue-500 hover:underline">
                    {item.name}
                  </Link>
                </td>
                <td className="p-3">Rp{item.totalCost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecipesTable;