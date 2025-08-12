import {QRCodeSVG} from 'qrcode.react';
import {get, post} from "/src/api/kegiatan.uinsatu.jsx";
import {toast} from "react-toastify";
import React, {useEffect, useState} from "react";
import Spinner from "/src/components/Other/Spinner.jsx";
import {useAuth} from "/src/context/AuthProvider.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import moment from "moment/moment.js";
export default function EventSessionQrCode({session, uniqueCode})
{
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState(uniqueCode);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const generateQrCode = async () => {
        setLoading(true)
        try {
            const result = await post(`/my-events/${session.event_id}/sessions/${session.id}/generate-code`, accessToken, {});

            if (result.success)
            {
                setCode(result.data)
                toast.success(result.message);
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

    const refreshQrCode = async () => {
        setLoading(true)
        try {
            const result = await get(`/my-events/${session.event_id}/sessions/${session.id}`, accessToken, {});

            if (result.success)
            {
                return setCode(result.data?.session_code)
            }

            throw result.message

        } catch (error) {
            toast.error(error)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (code)
        {
            const intervalId = setInterval(() => {
                refreshQrCode();
            }, 2000);

            return () => clearInterval(intervalId);
        }
    }, [code]);

    return (
        <div className="flex justify-center items-center">
            {code ?
                <>
                    {loading ?
                        <div className="mt-5"><Spinner/></div>
                        :
                        <QRCodeSVG
                            value={code}
                            className="cursor-pointer"
                            onClick={toggleDrawer}
                        />
                    }

                    <div className="relative">
                        {/* Drawer */}
                        <div
                            className={`fixed bottom-0 left-0 w-full bg-white shadow-lg transform rounded-lg
                                ${isOpen ? "translate-y-0" : "translate-y-full"} 
                                transition-transform duration-300 ease-in-out z-20 md:z-50`
                            }
                            style={{height: "80vh"}}
                        >
                            {/* Drawer Header */}
                            <div className="p-4 flex justify-between items-center border-b">
                                <h2 className="text-lg font-bold text-center">QR Code Sesi {session.name} Waktu
                                    Presensi {moment(session.start_time).format('D MMMM Y HH:mm')} s.d. {moment(session.end_time).format('D MMMM Y HH:mm')}</h2>
                                <button
                                    className="text-gray-600 hover:text-gray-900"
                                    onClick={toggleDrawer}
                                >
                                    <FontAwesomeIcon icon={faTimes}/>
                                </button>
                            </div>

                            {/* Drawer Content */}
                            <div className="p-4">
                                <div className="flex items-center justify-center">
                                    <div className="w-full md:max-w-md text-center px-4">
                                        {isOpen && loading ?
                                            <div className="mt-5"><Spinner/></div>
                                            :
                                            <QRCodeSVG value={code} size={250} className="w-full"/>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Background overlay */}
                        {isOpen && (
                            <div
                                className="fixed inset-0 bg-black bg-opacity-50 z-10 md:z-40"
                                onClick={toggleDrawer}
                            />
                        )}
                    </div>
                </>
                :
                <div className="text-center">
                    <h4 className="text-tiny text-gray-500 mb-2">QR Code belum tersedia.</h4>
                    <button
                        className="bg-emerald-600 text-gray-100 px-2 py-1 rounded-lg shadow-lg text-sm"
                        onClick={generateQrCode}
                        disabled={loading}
                    >
                        Generate
                    </button>
                </div>
            }
        </div>
    )
}