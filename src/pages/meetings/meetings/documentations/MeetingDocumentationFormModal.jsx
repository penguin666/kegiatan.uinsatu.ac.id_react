import React, {useState} from "react";
import Modal from "../../../../components/Modal/Index.jsx";
import {useAuth} from "../../../../context/AuthProvider.jsx";
import {toast} from "react-toastify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFile, faIdCard} from "@fortawesome/free-solid-svg-icons";
import {post} from "../../../../api/kegiatan.uinsatu.jsx";

function MeetingDocumentationFormModal({ show, handleClose, refreshParent, meeting}) {
    const initialFormData = {
        name:'',
        photo:null
    }

    const [formData, setFormData] = useState(initialFormData);
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'photo') {
            // Jika input adalah file, gunakan files[0] untuk mendapatkan file yang dipilih
            setFormData({
                ...formData,
                [name]: files[0] // Simpan file yang dipilih ke dalam formData.photo
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('photo', formData.photo); // Menambahkan file

            const result = await post(`/meetings/${meeting.id}/documentations`, accessToken, data);

            if (result.success)
            {
                refreshParent();
                setFormData(initialFormData);
                toast.success(result.message);
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
    };

    return (
        <Modal
            show={show}
            title={`Tambah Foto`}
            onClose={handleClose}
            onSubmit={handleSubmit}
            loading={loading}
        >
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">Nama Foto</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faIdCard}/>
                        </div>

                        <input
                            type="text"
                            placeholder="Nama Foto"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col mb-3">
                    <label className="text-gray-700 mb-2">
                        Foto
                        <span className="text-red-500 mx-1">(Maks. 1 Mb)</span>
                    </label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faFile}/>
                        </div>

                        <input
                            type="file"
                            placeholder="Foto"
                            name="photo"
                            onChange={handleInputChange}
                            accept=".jpg,.jpeg"
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            required
                        />
                    </div>
                </div>
            </form>
        </Modal>
    )
}

export default MeetingDocumentationFormModal