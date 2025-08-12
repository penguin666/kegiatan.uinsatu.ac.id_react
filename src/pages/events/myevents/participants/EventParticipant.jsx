import useDebounce from "../../../../hooks/useDebounce.jsx";
import usePagination from "../../../../hooks/usePagination.jsx";
import {del, get, post, put} from "../../../../api/kegiatan.uinsatu.jsx";
import React, {useEffect, useState} from "react";
import {useAuth} from "../../../../context/AuthProvider.jsx";
import Datatable from "../../../../components/Datatables/Datatable.jsx";
import {toast} from "react-toastify";
import EventParticipantFormModal from "./EventParticipantFormModal.jsx";
import MeetingParticipantFormModal from "../../../meetings/meetings/participants/MeetingParticipantFormModal.jsx";
import Modal from "../../../../components/Modal/Index.jsx";
import {useOutletContext} from "react-router-dom";

export default function EventParticipant() {
    const {accessToken} = useAuth();
    const [event] = useOutletContext();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [refreshChild, setRefreshChild] = useState(false);

    //state to delete
    const [showConfirm, setShowConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(false);

    const {
        page,
        rowsPerPage,
        sorting,
        search,
        data,
        total,
        setData,
        setTotal,
        handleSearchChange,
        handleRowsPerPageChange,
        handlePageChange,
        handleOnSort,
    } = usePagination();

    const debounceValue = useDebounce(search, 500);

    const columns = [
        { label: "Username Peserta", key: "username", sortable:true},
        { label: "Nama Peserta", key: "name", sortable:true}
    ];

    const fetchParticipants = async () => {
        setLoadingData(true)
        try {
            const result = await get(`/my-events/${event.id}/participants?page=${page}&size=${rowsPerPage}&sortBy=${sorting.sortBy}&sortOrder=${sorting.sortOrder}&term=${search}`, accessToken, {});

            if (result.success)
            {
                setData(result.data.data)
                setTotal(result.data.total)
            }
            else
            {
                throw result.message
            }
        } catch (error) {
            toast.error(error)
        }
        finally {
            setLoadingData(false)
        }
    };

    useEffect(() => {
        fetchParticipants();
    }, [page, rowsPerPage, debounceValue, sorting, refresh, event]);

    const handleSubmit = async (selected) => {
        try {
            const result = await post(`/my-events/${event.id}/participants`, accessToken, {user_id:selected});

            if (result.success)
            {
                setRefresh(!refresh);
                toast.success(result.message)
                return true;
            }

            throw result.message;
        }
        catch (err)
        {
            toast.error(err)
            return false;
        }
    }

    const handleOnDelete = (item) => {
        setShowConfirm(true);
        setItemToDelete(item);
        console.log(item)
    }

    const handleCanceled = () => {
        setShowConfirm(false);
        setItemToDelete(null);
    }

    const handleConfirmed = async () => {
        setLoading(true)
        try {
            const result = await del(`/my-events/${event.id}/participants/${itemToDelete.id}`, accessToken, {});

            if (result.success)
            {
                setRefresh(!refresh);
                setRefreshChild(!refreshChild)
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
            setLoading(false)
        }
    };

    const actions = ['delete']

    return (
        <>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden min-h-40">
                <div className="bg-teal-700 px-4 py-3 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Peserta Kegiatan</h3>
                </div>

                <div className="px-4 md:w-3/4" style={{paddingTop: '20px'}}>
                    <EventParticipantFormModal
                        event={event}
                        handleSubmit={handleSubmit}
                        refresh={refreshChild}
                    />
                </div>

                <Datatable
                    page={page}
                    rowsPerPage={rowsPerPage}
                    search={search}
                    data={data}
                    total={total}
                    columns={columns}
                    loading={loadingData}
                    sort={sorting}
                    rowsPerPageOption={[10, 25, 50, 100]}
                    onSort={handleOnSort}
                    onPageChange={handlePageChange}
                    onSearchChange={handleSearchChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    actions={{
                        actions,
                        onDelete: handleOnDelete
                    }}
                />
            </div>

            <Modal
                show={showConfirm}
                title="Konfirmasi"
                onClose={handleCanceled}
                onSubmit={handleConfirmed}
                confirmButton="Ya"
                size="xs"
                loading={loading}
            >
                <p>Hapus peserta {itemToDelete?.name}?</p>
            </Modal>
        </>
    )
}