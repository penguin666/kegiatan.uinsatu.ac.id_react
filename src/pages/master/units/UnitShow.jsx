import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {del, get, post} from "/src/api/kegiatan.uinsatu.jsx";
import usePagination from "/src/hooks/usePagination.jsx";
import useDebounce from "/src/hooks/useDebounce.jsx";
import Datatable from "/src/components/Datatables/Datatable.jsx";
import Modal from "/src/components/Modal/Index.jsx";
import {useAuth} from "/src/context/AuthProvider.jsx";
import Spinner from "/src/components/Other/Spinner.jsx";
import UnitPositionFormModal from "./positions/UnitPositionFormModal.jsx";

export default function UnitShow() {
    let { unitId } = useParams();
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);
    const [unit, setUnit] = useState({});

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

    const [modalShow, setModalShow] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(false);

    const refreshData = () => {
        setRefresh(!refresh); // Trigger refresh
    };

    const fetchUnit = async () => {
        setLoading(true)
        try {
            const result = await get(`/units/${unitId}`, accessToken, {});

            if (result.success)
            {
                setUnit(result.data)
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

    const fetchPositions = async () => {
        setLoadingTable(true)
        try {
            const result = await get(`/units/${unitId}/positions?page=${page}&size=${rowsPerPage}&sortBy=${sorting.sortBy}&sortOrder=${sorting.sortOrder}&term=${search}`, accessToken, {});

            if (result.success)
            {
                setData(result.data.data)
                setTotal(result.data.total)
            }
        } catch (error) {
            toast.error(error)
        }
        finally {
            setLoadingTable(false)
        }
    };

    const columns = [
        { label: "#", key: "id", sortable:true},
        { label: "Nama Jabatan", key: "position", sortable:true}
    ];

    const handleOnDelete = (item) => {
        setShowConfirm(true);
        setItemToDelete(item);
    }

    const handleCanceled = () => {
        setShowConfirm(false);
        setItemToDelete(null);
    }

    const handleConfirmed = async () => {
        setLoading(true)
        try {
            const result = await del(`/units/${unitId}/positions/${itemToDelete?.id}`, accessToken, {});

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
            return false
        }
        finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchUnit();
    }, [unitId]);

    useEffect(() => {
        fetchPositions()
    }, [page, rowsPerPage, debounceValue, refresh, sorting]);

    const handleSubmit = async (selectedRows) => {
        try {
            const result = await post(`/units/${unitId}/positions`, accessToken, {positions: selectedRows});

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

    const actions = ['delete'];

    return (
        <div className="container mx-auto px-4 mt-5 pb-20 md:pb-10">
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h2 className="text-xl">Unit: {unit.unit}</h2>
                </div>

                <Link
                    to={'/master/units'}
                    className="bg-red-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                >
                    Kembali
                </Link>
            </div>

            <Datatable
                title="Daftar Jabatan Unit"
                page={page}
                rowsPerPage={rowsPerPage}
                search={search}
                data={data}
                total={total}
                columns={columns}
                loading={loadingTable}
                sort={sorting}
                rowsPerPageOption={[10, 25, 50, 100]}
                onSort={handleOnSort}
                onPageChange={handlePageChange}
                onSearchChange={handleSearchChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                // actions={{
                //     actions,
                //     onDelete: handleOnDelete
                // }}
            >
                <div className="flex gap-2">
                    <button
                        onClick={() => setModalShow(true)}
                        className="bg-emerald-600 text-gray-100 px-3 py-1 rounded-lg shadow-lg text-sm"
                    >
                        Tambah
                    </button>
                </div>
            </Datatable>

            <Modal
                show={showConfirm}
                title="Konfirmasi"
                onClose={handleCanceled}
                onSubmit={handleConfirmed}
                confirmButton="Ya"
                size="xs"
                loading={loading}
            >
                <p>Hapus jabatan {itemToDelete?.position} dari unit {unit.unit}?</p>
            </Modal>

            {unit && unit.id ?
                <UnitPositionFormModal
                    unit={unit}
                    show={modalShow}
                    handleClose={() => setModalShow(false)}
                    handleSubmit={handleSubmit}
                />:''
            }
        </div>
    )
}