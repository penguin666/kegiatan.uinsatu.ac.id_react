import React, {Suspense, useEffect, useState} from "react";
import {Link, Outlet, useParams} from "react-router-dom";
import {get} from "../../../api/kegiatan.uinsatu.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import Spinner from "../../../components/Other/Spinner.jsx";
import {toast} from "react-toastify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar, faHandshake, faPhotoVideo, faUsers} from "@fortawesome/free-solid-svg-icons";
import moment from 'moment';
import NotFound from "../../NotFound.jsx";
import {usePermissions} from "../../../context/PermissionProvider.jsx";

export default function MeetingShowLayout() {
    let { meetingId } = useParams();
    const { hasPermission } = usePermissions();
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [meeting, setMeeting] = useState({});
    const [refresh, setRefresh] = useState(false);

    const refreshData = () => {
        setRefresh(!refresh);
    }

    const fetchMeeting = async () => {
        setLoading(true)
        try {
            const result = await get(`/meetings/${meetingId}`, accessToken, {});

            if (result.success)
            {
                setMeeting(result.data)
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
        fetchMeeting();
    }, [meetingId, refresh]);

    if (!hasPermission('create meetings'))
    {
        return <NotFound />
    }

    if (loading)
    {
        return <div className="mt-5"><Spinner/></div>
    }

    return (
        <>
            <div className="container mx-auto px-4 mt-5 pb-20 md:pb-10">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h2 className="text-xl">{meeting.name}</h2>
                        <div className="text-xs">
                            <FontAwesomeIcon icon={faCalendar}/> {moment(meeting.date).format('DD MMMM Y')}
                        </div>
                    </div>

                    <Link
                        to={'/meetings/admin'}
                        className="bg-red-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                    >
                        Kembali
                    </Link>
                </div>

                <div className="justify-center space-x-4 grid grid-cols-3">
                    <div className="bg-teal-700 shadow rounded-lg overflow-hidden text-white mb-3">
                        <div className="px-4 py-3">
                            <Link
                                to={`/meetings/admin/${meetingId}`}
                                className="flex flex-row justify-center items-center text-gray-200 hover:text-white transition"
                            >
                                <FontAwesomeIcon icon={faHandshake} className="mx-1"/>
                                <span className="mx-1">Hasil</span>
                            </Link>
                        </div>
                    </div>
                    <div className="bg-teal-700 shadow rounded-lg overflow-hidden text-white mb-3">
                        <div className="px-4 py-3">
                            <Link
                                to={`/meetings/admin/${meetingId}/participants`}
                                className="flex flex-row justify-center items-center text-gray-200 hover:text-white transition"
                            >
                                <FontAwesomeIcon icon={faUsers}/>
                                <span className="mx-1">Peserta</span>
                            </Link>
                        </div>
                    </div>
                    <div className="bg-teal-700 shadow rounded-lg overflow-hidden text-white mb-3">
                        <div className="px-4 py-3">
                            <Link
                                to={`/meetings/admin/${meetingId}/documentations`}
                                className="flex flex-row justify-center items-center text-gray-200 hover:text-white transition"
                            >
                                <FontAwesomeIcon icon={faPhotoVideo}/>
                                <span className="mx-1">Dokumentasi</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <Suspense fallback={<Spinner/>}>
                    <Outlet context={[meeting, refreshData]}/>
                </Suspense>
            </div>
        </>
    )
}