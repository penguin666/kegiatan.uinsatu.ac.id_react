import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useAuth} from "/src/context/AuthProvider.jsx";
import {get} from "/src/api/kegiatan.uinsatu.jsx";
import {toast} from "react-toastify";
import Spinner from "/src/components/Other/Spinner.jsx";
import PrintEventWrapper from "./PrintEventWrapper.jsx";

export default function PrintEvent() {
    const { eventId } = useParams();
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [event, setEvent] = useState({});
    const [participants, setParticipants] = useState([]);

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

    const fetchParticipants = async () => {
        setLoading(true)
        try {
            const result = await get(`/my-events/${eventId}/participants?size=1000&sortBy=priority&sortOrder=asc`, accessToken, {});

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
            {participants.length > 0 &&
                participants.map((user, index) => (
                    <PrintEventWrapper key={user.id} no={index+1} event={event} user={user}/>
                ))
            }
        </>
    )
}