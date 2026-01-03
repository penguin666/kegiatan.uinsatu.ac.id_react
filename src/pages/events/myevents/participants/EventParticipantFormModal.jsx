import React, {useEffect, useState} from "react";
import {useAuth} from "/src/context/AuthProvider.jsx";
import {get} from "/src/api/kegiatan.uinsatu.jsx";
import {toast} from "react-toastify";
import 'react-dual-listbox/lib/react-dual-listbox.css';
import Select from "react-select";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar} from "@fortawesome/free-solid-svg-icons";
import {transports} from "../../../../config/variable.jsx";

export default function EventParticipantFormModal({ handleSubmit, event, refresh}) {
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [transport, setTransport] = useState('');
    const [options, setOptions] = useState([]);

    const fetchOptions = async () => {
        setLoading(true)
        try {
            const result = await get(`/my-events/${event.id}/participants/list-options?size=1000`, accessToken, {});

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
        if (event && event.id)
        {
            fetchOptions();
        }
    }, [event, refresh]);

    const clearSelection = () => {
        const newOptions = options.filter(option => !selectedOptions.some(selectedOption => option.id === selectedOption.id));
        setOptions(newOptions);
        setSelectedOptions([]);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const selected = selectedOptions.map(option => option.id)
        const res = await handleSubmit({user_id:selected, transport});
        if(res)
        {
            clearSelection();
        }
        setLoading(false)
    };

    return (
        <form onSubmit={onSubmit}>
            <h3 className="pb-2">Tambah Peserta Kegiatan</h3>
            <div className="flex md:flex-row flex-col gap-2">
                <div className="w-full items-center">
                    <Select
                        isMulti
                        name="user_id"
                        placeholder="Pilih peserta"
                        options={options}
                        value={selectedOptions}
                        className="basic-multi-select"
                        getOptionLabel={(option) => `${option.username} - ${option.name}`}
                        getOptionValue={(option) => option}
                        onChange={(options) => setSelectedOptions(options)}
                    />
                </div>

                <div className="flex flex-col w-full">
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faCalendar}/>
                        </div>

                        <select
                            name="transport"
                            value={transport}
                            className="text-base placeholder-gray-500 pl-10 pr-4 rounded border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            onChange={(e) => setTransport(e.target.value)}
                            required
                        >
                            <option value="">Pilih mode transportasi</option>
                            {transports.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
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