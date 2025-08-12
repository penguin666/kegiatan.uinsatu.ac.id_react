import React, {useEffect, useState} from "react";
import {del, get, post, put} from "/src/api/kegiatan.uinsatu.jsx";
import {useAuth} from "/src/context/AuthProvider.jsx";
import Datatable from "/src/components/Datatables/Datatable.jsx";
import {toast} from "react-toastify";
import useDebounce from "/src/hooks/useDebounce.jsx";
import usePagination from "/src/hooks/usePagination.jsx";
import GuestBookFormModal from "./GuestBookFormModal.jsx";
import {Link} from "react-router-dom";
import moment from "moment";
import FilterForm from "./FilterForm.jsx";
import Modal from "../../../components/Modal/Index.jsx";

function GuestBookIndex() {
    const {accessToken, user} = useAuth();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const [selectedUnit, setSelectedUnit] = useState(null);

    const [filters, setFilters] = useState({
        unit_id : 0
    });

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
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemToEdit, setItemToEdit] = useState(null);

    const [units, setUnits] = useState([]);

    const refreshData = () => {
        setRefresh(!refresh); // Trigger refresh
    };

    const columns = [
        { label: "Tanggal Kehadiran", key: "date_of_visit", sortable:true, render: (item) => (
            moment(item.date_of_visit).format('LL')
            )},
        { label: "Nama Tamu", key: "name", sortable:true},
        { label: "Jenis Tamu", key: "type", sortable:true},
        { label: "Asal Tamu", key: "address", sortable:true},
    ];

    const fetchData = async () => {
        setLoadingData(true)
        try {
            const result = await get(`/guest-books?page=${page}&size=${rowsPerPage}&sortBy=${sorting.sortBy}&sortOrder=${sorting.sortOrder}&term=${search}&unit_id=${filters.unit_id}`, accessToken, {});

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

    const fetchUnits = async () => {
        setLoading(true)
        try {
            const result = await get(`/users/${user?.id}/units?page=1&size=50&sortBy=id&sortOrder=asc&term=`, accessToken, {});

            if (result.success) {
                setUnits(result.data.data)
            } else {
                throw result.message
            }
        } catch (error) {
            toast.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user && user.id)
        {
            fetchUnits();
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage, debounceValue, refresh, sorting, filters]);

    const handleOnView = (item) => {
        return `/guest-books/admin/${item.id}`;
    }

    const handleOnCreate = () => {
        setItemToEdit(null); // Untuk create
        setModalShow(true);
    };

    const handleOnEdit = (item) => {
        setItemToEdit(item); // Untuk edit
        setModalShow(true);
    };

    const handleOnEditCanceled = () => {
        setItemToEdit(null); // Untuk edit
        setModalShow(false);
    }

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

            if (itemToEdit) {
                result = await put(`/guest-books/${itemToEdit.id}`, accessToken, newData);
            } else {
                result = await post('/guest-books', accessToken, newData);
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
            const result = await del(`/guest-books/${itemToDelete?.id}`, accessToken, {});

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

    return (
        <>
            <div className="container mx-auto px-4 mt-5">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h2 className="text-xl">Buku Tamu</h2>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleOnCreate}
                            className="bg-emerald-600 text-gray-100 hover:bg-emerald-700 px-3 py-2 rounded-lg shadow-lg text-sm"
                        >
                            Tambah
                        </button>
                        <Link
                            to={'/guest-books'}
                            className="bg-red-600 hover:bg-red-700 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-5 md:grid grid-cols-3">
                <FilterForm
                    units={units}
                    filters={filters}
                    setFilters={setFilters}
                    setSelectedUnit={setSelectedUnit}
                    loading={loading}
                />
            </div>

            <div className="container mx-auto px-4 mt-5 pb-20 md:pb-10">
                <Datatable
                    title={selectedUnit ? `Daftar Tamu ${selectedUnit.unit}`:'Daftar Tamu'}
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
                <p>Hapus {itemToDelete?.name}?</p>
            </Modal>

            <GuestBookFormModal
                units={units}
                show={modalShow}
                handleClose={handleOnEditCanceled}
                handleSubmit={handleSubmit}
                loading={loading}
                defaultData={itemToEdit}
            />
        </>
    )
}

export default GuestBookIndex;