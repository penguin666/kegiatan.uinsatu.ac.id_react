import {useOutletContext} from "react-router-dom";
import { Gallery, Item } from 'react-photoswipe-gallery'
import {del, get, post} from "../../../../api/kegiatan.uinsatu.jsx";
import React, {useEffect, useState} from "react";
import {useAuth} from "../../../../context/AuthProvider.jsx";
import {toast} from "react-toastify";
import MeetingDocumentationFormModal from "./MeetingDocumentationFormModal.jsx";
import Spinner from "../../../../components/Other/Spinner.jsx";
import 'photoswipe/dist/photoswipe.css'
import Modal from "../../../../components/Modal/Index.jsx";

export default function MeetingDocumentation() {
    const [meeting] = useOutletContext();
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [loadingConfirm, setLoadingConfirm] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(false);

    const refreshData = () => {
        setRefresh(!refresh);
    }

    const fetchPhotos = async () => {
        setLoading(true)
        try {
            const result = await get(`/meetings/${meeting.id}/documentations?size=1000`, accessToken, {});

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
    }, [refresh]);

    const handleOnDelete = (item) => {
        setShowConfirm(true);
        setItemToDelete(item);
    }

    const handleCanceled = () => {
        setShowConfirm(false);
        setItemToDelete(null);
    }
    const handleConfirmed = async () => {
        setLoadingConfirm(true)
        try {
            const result = await del(`/meetings/${meeting.id}/documentations/${itemToDelete?.id}`, accessToken, {});

            if (result.success)
            {
                refreshData();
                toast.success(result.message)
                handleCanceled();
                return;
            }

            throw result.message;
        }
        catch (err)
        {
            toast.error(err)
        }
        finally {
            setLoadingConfirm(false)
        }
    };

    return (
        <>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden min-h-40">
                <div className="bg-teal-700 px-4 py-3 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Dokumentasi Rapat</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setModalShow(true)}
                            className="bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                        >
                            Tambah
                        </button>
                    </div>
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
                                                    <button
                                                        onClick={() => handleOnDelete(photo)}
                                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs hover:bg-red-700">
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </Item>
                                    ))}
                                </Gallery>
                            </div>
                        </div>
                        : <p className="text-gray-600 text-center mt-5">Foto tidak ditemukan</p>
                }
            </div>

            <MeetingDocumentationFormModal
                meeting={meeting}
                show={modalShow}
                handleClose={() => setModalShow(false)}
                refreshParent={refreshData}
            />

            <Modal
                show={showConfirm}
                title="Konfirmasi"
                onClose={handleCanceled}
                onSubmit={handleConfirmed}
                confirmButton="Ya"
                size="xs"
                loading={loadingConfirm}
            >
                <p>Hapus foto {itemToDelete?.name}?</p>
            </Modal>
        </>
    )
}