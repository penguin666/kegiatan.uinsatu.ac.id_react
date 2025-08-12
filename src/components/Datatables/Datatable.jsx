import React, {useEffect, useState} from "react";
import Paginator from "./Paginator.jsx";
import CustomSpinner from "../Other/Spinner.jsx";
import {Link} from "react-router-dom";
import SearchBar from "./SearchBar.jsx";
import {faAngleUp, faAngleDown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Header from "./Header.jsx";
import ActionButton from "./ActionButton.jsx";
// import '../assets/css/custom-table.css';

function Datatable({
                       title, loading, page, rowsPerPage, sort, actions, selectedKey,
                       rowsPerPageOption, search, total, data, columns, selectable,
                       onSelectRows, onSort, onPageChange, onSearchChange, onRowsPerPageChange, children
}) {
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        if (onSelectRows) {
            onSelectRows(selectedRows);
        }
    }, [selectedRows, onSelectRows]);

    const handleRowSelection = (itemId) => {
        setSelectedRows(prevSelected =>
            prevSelected.includes(itemId)
                ? prevSelected.filter(id => id !== itemId)  // Deselect row
                : [...prevSelected, itemId]                 // Select row
        );
    };

    // Handle "Select All" functionality
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            // setSelectedRows(data.map(item => selectedKey ? item[selectedKey] : item.id)); // Select all rows
            setSelectedRows(data); // Select all rows
        } else {
            setSelectedRows([]); // Deselect all rows
        }
    };

    // const isRowSelected = (itemId) => selectedRows.includes(itemId);
    const isRowSelected = (item) => selectedRows.includes(item);

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {title && (
                <Header title={title}>{children}</Header>
            )}
            <div className="px-4 py-3 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                        <span>Show</span>
                        <select
                            name="rowsPerPage"
                            value={rowsPerPage}
                            onChange={onRowsPerPageChange}
                            className="mx-2 p-1 border rounded text-sm w-full focus:outline-none focus:border-green-300 bg-slate-50"
                        >
                            {rowsPerPageOption.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                        <span>entries</span>
                    </div>
                    {/*    Search Bar*/}
                    <SearchBar search={search} onSearchChange={onSearchChange} />
                    {/*    End Search Bar*/}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        {selectable && (
                            <th className="p-3 text-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    aria-label="Select all"
                                    onChange={handleSelectAll}
                                    checked={selectedRows.length === data.length}
                                />
                            </th>
                        )}
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={`p-3 ${col.className} ${col.sortable ? 'cursor-pointer' : ''}`}
                                onClick={col.sortable ? () => onSort(col.key) : undefined}
                            >
                                    <span className="flex items-center text-xs">
                                        {col.label.toUpperCase()}
                                        {col.sortable && sort.sortBy === col.key && (
                                            sort.sortOrder === 'asc' ? (
                                                <FontAwesomeIcon icon={faAngleUp} />
                                            ) : (
                                                <FontAwesomeIcon icon={faAngleDown} />
                                            )
                                        )}
                                    </span>
                            </th>
                        ))}
                        {actions && actions.actions.length > 0 && (
                            <th className="p-3 text-center text-sm">Aksi</th>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}>
                                <div className="flex justify-center py-4">
                                    <CustomSpinner/>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        total > 0 ? (
                            data.map((item) => (
                                <tr key={item.id || item.ID} className="border-b hover:bg-gray-50">
                                    {selectable && (
                                        <td className="p-3 text-center">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox"
                                                checked={isRowSelected(item)}
                                                onChange={() => handleRowSelection(item)}
                                            />
                                        </td>
                                    )}
                                    {columns.map((col) => (
                                        <td key={col.key} className={`p-3 ${col.className} text-gray-700 text-sm`} data-label={col.label}>
                                            {col.render ? col.render(item) : item[col.key]}
                                        </td>
                                    ))}

                                    <ActionButton actions={actions} item={item}/>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                                    className="p-3 text-center text-gray-500">
                                    Data tidak ditemukan
                                </td>
                            </tr>
                        )
                    )}
                    </tbody>
                </table>
            </div>

            {total > 0 && (
                <div className="p-4">
                    <Paginator
                        page={page}
                        total={total}
                        rowsPerPage={rowsPerPage}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </div>
    )
}

export default Datatable;