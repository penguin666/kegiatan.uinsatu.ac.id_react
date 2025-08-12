import React, {useEffect, useState} from "react";
import {Link, Outlet, useParams} from "react-router-dom";
import {get} from "/src/api/kegiatan.uinsatu.jsx";
import {useAuth} from "/src/context/AuthProvider.jsx";
import Spinner from "/src/components/Other/Spinner.jsx";
import {toast} from "react-toastify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faUser, faUsers} from "@fortawesome/free-solid-svg-icons";
import NotFound from "/src/pages/NotFound.jsx";
import {usePermissions} from "/src/context/PermissionProvider.jsx";
import EventShow from "./EventShow.jsx";
import DropdownButton from "/src/components/DropdownButton/Index.jsx";
import axios from "axios";
import {BASE_API_URL} from "../../../config/variable.jsx";
import moment from "moment/moment.js";

export default function EventShowLayout() {
    let { eventId } = useParams();
    const {accessToken} = useAuth();
    const {hasPermission} = usePermissions();
    const [loading, setLoading] = useState(false);
    const [event, setEvent] = useState({});

    const fetchEvent = async () => {
        setLoading(true)
        try {
            const result = await get(`/my-events/${eventId}`, accessToken, {});

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

    const downloadExcel = async () => {
        try {
            const response = await axios.get(`${BASE_API_URL}/my-events/${eventId}/participants/download`, {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Menambahkan Bearer Token
                    Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Memastikan format respons adalah PDF
                },
            });

            saveAs(response.data, `${moment().format('YYYYMMDDHHmmss')}_${eventId}.xlsx`);
        } catch (error) {
            console.error('Error saat mendownload Excel:', error);
        }
    };

    const handleOptionSelect = (option) => {
        if (option.value === 'daftarhadir')
        {
            window.open(`/events/my-events/${eventId}/print/attendees`,'_blank', 'rel=noopener noreferrer')
        }
        else if (option.value === 'cvnsp')
        {
            window.open(`/events/my-events/${eventId}/print`,'_blank', 'rel=noopener noreferrer')
        }
        else if (option.value === 'excel')
        {
            downloadExcel()
        }
    };

    const options = [
        { label: "Daftar Hadir", value: "daftarhadir" },
        { label: "CV & Surat Pernyataan", value: "cvnsp" },
        { label: "Download Excel", value: "excel" },
    ];

    if (!hasPermission('create myevents'))
    {
        return <NotFound />
    }

    if (loading)
    {
        return <div className="mt-5"><Spinner/></div>
    }

    return (
        <>
            <div className="container mx-auto px-4 mt-5">
                <div className="flex md:flex-row flex-col justify-between items-center mb-5">
                    <div className="mb-3 md:mb-0">
                        <h2 className="text-xl">{event.name}</h2>
                        <div className="text-xs">
                            <FontAwesomeIcon icon={faUser}/> Dibuat Oleh: {event.creator_name}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <DropdownButton
                            buttonLabel="Aksi"
                            options={options}
                            onOptionSelect={handleOptionSelect}
                        />

                        <Link
                            to={'/events/my-events'}
                            className="bg-red-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-4 gap-y-4 pb-20">
                    <EventShow event={event}/>

                    <div className="col-span-2">
                        <div className="justify-center space-x-4 grid grid-cols-2">
                            <div className="bg-teal-700 shadow rounded-lg overflow-hidden text-white mb-3">
                                <div className="px-3 py-2">
                                    <Link
                                        to={`/events/my-events/${eventId}`}
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
                                        to={`/events/my-events/${eventId}/sessions`}
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