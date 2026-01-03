import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import {get, post} from "../../api/kegiatan.uinsatu.jsx";
import {toast} from "react-toastify";
import Modal from "../../components/Modal/Index.jsx";
import {useAuth} from "../../context/AuthProvider.jsx";
import moment from "moment";
import {transports} from "../../config/variable.jsx";

export default function EventSearch()
{
    const {accessToken, user} = useAuth();
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [searchedEvent, setSearchedEvent] = useState({});
    const [formData, setFormData] = useState({
        code:'',
        transport:''
    });

    const searchEvent = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (search === '')
            {
                throw 'Pencarian kosong...'
            }

            const result = await get(`/followed-events/search-events?code=${search}`, accessToken, {});

            if (result.success)
            {
                setModalShow(true);
                setSearchedEvent(result.data)
                setFormData(prevState => ({...prevState, code:result.data?.code}))
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!formData.transport.trim()) {
                throw 'Mode transportasi wajib diisi.'
            }

            const result = await post(`/followed-events/${searchedEvent.id}/participants`, accessToken, formData);

            if (result.success)
            {
                toast.success(result.message);
                handleClose()
                setSearch('');
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

    const handleClose = () => {
        setModalShow(false)
        setSearchedEvent({})
    }

    return (
        <>
            <form onSubmit={searchEvent}>
                <div className="flex gap-2">
                    <div className="w-full pb-5 items-center flex relative">
                        <input
                            type="number"
                            name="search"
                            placeholder="Masukkan kode kegiatan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border rounded-full text-sm w-full px-3 py-2 focus:outline-none focus:border-green-300 bg-slate-50"
                        />
                    </div>

                    <div className="pb-5 items-center flex">
                        <button
                            type="submit"
                            className="disabled:bg-emerald-300 px-5 py-2 text-white rounded-full bg-emerald-600 text-sm flex items-center gap-1"
                            disabled={loading}
                        >
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                            />
                            <span>{loading ? 'Mencari...':'Cari'}</span>
                        </button>
                    </div>
                </div>
            </form>

            <Modal
                show={modalShow}
                title={searchedEvent?.name}
                onClose={handleClose}
                onSubmit={handleSubmit}
                loading={loading}
                confirmButton="Konfirmasi Kehadiran"
                size="sm"
            >
                <div className="flex flex-col border-b pb-2">
                    <span className="text-gray-500 text-sm">Kode Kegiatan</span>
                    <h4 className="text-gray-700"><strong>{searchedEvent?.code}</strong></h4>
                </div>
                <div className="flex flex-col border-b pb-2 mt-3">
                    <span className="text-gray-500 text-sm">Tanggal Pelaksanaan</span>
                    <h4 className="text-gray-700">
                        <strong>
                            {moment(searchedEvent?.event_start_date).format('D MMMM Y')} s.d. {moment(searchedEvent?.event_end_date).format('D MMMM Y')}
                        </strong>
                    </h4>
                </div>
                <div className="flex flex-col border-b pb-2 mt-3">
                    <span className="text-gray-500 text-sm">Tempat Kegiatan</span>
                    <h4 className="text-gray-700"><strong>{searchedEvent?.event_place}</strong></h4>
                </div>
                <div className="flex flex-col border-b pb-2 mt-3">
                    <span className="text-gray-500 text-sm">Deskripsi Kegiatan</span>
                    <h4 className="text-gray-700"><strong>{searchedEvent?.description}</strong></h4>
                </div>

                <div className="flex flex-col mt-3">
                    <label className="text-gray-700 mb-2">Mode Transportasi</label>
                    <div className="relative">
                        <div
                            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <FontAwesomeIcon icon={faCalendar}/>
                        </div>

                        <select
                            name="transport"
                            value={formData.transport}
                            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            onChange={(e) => setFormData(prevState => ({...prevState, transport:e.target.value}))}
                            required
                        >
                            <option value="">Pilih mode transportasi</option>
                            {transports.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </Modal>
        </>
    )
}