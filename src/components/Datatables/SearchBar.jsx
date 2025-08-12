import React from "react";

export default function SearchBar({search, onSearchChange})
{
    return (
        <div className="flex items-center">
            <input
                type="text"
                name="term"
                placeholder="Cari..."
                value={search}
                onChange={onSearchChange}
                className="border rounded-full text-sm w-full px-3 py-2 focus:outline-none focus:border-green-300 bg-slate-50"
            />
        </div>
    )
}