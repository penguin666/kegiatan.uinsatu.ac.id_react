import React, {useEffect, useState} from "react";
import Modal from "../../components/Modal/Index.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar, faEnvelope, faIdCard, faLock} from "@fortawesome/free-solid-svg-icons";

function UserAdminFormModal({ show, handleClose, handleSubmit, defaultData }) {
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
            title={defaultData ? 'Edit Admin':'Buat Admin'}
            onClose={handleClose}
            onSubmit={onSubmit}
            loading={loading}
            size="md"
        >
            <form onSubmit={onSubmit}>
                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Username</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faIdCard}/>
                        </div>

                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                </div>

                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Nama</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faIdCard}/>
                        </div>

                        <input
                            type="text"
                            placeholder="Nama"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                </div>

                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Email</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faEnvelope}/>
                        </div>

                        <input
                            type="email"
                            placeholder="E-mail"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                </div>
                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Password</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faLock}/>
                        </div>

                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                </div>
                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Email</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faLock}/>
                        </div>

                        <input
                            type="password"
                            placeholder="Konfirmasi Password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        />
                    </div>
                </div>
            </form>
        </Modal>
    )
}

export default UserAdminFormModal;