import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {useAuth} from "../../context/AuthProvider.jsx";
import {toast} from "react-toastify";
import {get} from "../../api/kegiatan.uinsatu.jsx";
import SimakProfile from "../../components/Other/SimakProfile.jsx";
import Spinner from "../../components/Other/Spinner.jsx";

export default function UserProfile() {
    const [user] = useOutletContext();
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({});

    const fetchData = async () => {
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
        fetchData();
    }, []);

    if (loading)
    {
        return <Spinner/>
    }

    return (
        <>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden min-h-40 mb-10">
                <div className="bg-teal-700 px-4 py-3 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Profil</h3>
                </div>

                <div className="px-4 py-3">
                    {profile &&
                        <SimakProfile data={profile}/>
                    }
                </div>
            </div>
        </>
    )
}