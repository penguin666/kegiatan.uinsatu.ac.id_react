import {get} from "/src/api/kegiatan.uinsatu.jsx";
import React, {useEffect, useState} from "react";
import {useAuth} from "/src/context/AuthProvider.jsx";
import {toast} from "react-toastify";
import {Link, useOutletContext, useParams} from "react-router-dom";
import Spinner from "/src/components/Other/Spinner.jsx";
import moment from "moment";
import EventSessionQrCode from "./EventSessionQrCode.jsx";
import EventSessionParticipant from "./participants/EventSessionParticipant.jsx";

export default function EventSessionShow() {
    const {accessToken} = useAuth();
    const [event] = useOutletContext();
    let { sessionId } = useParams();
    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState({});

    const isOutsideRange = () =>
    {
        const start = moment(session.start_time); // Tanggal mulai
        const end = moment(session.end_time);   // Tanggal akhir
        const now = moment();

        return now.isBefore(start) || now.isAfter(end);
    }

    const fetchSession = async () => {
        setLoading(true)
        try {
            const result = await get(`/my-events/${event.id}/sessions/${sessionId}`, accessToken, {});

            if (result.success)
            {
                setSession(result.data)
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
        fetchSession();
    }, [sessionId]);

    if (loading)
    {
        return <div className="mt-5"><Spinner/></div>
    }

    return (
        <>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-3">
                <div className="bg-teal-700 px-4 py-3 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">{session.name}</h3>
                    <div className="flex gap-2">
                        <Link
                            to={`/events/my-events/${event.id}/sessions`}
                            className="bg-red-600 text-gray-100 px-2 py-1 rounded-lg shadow-lg text-sm"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-4 gap-y-4 px-4 md:pb-5 pb-10 py-3">
                    {!isOutsideRange() && <EventSessionQrCode uniqueCode={session.session_code} session={session}/>}

                    <div className="col-span-2">
                        <div className="flex flex-col border-b pb-2 mt-3">
                            <span className="text-gray-500 text-sm">Sesi</span>
                            <h4 className="text-gray-700"><strong>{session.name}</strong></h4>
                        </div>
                        <div className="flex flex-col border-b pb-2 mt-3">
                            <span className="text-gray-500 text-sm">Waktu</span>
                            <h4 className="text-gray-700">
                                <strong>
                                    {moment(session.start_time).format('D MMMM Y HH:mm')} s.d. {moment(session.end_time).format('D MMMM Y HH:mm')}
                                </strong>
                            </h4>
                        </div>
                    </div>
                </div>
            </div>

            {session && session.id ?
                <EventSessionParticipant session={session}/>
                :''
            }
        </>
    )
}