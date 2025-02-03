// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const CriticalStockDetail = () => {
  const [criticalStock, setCriticalStock] = useState([]);

  // Ambil data bahan dengan stok kritis dari Firestore
  useEffect(() => {
    const fetchCriticalStock = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ingredients"));
        const data = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((item) => item.stock < 5); // Filter bahan dengan stok < 5
        setCriticalStock(data);
      } catch (error) {
        console.error("Gagal mengambil data stok kritis: ", error);
      }
    };
    fetchCriticalStock();
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

        <h2 className="text-2xl font-bold text-center">Stok Bahan Kritis</h2>

        {/* Tabel Stok Kritis */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Nama Bahan</th>
              <th className="p-3 text-left">Harga/kg</th>
              <th className="p-3 text-left">Stok</th>
              <th className="p-3 text-left">Satuan</th>
            </tr>
          </thead>
          <tbody>
            {criticalStock.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-3">{item.name}</td>
                <td className="p-3">Rp{item.price}</td>
                <td className="p-3">{item.stock}</td>
                <td className="p-3">{item.stockUnit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CriticalStockDetail;