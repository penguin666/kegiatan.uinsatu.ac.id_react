import React, {useEffect, useState} from "react";
import Modal from "../../../components/Modal/Index.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar, faIdCard} from "@fortawesome/free-solid-svg-icons";
import {useAuth} from "../../../context/AuthProvider.jsx";
import {toast} from "react-toastify";
import {get} from "../../../api/kegiatan.uinsatu.jsx";
import Select from "react-select";

function EventFormModal({ show, handleClose, handleSubmit, defaultData }) {
    const {accessToken} = useAuth();

    const initialFormData = {
        event_start_date:'',
        event_end_date: '',
        confirm_start_date:'',
        confirm_end_date:'',
        name:'',
        description:'',
        event_place:'',
        file:'',
        city_signature:'',
        signed_by:'',
    }

    const [formData, setFormData] = useState(defaultData||initialFormData);
    const [loading, setLoading] = useState(false);
    const [userOptions, setUserOptions] = useState([]);

    const fetchUserOptions = async () => {
        setLoading(true)
        try {
            const result = await get(`/users?&size=1000&sortBy=name&sortOrder=asc`, accessToken, {});

            if (result.success)
            {
                setUserOptions(result.data.data)
            }
            else
            {
                throw result.message
            }
        } catch (error) {
            toast.error(error)
        }
        finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchUserOptions();
    }, []);

    useEffect(() => {
        if (defaultData) {
            setFormData(defaultData);
        } else {
            setFormData(initialFormData);
        }
    }, [defaultData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'file') {
            setFormData({
                ...formData,
                [name]: files[0]
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const onSubmit = async () => {
        setLoading(true)
        const res = await handleSubmit(formData);
        res && handleClose();
        setLoading(false)
    };

    return (
        <Modal
            show={show}
            title={`${defaultData ? 'Edit':'Buat'} Kegiatan`}
            onClose={handleClose}
            onSubmit={onSubmit}
            loading={loading}
            size="md"
        >
            <form onSubmit={onSubmit}>
                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Nama Kegiatan</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faIdCard}/>
                        </div>

                        <input
                            type="text"
                            placeholder="Nama Kegiatan"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex flex-col mb-3">
                        <label className="text-gray-700 mb-2">Tanggal Mulai Kegiatan</label>
                        <div className="relative">
                            <div
                                className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <FontAwesomeIcon icon={faCalendar}/>
                            </div>

                            <input
                                type="date"
                                placeholder="Tanggal Mulai Kegiatan"
                                name="event_start_date"
                                value={formData.event_start_date}
                                onChange={handleChange}
                                required
                                className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col mb-3">
                        <label className="text-gray-700 mb-2">Tanggal Akhir Kegiatan</label>
                        <div className="relative">
                            <div
                                className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <FontAwesomeIcon icon={faCalendar}/>
                            </div>

                            <input
                                type="date"
                                placeholder="Tanggal Akhir Kegiatan"
                                name="event_end_date"
                                value={formData.event_end_date}
                                onChange={handleChange}
                                required
                                className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Deskripsi Kegiatan</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faIdCard}/>
                        </div>

                        <textarea
                            rows={3}
                            placeholder="Deskripsi Kegiatan"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex flex-col mb-3">
                        <label className="text-gray-700 mb-2">Tempat Kegiatan</label>
                        <div className="relative">
                            <div
                                className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <FontAwesomeIcon icon={faCalendar}/>
                            </div>

                            <input
                                type="text"
                                placeholder="Tempat Kegiatan"
                                name="event_place"
                                value={formData.event_place}
                                onChange={handleChange}
                                required
                                className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col mb-3">
                        <label className="text-gray-700 mb-2">Kota Tanda Tangan</label>
                        <div className="relative">
                            <div
                                className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <FontAwesomeIcon icon={faCalendar}/>
                            </div>

                            <input
                                type="text"
                                placeholder="Kota Tanda Tangan"
                                name="city_signature"
                                value={formData.city_signature}
                                onChange={handleChange}
                                required
                                className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Penandatangan</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faCalendar}/>
                        </div>

                        <Select
                            placeholder="Pilih Penandatangan"
                            name="signed_by"
                            options={userOptions}
                            value={formData.signed_by}
                            className="basic-multi-select"
                            getOptionLabel={(option) => `${option.username} - ${option.name}`}
                            getOptionValue={(option) => option}
                            onChange={(option) => setFormData(prev => ({
                                ...prev,
                                signed_by: option
                            }))}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex flex-col mb-3">
                        <label className="text-gray-700 mb-2">Tanggal Mulai Konfirmasi</label>
                        <div className="relative">
                            <div
                                className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <FontAwesomeIcon icon={faCalendar}/>
                            </div>

                            <input
                                type="date"
                                placeholder="Tanggal Mulai Konfirmasi"
                                name="confirm_start_date"
                                value={formData.confirm_start_date}
                                onChange={handleChange}
                                required
                                className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col mb-3">
                        <label className="text-gray-700 mb-2">Tanggal Akhir Konfirmasi</label>
                        <div className="relative">
                            <div
                                className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <FontAwesomeIcon icon={faCalendar}/>
                            </div>

                            <input
                                type="date"
                                placeholder="Tanggal Akhir Konfirmasi"
                                name="confirm_end_date"
                                value={formData.confirm_end_date}
                                onChange={handleChange}
                                required
                                className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    )
}

export default EventFormModal;