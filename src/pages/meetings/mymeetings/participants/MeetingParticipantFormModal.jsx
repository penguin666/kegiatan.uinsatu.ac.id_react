import React, {useEffect, useState} from "react";
import {useAuth} from "/src/context/AuthProvider.jsx";
import {get} from "/src/api/kegiatan.uinsatu.jsx";
import {toast} from "react-toastify";
import 'react-dual-listbox/lib/react-dual-listbox.css';
import Select from "react-select";

function MeetingParticipantFormModal({ handleSubmit, meeting, refresh}) {
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [options, setOptions] = useState([]);

    const fetchOptions = async () => {
        setLoading(true)
        try {
            const result = await get(`/my-meetings/${meeting.id}/participants/list-options?size=1000`, accessToken, {});

            if (result.success)
            {
                setOptions(result.data.data)
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
        if (meeting && meeting.id)
        {
            fetchOptions();
        }
    }, [meeting, refresh]);

    const clearSelection = () => {
        const newOptions = options.filter(option => !selectedOptions.some(selectedOption => option.id === selectedOption.id));
        setOptions(newOptions);
        setSelectedOptions([]);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const selected = selectedOptions.map(option => option.id)
        const res = await handleSubmit(selected);
        if(res)
        {
            clearSelection();
        }
        setLoading(false)
    };

    return (
        <form onSubmit={onSubmit}>
            <h3 className="pb-2">Tambah Peserta Rapat</h3>
            <div className="flex md:flex-row flex-col gap-2">
                <div className="w-full items-center">
                    <Select
                        isMulti
                        name="user_id"
                        options={options}
                        value={selectedOptions}
                        className="basic-multi-select"
                        getOptionLabel={(option) => `${option.username} - ${option.name}`}
                        getOptionValue={(option) => option}
                        onChange={(options) => setSelectedOptions(options)}
                    />
                </div>

                <div className="pb-5 items-center flex">
                    <button
                        type="submit"
                        className="disabled:bg-emerald-300 px-5 py-2 text-white rounded bg-emerald-600 text-sm flex items-center gap-1"
                        disabled={loading}
                    >
                        <span>{loading ? 'Menambahkan...' : 'Tambah'}</span>
                    </button>
                </div>
            </div>
        </form>
    )
}

export default MeetingParticipantFormModal