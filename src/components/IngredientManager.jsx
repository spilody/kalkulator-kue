// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const IngredientManager = () => {
  const [ingredients, setIngredients] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState(""); // Berat bahan
  const [unit, setUnit] = useState("kg"); // Satuan berat (default: kg)
  const [stock, setStock] = useState(""); // Jumlah stok
  const [stockUnit, setStockUnit] = useState("butir"); // Satuan stok (default: butir)
  const [editingId, setEditingId] = useState(null); // ID bahan yang sedang diedit
  const [showForm, setShowForm] = useState(false); // Apakah form ditampilkan
  const navigate = useNavigate();

  const fetchIngredients = async () => {
    const querySnapshot = await getDocs(collection(db, "ingredients"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setIngredients(data);
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  // Fungsi untuk mengisi form dengan data bahan yang dipilih
  const handleEdit = (ingredient) => {
    setName(ingredient.name);
    setPrice(ingredient.price.toString());
    setWeight(ingredient.weight.toString());
    setUnit(ingredient.unit);
    setStock(ingredient.stock.toString());
    setStockUnit(ingredient.stockUnit);
    setEditingId(ingredient.id); // Set ID bahan yang sedang diedit
    setShowForm(true); // Tampilkan form
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update bahan jika sedang dalam mode edit
        const ingredientRef = doc(db, "ingredients", editingId);
        await updateDoc(ingredientRef, {
          name,
          price: parseFloat(price),
          weight: parseFloat(weight),
          unit,
          stock: parseFloat(stock),
          stockUnit,
        });
        setEditingId(null); // Reset mode edit
      } else {
        // Tambahkan bahan baru jika tidak dalam mode edit
        await addDoc(collection(db, "ingredients"), {
          name,
          price: parseFloat(price),
          weight: parseFloat(weight),
          unit,
          stock: parseFloat(stock),
          stockUnit,
        });
      }
      fetchIngredients(); // Refresh daftar bahan
      resetForm(); // Reset form
      setShowForm(false); // Sembunyikan form
    } catch (error) {
      alert("Gagal menyimpan bahan: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "ingredients", id));
    fetchIngredients();
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setWeight("");
    setUnit("kg");
    setStock("");
    setStockUnit("butir");
  };

  // Fungsi untuk menangani tombol Batal
  const handleCancel = () => {
    resetForm(); // Reset form ke nilai awal
    setShowForm(false); // Sembunyikan form
    setEditingId(null); // Reset editingId ke null
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)} // Kembali ke halaman sebelumnya
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
        >
          Kembali
        </button>

        <h2 className="text-2xl font-bold text-center">Manajemen Bahan</h2>

        {/* Tombol Tambah Bahan */}
        {!showForm && !editingId && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Tambah Bahan
          </button>
        )}

        {/* Form Tambah/Edit Bahan */}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Bahan */}
            <input
              type="text"
              placeholder="Nama Bahan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            {/* Harga/kg */}
            <input
              type="number"
              placeholder="Harga/kg"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            {/* Berat dan Satuan */}
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Berat"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="kg">kg</option>
                <option value="gram">gram</option>
                <option value="liter">liter</option>
                <option value="ml">ml</option>
              </select>
            </div>
            {/* Stok dan Satuan Stok */}
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Stok"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <select
                value={stockUnit}
                onChange={(e) => setStockUnit(e.target.value)}
                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="kg">kg</option>
                <option value="gram">gram</option>
                <option value="butir">butir</option>
                <option value="liter">liter</option>
                <option value="ml">ml</option>
              </select>
            </div>
            {/* Tombol Submit */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              {editingId ? "Simpan Perubahan" : "Tambah Bahan"}
            </button>
            {/* Tombol Batal */}
            <button
              type="button"
              onClick={handleCancel} // Gunakan fungsi handleCancel
              className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
            >
              Batal
            </button>
          </form>
        )}

        {/* Daftar Bahan */}
        {!showForm && (
          <ul className="space-y-2">
            {ingredients.map((item) => (
              <li key={item.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
                <span>
                  {item.name} - Rp{item.price}/{item.unit} (Stok: {item.stock} {item.stockUnit})
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default IngredientManager;