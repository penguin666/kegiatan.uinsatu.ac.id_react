import React, {useEffect, useState} from "react";
import {Link, Outlet, useParams} from "react-router-dom";
import {get} from "../../../api/kegiatan.uinsatu.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import Spinner from "../../../components/Other/Spinner.jsx";
import {toast} from "react-toastify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faUser, faUsers} from "@fortawesome/free-solid-svg-icons";
import EventParticipant from "./participants/EventParticipant.jsx";
import EventShow from "./EventShow.jsx";

export default function EventShowLayout() {
    let { eventId } = useParams();
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [event, setEvent] = useState({});

    const fetchEvent = async () => {
        setLoading(true)
        try {
            const result = await get(`/followed-events/${eventId}`, accessToken, {});

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

    useEffect(() => {
        fetchEvent();
    }, [eventId]);

    if (loading)
    {
        return <div className="mt-5"><Spinner/></div>
    }

    return (
        <>
            <div className="container mx-auto px-4 mt-5 pb-20 md:pb-10">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h2 className="text-xl">{event.name}</h2>
                        <div className="text-xs">
                            <FontAwesomeIcon icon={faUser}/> Dibuat Oleh: {event.creator_name}
                        </div>
                    </div>

                    <Link
                        to={'/events/followed-events'}
                        className="bg-red-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                    >
                        Kembali
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-4 gap-y-4">
                    <EventShow event={event}/>

                    <div className="col-span-2">
                        <div className="justify-center space-x-4 grid grid-cols-2">
                            <div className="bg-teal-700 shadow rounded-lg overflow-hidden text-white mb-3">
                                <div className="px-3 py-2">
                                    <Link
                                        to={`/events/followed-events/${eventId}`}
                                        className="flex flex-row justify-center items-center text-gray-200 hover:text-white transition"
                                    >
                                        <FontAwesomeIcon icon={faUsers} className="mx-1"/>
                                        <span className="mx-1">Peserta</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="bg-teal-700 shadow rounded-lg overflow-hidden text-white mb-3">
                                <div className="px-3 py-2">
                                    <Link
                                        to={`/events/followed-events/${eventId}/sessions`}
                                        className="flex flex-row justify-center items-center text-gray-200 hover:text-white transition"
                                    >
                                        <FontAwesomeIcon icon={faClock}/>
                                        <span className="mx-1">Sesi</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/*{event && event.id && <EventParticipant event={event}/>}*/}
                        {event && event.id && <Outlet context={[event]}/>}
                    </div>
                </div>
            </div>
        </>
    )
}