import React, {useState} from "react";
import {useOutletContext} from "react-router-dom";
import {useAuth} from "../../context/AuthProvider.jsx";
import {toast} from "react-toastify";
import {put} from "../../api/kegiatan.uinsatu.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCertificate, faEnvelopeSquare, faIdCard, faLock} from "@fortawesome/free-solid-svg-icons";
import {usePermissions} from "../../context/PermissionProvider.jsx";

function UserShow() {
    const [user, refreshData] = useOutletContext();
    const {hasPermission} = usePermissions();
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        priority: user.priority,
        password: '',
        password_confirmation: ''
    });

    const handleInputChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await put(`/users/${user.id}`, accessToken, formData);

            if (result.success) {
                setFormData((prev) => ({priority: formData.priority, password: '', password_confirmation: ''}));
                toast.success(result.message);
                return;
            }

            throw result.message;
        } catch (err) {
            toast.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden min-h-40 mb-10">
                <div className="bg-teal-700 px-4 py-3 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Akun</h3>
                </div>

                <div className="px-4 py-3">
                    <form onSubmit={handleSubmit}>
                        {hasPermission('create users') &&
                            <div className="flex flex-col mb-3">
                                <label className="text-gray-700 mb-2">Prioritas</label>
                                <div className="relative">
                                    <div
                                        className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                        <FontAwesomeIcon icon={faCertificate}/>
                                    </div>

                                    <input
                                        type="number"
                                        placeholder="Prioritas"
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                        className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                                    />
                                </div>
                            </div>
                        }

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
                                    value={user.username}
                                    onChange={handleInputChange}
                                    className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                                    readOnly
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
                                    value={user.name}
                                    onChange={handleInputChange}
                                    className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="flex flex-col mb-3">
                            <label className="text-gray-700 mb-2">Email</label>
                            <div className="relative">
                                <div
                                    className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                    <FontAwesomeIcon icon={faEnvelopeSquare}/>
                                </div>

                                <input
                                    type="email"
                                    placeholder="E-mail"
                                    name="email"
                                    value={user.email}
                                    onChange={handleInputChange}
                                    className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="flex flex-col mb-3">
                            <label className="text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                    <FontAwesomeIcon icon={faLock} />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col mb-3">
                            <label className="text-gray-700 mb-2">Konfirmasi Password</label>
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
                                    onChange={handleInputChange}
                                    className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                                />
                            </div>
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                        >
                            {loading ? 'Memprosess...' : 'Simpan'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UserShow