import {useAuth} from "/src/context/AuthProvider.jsx";
import {useEffect, useState} from "react";
import {get} from "/src/api/kegiatan.uinsatu.jsx";
import {toast} from "react-toastify";
import Spinner from "/src/components/Other/Spinner.jsx";
import PrintEventCv from "./PrintEventCv.jsx";
import PrintEventSp from "./PrintEventSp.jsx";

export default function PrintEventWrapper({user, event, no})
{
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({});

    const fetchProfile = async () => {
        setLoading(true)
        try {
            const result = await get(`/simak/users/${user.simak_id}`, accessToken, {});

            if (result.success)
            {
                setProfile(result.data)
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
    }

    useEffect(() => {
        if (user && user.simak_id)
        {
            fetchProfile();
        }
    }, [user]);

    if(loading)
    {
        return <Spinner/>
    }

    return (
        <>
            <PrintEventCv no={no} event={event} user={user} profile={profile}/>
            <PrintEventSp no={no} event={event} user={user} profile={profile}/>
        </>
    )
}