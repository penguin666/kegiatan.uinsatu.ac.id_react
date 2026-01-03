import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {get} from "../../../../api/kegiatan.uinsatu.jsx";
import {toast} from "react-toastify";
import {useAuth} from "../../../../context/AuthProvider.jsx";
import {transports} from "../../../../config/variable.jsx";
import CustomSpinner from "../../../../components/Other/Spinner.jsx";

export default function EventParticipantReport({event, participants})
{
    const {accessToken} = useAuth();
    const [loadingData, setLoadingData] = useState(false);
    const [report, setReport] = useState([])

    const transportMap = transports.reduce((acc, item) => {
        acc[item.value] = item.label
        return acc
    }, {})

    const result = report.map(item => ({
        label: transportMap[item.transport] ?? 'Tidak Diketahui',
        total: item.total
    }))

    useEffect(() => {
        const fetchReport = async (eventId) => {
            setLoadingData(true)
            try {
                const result = await get(`/my-events/${eventId}/participants/reports`, accessToken);

                if (!result.success)
                {
                    throw result.message
                }

                setReport(result.data)
            } catch (error) {
                toast.error(error)
            }
            finally {
                setLoadingData(false)
            }
        };

        if (event)
        {
            fetchReport(event.id);
        }
    }, [event, participants]);

    return (
        <div className={'px-4 py-3 rounded-md bg-emerald-100 text-emerald-800 border-l-4 border-emerald-500'}>
            {loadingData ?
                <div className="flex justify-center py-4">
                    <CustomSpinner/>
                </div>
                :
                <table>
                    <thead>
                    <tr>
                        <th colSpan={3} className={'text-start'}><FontAwesomeIcon icon={faInfoCircle}/> Informasi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {result.map(r => (
                        <tr key={r.label}>
                            <td>{r.label}</td>
                            <td className={'px-3'}>:</td>
                            <td>{r.total}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            }
        </div>
    )
}