import React, {useEffect, useState} from "react";
import Modal from "/src/components/Modal/Index.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar, faIdCard} from "@fortawesome/free-solid-svg-icons";
import {get} from "/src/api/kegiatan.uinsatu.jsx";
import {toast} from "react-toastify";
import {useAuth} from "/src/context/AuthProvider.jsx";

function GuestBookFormModal({ show, handleClose, handleSubmit, defaultData, units, loading }) {
    const initialFormData = {
        type_id:'',
        unit_id: '',
        unit_position_id: '',
        date_of_visit: '',
        name: '',
        email:'',
        hp: '',
        address: '',
        needs: '',
        satisfaction: '',
        suggestion: '',
    }

    const {accessToken} = useAuth();
    const [formData, setFormData] = useState(defaultData||initialFormData);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [positions, setPositions] = useState([]);
    const [types, setTypes] = useState([]);

    const fetchPosition = async (unitId) => {
        setLoadingSubmit(true);
        try {
            const result = await get(`/units/${unitId}/positions?size=50`, accessToken, {});

            if (result.success) {
                setPositions(result.data.data)
            } else {
                throw result.message
            }
        } catch (error) {
            toast.error(error)
        }finally {
            setLoadingSubmit(false)
        }
    }

    const fetchTypes = async () => {
        setLoadingSubmit(true);
        try {
            const result = await get(`/guest-types?size=50`, accessToken, {});

            if (result.success) {
                setTypes(result.data.data)
            } else {
                throw result.message
            }
        } catch (error) {
            toast.error(error)
        }finally {
            setLoadingSubmit(false)
        }
    }

    useEffect(() => {
        fetchTypes();
    }, []);

    useEffect(() => {
        if (formData.unit_id)
        {
            fetchPosition(formData.unit_id)
        }
        else
        {
            setPositions([])
        }
    }, [formData.unit_id]);


    useEffect(() => {
        if (defaultData) {
            setFormData({
                ...defaultData,
                satisfaction: defaultData.satisfaction ? 1:0, // Memastikan boolean selalu ada
            });
        } else {
            setFormData(initialFormData);
        }
    }, [defaultData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const onSubmit = async () => {
        setLoadingSubmit(true)
        const res = await handleSubmit(formData);
        res && handleClose();
        setLoadingSubmit(false)
    };

    return (
        <Modal
            show={show}
            title={defaultData ? 'Edit Tamu':'Tambah Tamu'}
            onClose={handleClose}
            onSubmit={onSubmit}
            loading={loadingSubmit}
            size="sm"
        >
            <form onSubmit={onSubmit}>
                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Jenis Tamu</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faIdCard}/>
                        </div>

                        <select
                            name="type_id"
                            value={formData.type_id}
                            onChange={handleChange}
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            required
                            disabled={loadingSubmit}
                        >
                            <option value="">Pilih salah satu</option>
                            {types.map(t => (
                                <option key={t.id} value={t.id}>{t.type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Tanggal Kunjungan</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faCalendar}/>
                        </div>

                        <input
                            required
                            type="date"
                            placeholder="Tanggal Kunjungan"
                            name="date_of_visit"
                            value={formData.date_of_visit}
                            onChange={handleChange}
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                </div>

                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Nama Pengunjung</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faIdCard}/>
                        </div>

                        <input
                            required
                            type="text"
                            placeholder="Nama Pengunjung"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                </div>

                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Email Pengunjung</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faIdCard}/>
                        </div>

                        <input
                            required
                            type="email"
                            placeholder="Email Pengunjung"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                </div>

                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Handphone Pengunjung</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faIdCard}/>
                        </div>

                        <input
                            required
                            type="number"
                            placeholder="Handphone Pengunjung"
                            name="hp"
                            value={formData.hp}
                            onChange={handleChange}
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                </div>

                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Alamat / Asal Instansi</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faIdCard}/>
                        </div>

                        <input
                            required
                            type="text"
                            placeholder="Alamat / Asal Instansi"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                </div>

                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Unit Tujuan</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faIdCard}/>
                        </div>

                        <select
                            name="unit_id"
                            value={formData.unit_id}
                            onChange={handleChange}
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            required
                            disabled={loading}
                        >
                            <option value="">Pilih salah satu</option>
                            {units.map(unit => (
                                <option key={unit.id} value={unit.id}>{unit.unit}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Jabatan Tujuan</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faIdCard}/>
                        </div>

                        <select
                            name="unit_position_id"
                            value={formData.unit_position_id}
                            onChange={handleChange}
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            required
                            disabled={loadingSubmit}
                        >
                            <option value="">Pilih salah satu</option>
                            {positions.map(p => (
                                <option key={p.id} value={p.pivot.id}>{p.position}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Keperluan</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faIdCard}/>
                        </div>

                        <input
                            required
                            type="text"
                            placeholder="Keperluan"
                            name="needs"
                            value={formData.needs}
                            onChange={handleChange}
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                </div>

                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Apakah Anda Puas Dengan Pelayanan Tamu di UIN SATU</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faIdCard}/>
                        </div>

                        <select
                            name="satisfaction"
                            value={formData.satisfaction}
                            onChange={handleChange}
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            required
                        >
                            <option value="">Pilih salah satu</option>
                            <option value="1">Puas</option>
                            <option value="0">Tidak</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Saran Perbaikan Atas Pelayanan Tamu</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faIdCard}/>
                        </div>

                        <input
                            required
                            type="text"
                            placeholder="Saran Perbaikan"
                            name="suggestion"
                            value={formData.suggestion}
                            onChange={handleChange}
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                </div>
            </form>
        </Modal>
    )
}

export default GuestBookFormModal;