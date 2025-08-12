import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useAuth} from "/src/context/AuthProvider.jsx";
import {get} from "/src/api/kegiatan.uinsatu.jsx";
import {toast} from "react-toastify";
import Spinner from "/src/components/Other/Spinner.jsx";
import moment from "moment";
import '/src/assets/css/print.css'
import Tr from "./Tr.jsx";

export default function PrintEventAttendees() {
    const { eventId } = useParams();
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [event, setEvent] = useState({});
    const [participants, setParticipants] = useState([]);

    const fetchEvent = async () => {
        setLoading(true)
        try {
            const result = await get(`/events/${eventId}`, accessToken, {});

            if (result.success)
            {
                setEvent(result.data)
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

    const fetchParticipants = async () => {
        setLoading(true)
        try {
            const result = await get(`/events/${eventId}/participants?size=1000&sortBy=priority&sortOrder=asc`, accessToken, {});

            if (result.success)
            {
                setParticipants(result.data.data)
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
        fetchEvent();
        fetchParticipants();
    }, [eventId]);

    if (loading)
    {
        return <div className="mt-5"><Spinner/></div>
    }

    return (
        <>
            {Array.from({ length: event.duration }).map((_, index) => {
                const currentDate = moment(event.event_start_date).add(index, 'days'); // Tambah hari berdasarkan iterasi
                return (
                    <div key={index}>
                        <h1 className="font-bold text-xl text-center mb-3">
                            Daftar Hadir Peserta {event.name} <br />
                            UIN Sayyid Ali Rahmatullah Tulungagung <br />
                            {event.event_place}, {moment(event.event_start_date).format('DD MMMM Y')} s.d. {moment(event.event_end_date).format('DD MMMM Y')}
                        </h1>

                        <table>
                            <tbody>
                            <tr>
                                <td>Hari</td>
                                <td>:</td>
                                <td>{currentDate.format('dddd')}</td>
                            </tr>
                            <tr>
                                <td>Tanggal</td>
                                <td>:</td>
                                <td>{currentDate.format('DD MMMM Y')}</td>
                            </tr>
                            </tbody>
                        </table>

                        <table className="w-full border border-collapse">
                            <thead>
                            <tr>
                                <th className="border border-collapse">NO</th>
                                <th className="w-4/12 border border-collapse">NAMA</th>
                                <th className="w-4/12 border border-collapse">KETERANGAN</th>
                                <th colSpan="2" className="w-4/12 border border-collapse">TANDA TANGAN</th>
                            </tr>
                            </thead>
                            <tbody>
                            {participants.length > 0 ? (
                                participants.map((participant, index) => (
                                    <Tr key={participant.id} no={index+1} participant={participant}/>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center p-4">Tidak ada peserta</td>
                                </tr>
                            )}
                            </tbody>
                        </table>

                        <div
                            className="flex justify-center items-center py-20"
                            style={{ marginLeft: '20%' }}
                        >
                            <div>
                                <span>{event.city_signature}, {currentDate.format('DD MMMM Y')}</span>
                                <br /><br /><br /><br /><br />
                                <span>{event.signer_name}</span>
                                <br />
                                <span>NIP {event.signer_username}</span>
                            </div>
                        </div>

                        <div className="pagebreak"></div>
                    </div>
                );
            })}

        </>
    )
}