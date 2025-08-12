import useDebounce from "/src/hooks/useDebounce.jsx";
import usePagination from "/src/hooks/usePagination.jsx";
import {del, get, post, put} from "/src/api/kegiatan.uinsatu.jsx";
import React, {useEffect, useState} from "react";
import {useAuth} from "/src/context/AuthProvider.jsx";
import Datatable from "/src/components/Datatables/Datatable.jsx";
import {toast} from "react-toastify";
import Modal from "/src/components/Modal/Index.jsx";
import {Link, useOutletContext} from "react-router-dom";
import EventSessionFormModal from "./EventSessionFormModal.jsx";

export default function EventSession() {
    const {accessToken} = useAuth();
    const [event] = useOutletContext();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [refresh, setRefresh] = useState(false);


    //state to delete
    const [showConfirm, setShowConfirm] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(false);
    const [editData, setEditData] = useState(null);

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
        { label: "Sesi", key: "name", sortable:true},
        { label: "Waktu Mulai", key: "start_time", sortable:true},
        { label: "Waktu Akhir", key: "end_time", sortable:true}
    ];

    const fetchSessions = async () => {
        setLoadingData(true)
        try {
            const result = await get(`/my-events/${event.id}/sessions?page=${page}&size=${rowsPerPage}&sortBy=${sorting.sortBy}&sortOrder=${sorting.sortOrder}&term=${search}`, accessToken, {});

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
        fetchSessions();
    }, [page, rowsPerPage, debounceValue, sorting, refresh, event]);

    const handleOnView = (item) => {
        return `/events/my-events/${event.id}/sessions/${item.id}`;
    }

    const handleOnCreate = () => {
        setEditData(null); // Untuk create
        setModalShow(true);
    };

    const handleOnEdit = (item) => {
        setEditData(item); // Untuk edit
        setModalShow(true);
    };

    const handleOnDelete = (item) => {
        setShowConfirm(true);
        setItemToDelete(item);
    }


    const handleSubmit = async (formData) => {
        try {
            let result;

            if (editData) {
                result = await put(`/my-events/${event.id}/sessions/${editData.id}`, accessToken, formData);
            } else {
                result = await post(`/my-events/${event.id}/sessions`, accessToken, formData);
            }

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

    const handleCanceled = () => {
        setShowConfirm(false);
        setItemToDelete(null);
    }

    const handleConfirmed = async () => {
        setLoading(true)
        try {
            const result = await del(`/my-events/${event.id}/sessions/${itemToDelete.id}`, accessToken, {});

            if (result.success)
            {
                setRefresh(!refresh);
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

    const actions = ['view', 'delete']

    return (
        <>
            <Datatable
                title="Sesi Kegiatan"
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
                    onView: handleOnView,
                    // onEdit: handleOnEdit,
                    onDelete: handleOnDelete
                }}
            >
                <div className="flex gap-2">
                    <button
                        onClick={handleOnCreate}
                        className="bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                    >
                        Tambah
                    </button>
                </div>
            </Datatable>

            <EventSessionFormModal
                show={modalShow}
                handleClose={() => setModalShow(false)}
                handleSubmit={handleSubmit}
                loading={loading}
                defaultData={editData}
            />

            <Modal
                show={showConfirm}
                title="Konfirmasi"
                onClose={handleCanceled}
                onSubmit={handleConfirmed}
                confirmButton="Ya"
                size="xs"
                loading={loading}
            >
                <p>Semua peserta yang sudah presensi akan dihapus. Apakah anda yakin ingin menghapus Sesi {itemToDelete?.name}?</p>
            </Modal>
        </>
    )
}