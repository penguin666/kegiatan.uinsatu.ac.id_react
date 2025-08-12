import React, {useState} from "react";
import Modal from "/src/components/Modal/Index.jsx";
import {useAuth} from "/src/context/AuthProvider.jsx";
import {post} from "/src/api/kegiatan.uinsatu.jsx";
import {toast} from "react-toastify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBuilding} from "@fortawesome/free-solid-svg-icons";

export default function UserUnitFormModal({user, showModal, setShowModal, options, setData}) {
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [unitId, setUnitId] = useState('');

    const handleClose = () => setShowModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await post(`/users/${user.id}/units`, accessToken, {unit_id: unitId});

            if (result.success)
            {
                const newUnit = options.find(opt => opt.id === parseInt(unitId));

                if (newUnit) {
                    setData(prev => [...prev, newUnit]);
                }

                setUnitId('');
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

    return (
        <Modal
            show={showModal}
            title={`Tambah Unit`}
            onClose={handleClose}
            onSubmit={handleSubmit}
            loading={loading}
            size="xs"
        >
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Pilih Unit</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faBuilding}/>
                        </div>

                        <select
                            name="unit_id"
                            value={unitId}
                            onChange={(e) => setUnitId(e.target.value)}
                            required
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        >
                            <option value="">Pilih Unit</option>
                            {options.length > 0 && options.map(option => (
                                <option key={option.id} value={option.id}>{option.unit}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </form>
        </Modal>
    )
}