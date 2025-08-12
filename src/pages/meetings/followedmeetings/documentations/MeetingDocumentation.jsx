import {useOutletContext} from "react-router-dom";
import { Gallery, Item } from 'react-photoswipe-gallery'
import {get} from "../../../../api/kegiatan.uinsatu.jsx";
import React, {useEffect, useState} from "react";
import {useAuth} from "../../../../context/AuthProvider.jsx";
import {toast} from "react-toastify";
import Spinner from "../../../../components/Other/Spinner.jsx";
import 'photoswipe/dist/photoswipe.css'

export default function MeetingDocumentation() {
    const [meeting] = useOutletContext();
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [photos, setPhotos] = useState([]);


    const fetchPhotos = async () => {
        setLoading(true)
        try {
            const result = await get(`/followed-meetings/${meeting.id}/documentations?size=1000`, accessToken, {});

            if (result.success)
            {
                setPhotos(result.data.data)
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
        fetchPhotos()
    }, []);

    return (
        <>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden min-h-40">
                <div className="bg-teal-700 px-4 py-3 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Dokumentasi Rapat</h3>
                </div>

                {loading ? <div className="mt-5"><Spinner/></div> :
                    photos.length > 0 ?
                        <div className="container mx-auto p-4">
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <Gallery>
                                    {photos.map(photo => (
                                        <Item
                                            key={photo.id}
                                            original={photo.base_64_image}
                                            thumbnail={photo.base_64_image}
                                            width={photo.width}
                                            height={photo.height}
                                        >
                                            {({ref, open}) => (
                                                <div className="relative shadow h-40">
                                                    <img
                                                        src={photo.base_64_image}
                                                        ref={ref}
                                                        onClick={open} alt={photo.name}
                                                        className="w-full h-full object-cover rounded"
                                                    />
                                                </div>
                                            )}
                                        </Item>
                                    ))}
                                </Gallery>
                            </div>
                        </div>
                        :
                        <p className="text-gray-600 text-center mt-5">Foto tidak ditemukan</p>
                }
            </div>
        </>
    )
}