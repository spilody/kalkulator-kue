// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const RecipeManager = () => {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [quantity, setQuantity] = useState(""); // Jumlah pakai
  const [recipeName, setRecipeName] = useState("");
  const [recipeCost, setRecipeCost] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState(""); // Satuan yang dipilih
  const [availableUnits, setAvailableUnits] = useState([]); // Daftar satuan yang valid
  const [recipeIngredients, setRecipeIngredients] = useState([]); // Daftar bahan dalam resep
  const [editingIndex, setEditingIndex] = useState(null); // Index bahan yang sedang diedit
  const navigate = useNavigate();

  // Ambil data bahan dari Firestore
  const fetchIngredients = async () => {
    const querySnapshot = await getDocs(collection(db, "ingredients"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setIngredients(data);
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  // Update satuan yang valid ketika bahan dipilih
  useEffect(() => {
    if (selectedIngredient) {
      const selected = ingredients.find((item) => item.name === selectedIngredient);
      if (selected) {
        let units = [];
        if (selected.stockUnit === "kg") {
          units = ["kg", "gram"];
        } else if (selected.stockUnit === "liter") {
          units = ["liter", "ml"];
        } else if (selected.stockUnit === "butir") {
          units = ["butir"];
        } else {
          units = [selected.stockUnit]; // Default ke satuan stok
        }
        setAvailableUnits(units);
        setSelectedUnit(units[0]); // Set default ke satuan pertama
      }
    } else {
      setAvailableUnits([]);
      setSelectedUnit("");
    }
  }, [selectedIngredient, ingredients]);

  // Fungsi untuk mengonversi ke satuan dasar
  const convertToBaseUnit = (value, unit) => {
    switch (unit) {
      case "kg":
        return value * 1000; // 1 kg = 1000 gram
      case "gram":
        return value; // Gram adalah satuan dasar
      case "liter":
        return value * 1000; // 1 liter = 1000 ml
      case "ml":
        return value; // Mililiter adalah satuan dasar
      default:
        return value; // Jika satuan tidak dikenali, kembalikan nilai asli
    }
  };

  // Fungsi untuk mengonversi harga berdasarkan satuan yang dipilih
  const calculatePricePerUnit = (ingredient, selectedUnit) => {
    if (selectedUnit === "butir" && ingredient.stockUnit === "butir") {
      return ingredient.price / ingredient.stock;
    }
    const baseWeight = convertToBaseUnit(ingredient.weight, ingredient.unit);
    const pricePerGramOrMl = ingredient.price / baseWeight;
    switch (selectedUnit) {
      case "kg":
        return pricePerGramOrMl * 1000;
      case "gram":
        return pricePerGramOrMl;
      case "liter":
        return pricePerGramOrMl * 1000;
      case "ml":
        return pricePerGramOrMl;
      default:
        return ingredient.price;
    }
  };

  // Fungsi untuk menambahkan/memperbarui bahan ke daftar resep
  const addOrUpdateIngredient = () => {
    if (!selectedIngredient || !quantity || !selectedUnit) {
      alert("Harap isi semua field untuk menambahkan bahan!");
      return;
    }

    const ingredient = ingredients.find((item) => item.name === selectedIngredient);
    const pricePerUnit = calculatePricePerUnit(ingredient, selectedUnit);
    const cost = pricePerUnit * parseFloat(quantity);

    const newIngredient = {
      name: selectedIngredient,
      quantity: parseFloat(quantity),
      unit: selectedUnit,
      cost: cost.toFixed(2),
    };

    if (editingIndex !== null) {
      // Edit bahan yang sudah ada
      const updatedIngredients = [...recipeIngredients];
      updatedIngredients[editingIndex] = newIngredient;
      setRecipeIngredients(updatedIngredients);
      setEditingIndex(null);
    } else {
      // Tambahkan bahan baru
      setRecipeIngredients([...recipeIngredients, newIngredient]);
    }

    // Hitung ulang total modal
    const totalCost = recipeIngredients.reduce(
      (sum, item) => sum + parseFloat(item.cost),
      0
    );
    setRecipeCost(totalCost + cost);

    // Reset form
    setSelectedIngredient("");
    setQuantity("");
    setSelectedUnit("");
  };

  // Fungsi untuk mengedit bahan
  const handleEdit = (index) => {
    const ingredientToEdit = recipeIngredients[index];
    setSelectedIngredient(ingredientToEdit.name);
    setQuantity(ingredientToEdit.quantity.toString());
    setSelectedUnit(ingredientToEdit.unit);
    setEditingIndex(index);
  };

  // Fungsi untuk menghapus bahan
  const handleDelete = (index) => {
    const updatedIngredients = recipeIngredients.filter((_, i) => i !== index);
    setRecipeIngredients(updatedIngredients);

    // Hitung ulang total modal
    const totalCost = updatedIngredients.reduce(
      (sum, item) => sum + parseFloat(item.cost),
      0
    );
    setRecipeCost(totalCost);
  };

  // Fungsi untuk menyimpan resep ke Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipeName.trim()) {
      alert("Nama resep tidak boleh kosong!");
      return;
    }
    if (recipeIngredients.length === 0) {
      alert("Resep harus memiliki minimal satu bahan!");
      return;
    }

    try {
      await addDoc(collection(db, "recipes"), {
        name: recipeName,
        ingredients: recipeIngredients, // Simpan hanya daftar bahan yang sudah ditambahkan
        totalCost: recipeCost.toFixed(2),
      });
      alert("Resep berhasil ditambahkan!");
      setRecipeName("");
      setRecipeIngredients([]);
      setRecipeCost(0);
    } catch (error) {
      alert("Gagal menambahkan resep: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
        >
          Kembali
        </button>

        <h2 className="text-2xl font-bold text-center">Manajemen Resep</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Resep */}
          <input
            type="text"
            placeholder="Nama Resep"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />

          {/* Pilih Bahan */}
          <select
            value={selectedIngredient}
            onChange={(e) => setSelectedIngredient(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">Pilih Bahan</option>
            {ingredients.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          {/* Pilih Satuan */}
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">Pilih Satuan</option>
            {availableUnits.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>

          {/* Jumlah Pakai */}
          <input
            type="number"
            placeholder={`Jumlah Pakai (${selectedUnit || "Satuan"})`}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />

          {/* Tombol Tambah/Update Bahan */}
          <button
            type="button"
            onClick={addOrUpdateIngredient}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            {editingIndex !== null ? "Simpan Perubahan" : "Tambah Bahan"}
          </button>

          {/* Daftar Bahan dalam Resep */}
          {recipeIngredients.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Bahan dalam Resep:</h3>
              <ul className="space-y-2">
                {recipeIngredients.map((ingredient, index) => (
                  <li key={index} className="flex justify-between bg-gray-100 p-2 rounded-lg">
                    <span>{`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}</span>
                    <span>Rp{ingredient.cost}</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600 transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                      >
                        Hapus
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Total Modal */}
          <p className="text-center font-bold">Total Modal: Rp{recipeCost.toFixed(2)}</p>

          {/* Tombol Simpan Resep */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Simpan Resep
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecipeManager;