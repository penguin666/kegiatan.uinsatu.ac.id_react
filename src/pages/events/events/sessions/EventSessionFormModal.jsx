import React, {useEffect, useState} from "react";
import Modal from "/src/components/Modal/Index.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar, faClock, faIdCard} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

export default function EventSessionFormModal({ show, handleClose, handleSubmit, defaultData }) {
    const initialFormData = {
        name:'',
        start_date: '',
        end_date:'',
        start_time: '',
        end_time:''
    }

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (defaultData) {
            setFormData({
                name:defaultData.name,
                start_date: moment(defaultData.start_time).format('YYYY-MM-DD'),
                end_date: moment(defaultData.end_time).format('YYYY-MM-DD'),
                start_time: moment(defaultData.start_time).format('HH:mm'),
                end_time:moment(defaultData.end_time).format('HH:mm')
            });
        } else {
            setFormData(initialFormData);
        }
    }, [defaultData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
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
            title={`${defaultData ? 'Edit':'Tambah'} Sesi`}
            onClose={handleClose}
            onSubmit={onSubmit}
            loading={loading}
            size="sm"
        >
            <form onSubmit={onSubmit}>
                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Nama Sesi</label>
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
                        <label className="text-gray-700 mb-2">Tanggal Mulai Sesi</label>
                        <div className="relative">
                            <div
                                className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <FontAwesomeIcon icon={faCalendar}/>
                            </div>

                            <input
                                type="date"
                                placeholder="Tanggal Mulai Sesi"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                required
                                className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col mb-3">
                        <label className="text-gray-700 mb-2">Waktu Mulai Sesi</label>
                        <div className="relative">
                            <div
                                className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <FontAwesomeIcon icon={faClock}/>
                            </div>

                            <select
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleChange}
                                required
                                className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            >
                                {Array.from({ length: 24 }, (_, hour) => hour).flatMap((hour) =>
                                    [0, 15, 30, 45].map((minute) => {
                                        const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                                        return (
                                            <option key={formattedTime} value={formattedTime}>
                                                {formattedTime}
                                            </option>
                                        );
                                    })
                                )}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex flex-col mb-3">
                        <label className="text-gray-700 mb-2">Tanggal Akhir Sesi</label>
                        <div className="relative">
                            <div
                                className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <FontAwesomeIcon icon={faCalendar}/>
                            </div>

                            <input
                                type="date"
                                placeholder="Tanggal Akhir Sesi"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                required
                                className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col mb-3">
                        <label className="text-gray-700 mb-2">Waktu Akhir Sesi</label>
                        <div className="relative">
                            <div
                                className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <FontAwesomeIcon icon={faClock}/>
                            </div>

                            <select
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleChange}
                                required
                                className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            >
                                {Array.from({ length: 24 }, (_, hour) => hour).flatMap((hour) =>
                                    [0, 15, 30, 45].map((minute) => {
                                        const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                                        return (
                                            <option key={formattedTime} value={formattedTime}>
                                                {formattedTime}
                                            </option>
                                        );
                                    })
                                )}
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    )
}