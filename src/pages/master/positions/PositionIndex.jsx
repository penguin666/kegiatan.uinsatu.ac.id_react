import React, {useEffect, useState} from "react";
import {del, get, post, put} from "/src/api/kegiatan.uinsatu.jsx";
import {useAuth} from "/src/context/AuthProvider.jsx";
import Datatable from "/src/components/Datatables/Datatable.jsx";
import {toast} from "react-toastify";
import {usePermissions} from "/src/context/PermissionProvider.jsx";
import useDebounce from "/src/hooks/useDebounce.jsx";
import usePagination from "/src/hooks/usePagination.jsx";
import Modal from "/src/components/Modal/Index.jsx";
import {Link} from "react-router-dom";
import NotFound from "../../NotFound.jsx";
import PositionFormModal from "./PositionFormModal.jsx";

function PositionIndex() {
    const { hasPermission } = usePermissions();
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

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

    const [refresh, setRefresh] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(false);
    const [editData, setEditData] = useState(null);

    const refreshData = () => {
        setRefresh(!refresh); // Trigger refresh
    };

    const columns = [
        { label: "#", key: "id", sortable:true},
        { label: "Nama Jabatan", key: "position", sortable:true}
    ];

    const fetchData = async () => {
        setLoadingData(true)
        try {
            const result = await get(`/positions?page=${page}&size=${rowsPerPage}&sortBy=${sorting.sortBy}&sortOrder=${sorting.sortOrder}&term=${search}`, accessToken, {});

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
                result = await put(`/positions/${editData.id}`, accessToken, newData);
            } else {
                result = await post('/positions', accessToken, newData);
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
            return false;
        }
    };

    const handleConfirmed = async () => {
        setLoading(true)
        try {
            const result = await del(`/positions/${itemToDelete?.id}`, accessToken, {});

            if (result.success)
            {
                refreshData();
                toast.success(result.message)
                handleCanceled();
                return true;
            }

            throw result.message;
        }
        catch (err)
        {
            toast.error(err)
            return false;
        }
        finally {
            setLoading(false)
        }
    };

    const actions = ['edit', 'delete']

    if (!hasPermission('create positions'))
    {
        return <NotFound />
    }

    return (
        <>
            <div className="container mx-auto px-4 mt-5">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h2 className="text-xl">Jabatan</h2>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleOnCreate}
                            className="bg-emerald-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                        >
                            Tambah
                        </button>
                        <Link
                            to={'/master'}
                            className="bg-red-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-5 pb-20 md:pb-10">
                <Datatable
                    title="Daftar Jabatan"
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
                <p>Hapus {itemToDelete?.position}?</p>
            </Modal>

            <PositionFormModal
                show={modalShow}
                handleClose={() => setModalShow(false)}
                handleSubmit={handleSubmit}
                loading={loading}
                defaultData={editData}
            />
        </>
    )
}

export default PositionIndex;