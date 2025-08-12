import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {useAuth} from "../../../context/AuthProvider.jsx";
import {toast} from "react-toastify";
import {del, get} from "../../../api/kegiatan.uinsatu.jsx";
import Spinner from "../../../components/Other/Spinner.jsx";
import {usePermissions} from "../../../context/PermissionProvider.jsx";
import Modal from "../../../components/Modal/Index.jsx";
import UserRoleFormModal from "./UserRoleFormModal.jsx";

export default function UserRole() {
    const [user] = useOutletContext();
    const {hasPermission} = usePermissions();
    const {accessToken} = useAuth();
    const [roles, setRoles] = useState([]);
    const [roleOptions, setRoleOptions] = useState([]);
    const [loadingPage, setLoadingPage] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(false);

    const fetchRoles = async () => {
        setLoadingPage(true)
        try {
            const result = await get(`/users/${user.id}/roles?page=1&size=50&sortBy=&sortOrder=&term=`, accessToken, {});

            if (result.success) {
                setRoles(result.data.data)
            } else {
                throw result.message
            }
        } catch (error) {
            toast.error(error)
        } finally {
            setLoadingPage(false)
        }
    }

    const fetchRoleOptions = async () => {
        setLoadingPage(true)
        try {
            const result = await get(`/users/${user.id}/roles/list-options?page=1&size=50&sortBy=&sortOrder=&term=`, accessToken, {});

            if (result.success) {
                setRoleOptions(result.data.data)
            } else {
                throw result.message
            }
        } catch (error) {
            toast.error(error)
        } finally {
            setLoadingPage(false)
        }
    }

    useEffect(() => {
        fetchRoles()
        fetchRoleOptions()
    }, [user]);

    const handleOnDelete = (item) => {
        setShowConfirm(true);
        setItemToDelete(item);
    }

    const handleCanceled = () => {
        setShowConfirm(false);
        setItemToDelete(null);
    }

    const handleConfirmed = async () => {
        setLoadingData(true)
        try {
            const result = await del(`/users/${user.id}/roles/${itemToDelete.id}`, accessToken, {});

            if (result.success) {
                setRoles(prev => prev.filter(item => item.id !== itemToDelete.id));
                setRoleOptions(prev => [...prev, itemToDelete]);
                toast.success(result.message)
                handleCanceled();
                return;
            }

            throw result.message;
        } catch (err) {
            toast.error(err)
        }
        finally {
            setLoadingData(false)
        }
    };

    if (loadingPage) {
        return <Spinner/>
    }

    return (
        <>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden min-h-40 mb-10">
                <div className="bg-teal-700 px-4 py-3 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Peran</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                        >
                            Tambah
                        </button>
                    </div>
                </div>

                <div className="px-4 py-3">
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="p-3">
                                    <span className="flex items-center text-xs">
                                        Peran
                                    </span>
                                </th>
                                <th className="p-3">
                                    <span className="flex items-center text-xs">
                                        Aksi
                                    </span>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {roles.length > 0 && roles.map(role => (
                                <tr key={role.id} className="border-b hover:bg-gray-50">
                                    <td className={`p-3 text-gray-700 text-sm`}>
                                        {role.name}
                                    </td>
                                    <td className={`p-3 text-gray-700 text-sm`}>
                                        {hasPermission('delete userroles') &&
                                            <button
                                                className="bg-red-600 text-gray-100 px-2 py-1 rounded-lg shadow-lg text-xs"
                                                onClick={() => handleOnDelete(role)}>
                                                Delete
                                            </button>
                                        }
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {hasPermission('delete userroles') &&
                <Modal
                    show={showConfirm}
                    title="Konfirmasi"
                    onClose={handleCanceled}
                    onSubmit={handleConfirmed}
                    confirmButton="Ya"
                    size="xs"
                    loading={loadingData}
                >
                    <p>Hapus peran {itemToDelete?.name}?</p>
                </Modal>
            }

            {hasPermission('create userroles') &&
                <UserRoleFormModal
                    user={user}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    roleOptions={roleOptions}
                    setRoles={setRoles}
                    setRoleOptions={setRoleOptions}
                />
            }
        </>
    )
}