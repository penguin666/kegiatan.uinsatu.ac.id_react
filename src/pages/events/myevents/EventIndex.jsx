import React, {useEffect, useState} from "react";
import {del, get, post, put} from "../../../api/kegiatan.uinsatu.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import Datatable from "../../../components/Datatables/Datatable.jsx";
import {toast} from "react-toastify";
import {usePermissions} from "../../../context/PermissionProvider.jsx";
import useDebounce from "../../../hooks/useDebounce.jsx";
import usePagination from "../../../hooks/usePagination.jsx";
import EventFormModal from "./EventFormModal.jsx";
import Modal from "../../../components/Modal/Index.jsx";
import {Link} from "react-router-dom";
import NotFound from "../../NotFound.jsx";
import moment from "moment";

function EventIndex() {
    const { hasPermission } = usePermissions();
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [loadingData, setDoadingData] = useState(false);
    const [refresh, setRefresh] = useState(false);

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

    const [showConfirm, setShowConfirm] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(false);
    const [editData, setEditData] = useState(null);

    const refreshData = () => {
        setRefresh(!refresh); // Trigger refresh
    };

    const columns = [
        { label: "Tanggal Kegiatan", key: "event_start_date", sortable:true, render: (item) => (
                `${moment(item.event_start_date).format('LL')} s.d. ${moment(item.event_end_date).format('LL')}`
            )},
        { label: "Kode", key: "code", sortable:true},
        { label: "Nama Kegiatan", key: "name", sortable:true},
        { label: "Pembuat", key: "user_name", sortable:true}
    ];

    const fetchData = async () => {
        setDoadingData(true)
        try {
            const result = await get(`/my-events?page=${page}&size=${rowsPerPage}&sortBy=${sorting.sortBy}&sortOrder=${sorting.sortOrder}&term=${search}`, accessToken, {});

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
            setDoadingData(false)
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage, debounceValue, refresh, sorting]);

    const handleOnView = (item) => {
        return `/events/my-events/${item.id}`;
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

    const handleCanceled = () => {
        setShowConfirm(false);
        setItemToDelete(null);
    }

    const handleSubmit = async (newData) => {
        try {
            let result;

            if (editData) {
                result = await put(`/my-events/${editData.id}`, accessToken, newData);
            } else {
                result = await post('/my-events', accessToken, newData);
            }

            if (result.success)
            {
                refreshData();
                toast.success(result.message)
                return true;
            }

            throw result.message
        }
        catch (err)
        {
            toast.error(err)
            return false
        }
    };

    const handleConfirmed = async () => {
        setLoading(true)
        try {
            const result = await del(`/my-events/${itemToDelete?.id}`, accessToken, {});

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
            setLoading(false)
        }
    };

    const actions = ['view', 'edit', 'delete']

    if (!hasPermission('create myevents'))
    {
        return <NotFound />
    }

    return (
        <>
            <div className="container mx-auto px-4 mt-5">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h2 className="text-xl">Kegiatan Saya</h2>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleOnCreate}
                            className="bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                        >
                            Tambah
                        </button>
                        <Link
                            to={'/events'}
                            className="bg-red-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-5 pb-20">
                <Datatable
                    title="Daftar Kegiatan Saya"
                    page={page}
                    rowsPerPage={rowsPerPage}
                    search={search}
                    data={data}
                    total={total}
                    columns={columns}
                    loading={loadingData}
                    sort={sorting}
                    rowsPerPageOption={[1, 10, 25, 50, 100]}
                    onSort={handleOnSort}
                    onPageChange={handlePageChange}
                    onSearchChange={handleSearchChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    actions={{
                        actions,
                        onView: handleOnView,
                        onEdit: handleOnEdit,
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
                <p>Hapus rapat {itemToDelete?.name}?</p>
            </Modal>

            <EventFormModal
                show={modalShow}
                handleClose={() => setModalShow(false)}
                handleSubmit={handleSubmit}
                loading={loading}
                defaultData={editData}
            />
        </>
    )
}

export default EventIndex;