import React, {useEffect, useState} from "react";
import {del, get, post, put} from "../../../api/kegiatan.uinsatu.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import Datatable from "../../../components/Datatables/Datatable.jsx";
import {toast} from "react-toastify";
import {usePermissions} from "../../../context/PermissionProvider.jsx";
import useDebounce from "../../../hooks/useDebounce.jsx";
import usePagination from "../../../hooks/usePagination.jsx";
import MeetingFormModal from "./MeetingFormModal.jsx";
import Modal from "../../../components/Modal/Index.jsx";
import {Link} from "react-router-dom";
import NotFound from "../../NotFound.jsx";
import moment from "moment";

function MeetingIndex() {
    const { hasPermission } = usePermissions();
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
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
        { label: "Tanggal Rapat", key: "date", sortable:true, render: (item) => (
            moment(item.date).format('LL')
            )},
        { label: "Nama Rapat", key: "name", sortable:true},
        { label: "Pembuat", key: "user_name", sortable:true}
    ];

    const fetchData = async () => {
        setLoadingData(true)
        try {
            const result = await get(`/meetings?page=${page}&size=${rowsPerPage}&sortBy=${sorting.sortBy}&sortOrder=${sorting.sortOrder}&term=${search}`, accessToken, {});

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
        fetchData();
    }, [page, rowsPerPage, debounceValue, refresh, sorting]);

    const handleOnView = (item) => {
        return `/meetings/admin/${item.id}`;
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
                result = await put(`/meetings/${editData.id}`, accessToken, newData);
            } else {
                result = await post('/meetings', accessToken, newData);
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
            const result = await del(`/meetings/${itemToDelete?.id}`, accessToken, {});

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

    if (!hasPermission('create meetings'))
    {
        return <NotFound />
    }

    return (
        <>
            <div className="container mx-auto px-4 mt-5">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h2 className="text-xl">Rapat Admin</h2>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleOnCreate}
                            className="bg-emerald-600 text-gray-100 hover:bg-emerald-700 px-3 py-2 rounded-lg shadow-lg text-sm"
                        >
                            Tambah
                        </button>
                        <Link
                            to={'/meetings'}
                            className="bg-red-600 hover:bg-red-700 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-5 pb-20 md:pb-10">
                <Datatable
                    title="Daftar Rapat Admin"
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

            <MeetingFormModal
                show={modalShow}
                handleClose={() => setModalShow(false)}
                handleSubmit={handleSubmit}
                loading={loading}
                defaultData={editData}
            />
        </>
    )
}

export default MeetingIndex;