import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBuilding} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {get} from "/src/api/kegiatan.uinsatu.jsx";
import {toast} from "react-toastify";
import {useAuth} from "/src/context/AuthProvider.jsx";

export default function FilterForm({filters, setFilters, setSelectedUnit, units, loading})
{
    return (
        <div className="flex flex-col">
            <label className="text-gray-700 mb-2">Unit</label>
            <div className="relative">
                <div
                    className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <FontAwesomeIcon icon={faBuilding}/>
                </div>

                <select
                    name="unit_id"
                    value={filters.unit_id}
                    onChange={e => {
                        setFilters(prev => ({...prev, unit_id: e.target.value}));
                        const selected = units.find(u => u.id === parseInt(e.target.value));
                        setSelectedUnit(selected);
                    }}
                    required
                    className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                    disabled={loading}
                >
                    <option value="">Pilih Unit</option>
                    {units.length > 0 && units.map(option => (
                        <option key={option.id} value={option.id}>{option.unit}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}