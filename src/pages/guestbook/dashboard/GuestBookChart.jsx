import React from "react";
import {Bar, Line} from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement
} from "chart.js";
import Spinner from "../../../components/Other/Spinner.jsx";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function GuestBookChart({dataset, loading}){

    return (
        <div className="bg-white shadow-lg rounded overflow-hidden pb-20 md:pb-10">
            <div className="bg-teal-700 px-4 py-3 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Grafik</h3>
            </div>

            <div className="px-4 py-3 space-y-2">
                {/*{loading ? (*/}
                {/*    <Spinner/>*/}
                {/*) : dataset ? (*/}
                {/*    <div className="w-full min-h-96">*/}
                {/*        <Bar data={dataset} options={{ responsive: true, maintainAspectRatio: false }} />*/}
                {/*    </div>*/}
                {/*) : (*/}
                {/*    <p className="text-gray-500 text-center">Silahkan pilih filter diatas untuk menampilkan grafik.</p>*/}
                {/*)}*/}
                {dataset ? (
                    <div className="w-full min-h-96">
                        <Bar data={dataset} options={{responsive: true, maintainAspectRatio: false}}/>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">Silahkan pilih filter diatas untuk menampilkan grafik.</p>
                )}
            </div>
        </div>
    )
}