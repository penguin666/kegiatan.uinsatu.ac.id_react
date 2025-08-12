import React, {useEffect, useState} from "react";
import Modal from "../../../components/Modal/Index.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar, faIdCard} from "@fortawesome/free-solid-svg-icons";

function MeetingFormModal({ show, handleClose, handleSubmit, defaultData }) {
    const initialFormData = {
        name:'',
        date: ''
    }
    const [formData, setFormData] = useState(defaultData||initialFormData);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (defaultData) {
            setFormData(defaultData);
        } else {
            setFormData(initialFormData);
        }
    }, [defaultData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
            title={defaultData ? 'Edit Rapat':'Buat Rapat'}
            onClose={handleClose}
            onSubmit={onSubmit}
            loading={loading}
            size="md"
        >
            <form onSubmit={onSubmit}>
                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Tanggal Rapat</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faCalendar}/>
                        </div>

                        <input
                            type="date"
                            placeholder="Tanggal rapat"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                </div>

                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Nama Rapat</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faIdCard}/>
                        </div>

                        <input
                            type="text"
                            placeholder="Nama rapat"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                </div>
            </form>
        </Modal>
    )
}

export default MeetingFormModal;