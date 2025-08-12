import React from "react";
import {Link, useNavigate} from "react-router-dom";

export default function Success()
{
    const navigate = useNavigate();

    return (
        <>
            <div
                className="hidden md:block font-medium self-center text-xl sm:text-3xl text-gray-800 text-center"
            >
                Terima Kasih
            </div>

            <div className="relative mt-6 h-px bg-gray-300">
                <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                                  <span className="bg-white px-4 text-xs text-gray-500 uppercase">
                                    UIN SATU Tulungagung
                                  </span>
                </div>
            </div>

            <div className="md:hidden block my-4 text-center">
                <h1 className="text-2xl font-semibold text-slate-500">Terima Kasih</h1>
            </div>

            {/* Login Form */}
            <div className="md:mt-6 mt-4 text-justify">
                <p className="mb-3">Terima kasih telah bersedia mengisi buku tamu di UIN Sayyid Ali Rahmatullah
                    Tulungagung. Semoga harimu menyenangkan.</p>

                <Link
                    to={navigate(-1)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-gray-100 px-2 py-1 rounded shadow-lg text-sm"
                >
                    Isi Ulang Form Kunjungan
                </Link>
            </div>
        </>
    );
}
