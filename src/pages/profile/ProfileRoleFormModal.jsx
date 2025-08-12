import React, {useState} from "react";
import Modal from "../../components/Modal/Index.jsx";
import {useAuth} from "../../context/AuthProvider.jsx";
import {post} from "../../api/kegiatan.uinsatu.jsx";
import {toast} from "react-toastify";

export default function ProfileRoleFormModal({user, showModal, setShowModal, roleOptions, setRoles, setRoleOptions}) {
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    const handleClose = () => setShowModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await post(`/users/${user.id}/roles`, accessToken, {roles: selectedRows});

            if (result.success)
            {
                const updatedRoles = roleOptions.filter(
                    (role) => selectedRows.includes(role.name)
                );

                setRoles(prev => [...prev, ...updatedRoles]);

                setRoleOptions(prev => prev.filter(role => !selectedRows.includes(role.name)));

                setSelectedRows([]);
                toast.success(result.message)
                handleClose();
                return;
            }

            throw result.message;
        }
        catch (err)
        {
            toast.error(err)
        }
        finally {
            setLoading(false)
        }
    }

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
            setSelectedRows(roleOptions.map(item => item.name)); // Select all rows
        } else {
            setSelectedRows([]); // Deselect all rows
        }
    };

    const isRowSelected = (itemId) => selectedRows.includes(itemId);

    return (
        <Modal
            show={showModal}
            title={`Tambah Peran`}
            onClose={handleClose}
            onSubmit={handleSubmit}
            loading={loading}
            size="md"
        >
            <form onSubmit={handleSubmit}>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-3 text-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    aria-label="Pilih semua"
                                    onChange={handleSelectAll}
                                    checked={selectedRows.length === roleOptions.length}
                                />
                            </th>
                            <th className="p-3 text-center">
                                Peran
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {roleOptions.length > 0 && roleOptions.map(role => (
                            <tr key={role.id} className="border-b hover:bg-gray-50">
                                <td className={`p-3 text-gray-700 text-sm text-center`}>
                                    <input
                                        className="form-checkbox"
                                        type="checkbox"
                                        checked={isRowSelected(role.name)}
                                        onChange={() => handleRowSelection(role.name)}
                                    />
                                </td>
                                <td className="text-center">{role.name}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </form>
        </Modal>
    )
}