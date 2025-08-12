import React from "react";
import {useNavigate} from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();
  return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="text-center">
              <h1 className="text-6xl font-bold text-teal-700">404</h1>
              <h2 className="mt-4 text-2xl font-semibold text-gray-800">Halaman Tidak Ditemukan</h2>
              <p className="mt-2 text-gray-600">Maaf, halaman yang Anda cari tidak ada.</p>
              <button
                  onClick={() => navigate(-1)}
                  className="mt-6 inline-block px-4 py-2 text-white shadow-lg bg-emerald-500 rounded hover:bg-emerald-400"
              >
                  Kembali
              </button>
          </div>
      </div>
  );
}

export default NotFound;
