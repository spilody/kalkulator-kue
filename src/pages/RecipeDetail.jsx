// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useParams, Link } from "react-router-dom";

const RecipeDetail = () => {
  const { id } = useParams(); // Ambil ID resep dari URL
  const [recipe, setRecipe] = useState(null);

  // Ambil data resep berdasarkan ID
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeRef = doc(db, "recipes", id);
        const recipeSnapshot = await getDoc(recipeRef);
        if (recipeSnapshot.exists()) {
          setRecipe({ id: recipeSnapshot.id, ...recipeSnapshot.data() });
        } else {
          console.error("Resep tidak ditemukan");
        }
      } catch (error) {
        console.error("Gagal mengambil data resep: ", error);
      }
    };
    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl space-y-6">
        {/* Back Button */}
        <Link
          to="/recipes-table"
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
        >
          Kembali ke Daftar Resep
        </Link>

        <h2 className="text-2xl font-bold text-center">{recipe.name}</h2>
        <p className="text-lg font-semibold">Total Biaya: Rp{recipe.totalCost}</p>

        {/* Tabel Bahan */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Nama Bahan</th>
              <th className="p-3 text-left">Jumlah</th>
              <th className="p-3 text-left">Satuan</th>
              <th className="p-3 text-left">Biaya</th>
            </tr>
          </thead>
          <tbody>
            {recipe.ingredients.map((ingredient, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{ingredient.name}</td>
                <td className="p-3">{ingredient.quantity}</td>
                <td className="p-3">{ingredient.unit}</td>
                <td className="p-3">Rp{ingredient.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecipeDetail;