import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {get} from "/src/api/kegiatan.uinsatu.jsx";
import {toast} from "react-toastify";
import {useAuth} from "/src/context/AuthProvider.jsx";
import NotFound from "/src/pages/NotFound.jsx";
import Spinner from "/src/components/Other/Spinner.jsx";
import {usePermissions} from "/src/context/PermissionProvider.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

export default function GuestBookShow()
{
    const {guestId} = useParams();
    const {accessToken} = useAuth();
    const { hasPermission } = usePermissions();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const fetchData = async () => {
        setLoading(true)
        try {
            const result = await get(`/guest-books/${guestId}`, accessToken, {});

            if (result.success)
            {
                setData(result.data)
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
        fetchData();
    }, [guestId]);

    if (!hasPermission('create guestbook'))
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
                        <h2 className="text-xl">{data?.name}</h2>
                        <div className="text-xs">
                            <FontAwesomeIcon icon={faCalendar}/> {moment(data?.date_of_visit).format('DD MMMM Y')}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            to={'/guest-books/admin'}
                            className="bg-red-600 hover:bg-red-700 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-lg overflow-hidden pb-20 md:pb-10">
                    <div className="bg-teal-700 px-4 py-3 border-b flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">Informasi</h3>
                    </div>

                    <div className="px-4 py-2 grid md:grid-cols-2 sm:space-x-8 space-x-0">
                        <div>

                            <div className="flex flex-col border-b pb-2 mt-3">
                                <span className="text-gray-500 text-sm">Nama Lengkap</span>
                                <h4 className="text-gray-700"><strong>{data?.name}</strong></h4>
                            </div>
                            <div className="flex flex-col border-b pb-2 mt-3">
                                <span className="text-gray-500 text-sm">E-Mail</span>
                                <h4 className="text-gray-700"><strong>{data?.email}</strong></h4>
                            </div>
                            <div className="flex flex-col border-b pb-2 mt-3">
                                <span className="text-gray-500 text-sm">Nomor HP</span>
                                <h4 className="text-gray-700"><strong>{data?.hp}</strong></h4>
                            </div>
                            <div className="flex flex-col border-b pb-2 mt-3">
                                <span className="text-gray-500 text-sm">Alamat / Asal Instansi</span>
                                <h4 className="text-gray-700"><strong>{data?.address}</strong></h4>
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-col border-b pb-2 mt-3">
                                <span className="text-gray-500 text-sm">Jenis Tamu</span>
                                <h4 className="text-gray-700"><strong>{data?.type.type}</strong></h4>
                            </div>
                            <div className="flex flex-col border-b pb-2 mt-3">
                                <span className="text-gray-500 text-sm">Keperluan Kunjungan</span>
                                <h4 className="text-gray-700"><strong>{data?.needs}</strong></h4>
                            </div>
                            <div className="flex flex-col border-b pb-2 mt-3">
                                <span className="text-gray-500 text-sm">Unit Tujuan</span>
                                <h4 className="text-gray-700"><strong>{data?.unit_position.unit.unit}</strong></h4>
                            </div>
                            <div className="flex flex-col border-b pb-2 mt-3">
                                <span className="text-gray-500 text-sm">Bagian Tujuan</span>
                                <h4 className="text-gray-700"><strong>{data?.unit_position.position.position}</strong>
                                </h4>
                            </div>
                        </div>
                    </div>

                    {/*<div className="px-4 py-2">*/}
                    {/*    <div className="flex flex-col border-b pb-2 mt-3">*/}
                    {/*        <span className="text-gray-500 text-sm">Apakah Anda Puas Dengan Pelayanan Tamu di UIN SATU Tulungagung?</span>*/}
                    {/*        <h4 className="text-gray-700"><strong>{data?.satisfaction ? 'Puas':'Tidak Puas'}</strong></h4>*/}
                    {/*    </div>*/}
                    {/*    <div className="flex flex-col border-b pb-2 mt-3">*/}
                    {/*        <span className="text-gray-500 text-sm">Saran Perbaikan Atas Pelayanan Tamu</span>*/}
                    {/*        <h4 className="text-gray-700"><strong>{data?.suggestion}</strong></h4>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </div>
        </>
    )
}