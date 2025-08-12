import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {useAuth} from "/src/context/AuthProvider.jsx";
import {toast} from "react-toastify";
import {del, get} from "/src/api/kegiatan.uinsatu.jsx";
import Spinner from "/src/components/Other/Spinner.jsx";
import {usePermissions} from "/src/context/PermissionProvider.jsx";
import Modal from "/src/components/Modal/Index.jsx";
import UserUnitFormModal from "./UserUnitFormModal.jsx";

export default function UserUnit() {
    const [user] = useOutletContext();
    const {hasPermission} = usePermissions();
    const {accessToken} = useAuth();
    const [data, setData] = useState([]);
    const [options, setOptions] = useState([]);
    const [loadingPage, setLoadingPage] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(false);

    const fetchData = async () => {
        setLoadingPage(true)
        try {
            const result = await get(`/users/${user.id}/units?page=1&size=50&sortBy=&sortOrder=&term=`, accessToken, {});

            if (result.success) {
                setData(result.data.data)
            } else {
                throw result.message
            }
        } catch (error) {
            toast.error(error)
        } finally {
            setLoadingPage(false)
        }
    }

    const fetchOptions = async () => {
        setLoadingPage(true)
        try {
            const result = await get(`/units?page=1&size=50&sortBy=&sortOrder=&term=`, accessToken, {});

            if (result.success) {
                setOptions(result.data.data)
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
        fetchData()
        fetchOptions()
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
            const result = await del(`/users/${user.id}/units/${itemToDelete.id}`, accessToken, {});

            if (result.success) {
                setData(prev => prev.filter(item => item.id !== itemToDelete.id));
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
                    <h3 className="text-lg font-semibold text-white">Unit</h3>
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
                                        Unit
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
                            {data.length > 0 && data.map(d => (
                                <tr key={d.id} className="border-b hover:bg-gray-50">
                                    <td className={`p-3 text-gray-700 text-sm`}>
                                        {d.unit}
                                    </td>
                                    <td className={`p-3 text-gray-700 text-sm`}>
                                        {hasPermission('delete userroles') &&
                                            <button
                                                className="bg-red-600 text-gray-100 px-2 py-1 rounded-lg shadow-lg text-xs"
                                                onClick={() => handleOnDelete(d)}>
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

            <Modal
                show={showConfirm}
                title="Konfirmasi"
                onClose={handleCanceled}
                onSubmit={handleConfirmed}
                confirmButton="Ya"
                size="xs"
                loading={loadingData}
            >
                <p>Hapus unit {itemToDelete?.unit}?</p>
            </Modal>

            <UserUnitFormModal
                user={user}
                showModal={showModal}
                setShowModal={setShowModal}
                options={options}
                setData={setData}
            />
        </>
    )
}