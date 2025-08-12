import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import {get, post} from "../../api/kegiatan.uinsatu.jsx";
import {toast} from "react-toastify";
import Modal from "../../components/Modal/Index.jsx";
import {useAuth} from "../../context/AuthProvider.jsx";
import moment from "moment";

export default function EventSearch()
{
    const {accessToken, user} = useAuth();
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [searchedEvent, setSearchedEvent] = useState({});

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
            const result = await post(`/followed-events/${searchedEvent.id}/participants`, accessToken, {code:searchedEvent.code});

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
                <div className="flex flex-col border-b pb-2 mt-3">
                    <span className="text-gray-500 text-sm">Tanggal Konfirmasi</span>
                    <h4 className="text-gray-700">
                        <strong>
                            {moment(searchedEvent?.confirm_start_date).format('D MMMM Y')} s.d. {moment(searchedEvent?.confirm_end_date).format('D MMMM Y')}
                        </strong>
                    </h4>
                </div>
            </Modal>
        </>
    )
}