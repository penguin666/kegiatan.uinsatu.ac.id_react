import React, {useState} from 'react';
import { BASE_API_URL } from "/src/config/variable.jsx";
import axios from "axios";
import { saveAs } from 'file-saver';
import {useAuth} from "/src/context/AuthProvider.jsx";
import moment from "moment";

const DownloadButton = ({ session }) => {
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false)
    const downloadPDF = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${BASE_API_URL}/my-events/${session.event_id}/sessions/${session.id}/participants/report`, {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Menambahkan Bearer Token
                    Accept: 'application/pdf', // Memastikan format respons adalah PDF
                },
            });

            saveAs(response.data, `${moment().format('YYYYMMDDHHmmss')}_${session.name}.pdf`);

            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error('Error saat mendownload PDF:', error);
        }
    };

    return (
        <button
            onClick={downloadPDF}
            className={`bg-orange-600 text-gray-100 px-2 py-1 rounded-lg shadow-lg text-sm ${loading && `bg-orange-200 text-orange-800`}`}
            disabled={loading}
        >
            {loading ? 'Mendownload...':'Download'}
        </button>
    );
};

export default DownloadButton;
