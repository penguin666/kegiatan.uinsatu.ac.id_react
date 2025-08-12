import React from "react";

export default function Header({title, children}) {
    return (
        <div className="bg-teal-700 px-4 py-3 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {children}
        </div>
    )
}