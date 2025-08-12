import React, {useEffect, useState} from "react";
import {get} from "../../../../api/kegiatan.uinsatu.jsx";
import {toast} from "react-toastify";
import {useAuth} from "../../../../context/AuthProvider.jsx";

export default function Tr({no, participant}){
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({});
    const [position, setPosition] = useState(null);
    const [functional, setFunctional] = useState(null);

    const fetchProfile = async () => {
        setLoading(true)
        try {
            const result = await get(`/simak/users/${participant.simak_id}`, accessToken, {});

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
        if (participant && participant.simak_id)
        {
            fetchProfile();
        }
    }, [participant]);

    useEffect(() => {
        if (profile && profile.positions) {
            const positionNow = profile.positions.filter(item => item.endYear === 0);
            setPosition(positionNow[0])
        }

        if (profile.functionals && profile.functionals.length > 0) {
            const sortedFunctionals = profile.functionals.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
            setFunctional(sortedFunctionals[0]);
        }
    }, [profile]);

    return (
        <tr>
            <td className="w-1/12 border border-collapse text-center p-2">{no}</td>
            <td className="w-1/12 border border-collapse p-2">{participant.name}</td>
            <td className="w-1/12 border border-collapse text-center p-2">{position ? position.AdditionalPositionName: functional?.FunctionalPositionName}</td>
            <td className="w-1/12 border border-collapse p-2"></td>
            <td className="w-1/12 border border-collapse p-2"></td>
        </tr>
    )
}