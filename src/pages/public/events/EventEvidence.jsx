import {useParams} from "react-router-dom";
import logo from '/src/assets/img/icon.png'
import React, {useEffect, useState} from "react";
import {BASE_API_URL} from "../../../config/variable.jsx";
import CustomSpinner from "../../../components/Other/Spinner.jsx";
import moment from "moment";
import {setMomentLocaleID} from "../../../config/locale.jsx";

export default function EventEvidence() {
    setMomentLocaleID();
    const fullURL = window.location.href;

    const {eventCode, username, type} = useParams();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async (eventCode, username) => {
            setLoading(true)
            try {
                const response = await fetch(`${BASE_API_URL}/common/events/${eventCode}/participants/${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();

                if (!result.success) throw result.message

                setData(result.data)
            } catch (error) {
                console.error('Login failed', error);
                setError(error)
            } finally {
                setLoading(false)
            }
        };

        if (eventCode && username) {
            fetchData(eventCode, username)
        }
    }, [eventCode, username]);

    return (
        <div className="min-h-screen bg-gray-200 flex items-center justify-center p-6">
            <div className="relative bg-white w-[210mm] min-h-[297mm] p-12 shadow-lg text-black">

                <div className={'border-b pb-3 mb-6'}>
                    <img
                        src={logo}
                        alt={'UIN SATU'}
                        className="w-32 md:w-52"
                    />
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-xl font-bold uppercase">
                        Dokumen Verifikasi
                    </h1>
                </div>

                {loading ?
                    <div className="flex justify-center py-4">
                        <CustomSpinner/>
                    </div>
                    :
                    error ?
                        <div className={'px-4 py-3 rounded-md bg-red-100 text-red-800 border-l-4 border-red-500 mb-3'}>
                            {error}
                        </div>
                        :
                        <div className="space-y-6 text-justify text-base leading-relaxed">
                            <p className="font-semibold">
                                Dokumen ini ASLI dan RESMI diterbitkan oleh
                                UIN SAYID ALI RAHMATULLAH TULUNGAGUNG.
                            </p>

                            <p className="font-semibold">
                                Detail Verifikasi:
                            </p>

                            <table className="w-full border-collapse hidden md:block">
                                <tbody>
                                <tr className={'align-top'}>
                                    <td className="py-1 w-40">Nama Dokumen</td>
                                    <td>:</td>
                                    <td className="py-1 uppercase">
                                        {type === '1' ? 'BIODATA' : 'SURAT PERNYATAAN'} KEGIATAN {data?.name} Tanggal {moment(data?.event_start_date).format('LL')} sampai
                                        dengan {moment(data?.event_end_date).format('LL')} di {data?.event_place}
                                    </td>
                                </tr>
                                <tr className={'align-top'}>
                                    <td className="py-1">Nama Pemilik</td>
                                    <td>:</td>
                                    <td className="py-1 uppercase">{data?.user_name}</td>
                                </tr>
                                <tr className={'align-top'}>
                                    <td className="py-1">Tanggal Terbit</td>
                                    <td className={'px-1'}>:</td>
                                    <td className="py-1 uppercase">{moment(data?.event_start_date).format('LL')}</td>
                                </tr>
                                <tr className={'align-top'}>
                                    <td className="py-1">Status</td>
                                    <td>:</td>
                                    <td className="py-1 font-bold">VALID</td>
                                </tr>
                                </tbody>
                            </table>

                            <div className={'md:hidden'}>
                                <div className={'border-b py-2'}>
                                    <div className={'text-slate-700'}>Nama Dokumen</div>
                                    <div
                                        className={'uppercase font-semibold'}>{type === '1' ? 'BIODATA' : 'SURAT PERNYATAAN'} KEGIATAN {data?.name} Tanggal {moment(data?.event_start_date).format('LL')} sampai
                                        dengan {moment(data?.event_end_date).format('LL')} di {data?.event_place} {data?.city_signature}</div>
                                </div>
                                <div className={'border-b py-2'}>
                                    <div className={'text-slate-700'}>Nama Pemilik</div>
                                    <div
                                        className={'uppercase font-semibold'}>{data?.user_name}</div>
                                </div>
                                <div className={'border-b py-2'}>
                                    <div className={'text-slate-700'}>Tanggal Terbit</div>
                                    <div
                                        className={'uppercase font-semibold'}>{moment(data?.event_start_date).format('LL')}</div>
                                </div>
                                <div className={'border-b py-2'}>
                                    <div className={'text-slate-700'}>Status</div>
                                    <div
                                        className={'uppercase font-semibold'}>VALID</div>
                                </div>
                            </div>

                            <p>
                                Dokumen ini diverifikasi melalui sistem resmi dan tidak memerlukan tanda tangan basah.
                            </p>
                        </div>
                }

                <div className="absolute bottom-8 left-12 right-12 border-t pt-4">
                    <p className={' text-sm'}>UIN Sayid Ali Rahmatullah Tulungagung</p>
                    <p className={'text-xs text-slate-500 italic break-all whitespace-pre-wrap'}>{fullURL}</p>
                </div>
            </div>
        </div>
    );
}