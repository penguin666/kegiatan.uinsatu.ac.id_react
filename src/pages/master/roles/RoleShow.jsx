import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {del, get, post} from "../../../api/kegiatan.uinsatu.jsx";
import usePagination from "../../../hooks/usePagination.jsx";
import useDebounce from "../../../hooks/useDebounce.jsx";
import Datatable from "../../../components/Datatables/Datatable.jsx";
import Modal from "../../../components/Modal/Index.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import EventParticipantFormModal from "../../events/events/participants/EventParticipantFormModal.jsx";
import RolePermissionFormModal from "./permissions/RolePermissionFormModal.jsx";
import Spinner from "../../../components/Other/Spinner.jsx";

export default function RoleShow() {
    let { roleId } = useParams();
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);
    const [role, setRole] = useState({});

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

    const fetchRole = async () => {
        setLoading(true)
        try {
            const result = await get(`/roles/${roleId}`, accessToken, {});

            if (result.success)
            {
                setRole(result.data)
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

    const fetchPermissions = async () => {
        setLoadingTable(true)
        try {
            const result = await get(`/roles/${roleId}/permissions?page=${page}&size=${rowsPerPage}&sortBy=${sorting.sortBy}&sortOrder=${sorting.sortOrder}&term=${search}`, accessToken, {});

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
        { label: "Nama", key: "name", sortable:true}
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
            const result = await del(`/roles/${roleId}/permissions/${itemToDelete?.id}`, accessToken, {});

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
        fetchRole();
    }, [roleId]);

    useEffect(() => {
        fetchPermissions()
    }, [page, rowsPerPage, debounceValue, refresh, sorting]);

    const handleSubmit = async (selectedRows) => {
        try {
            const result = await post(`/roles/${roleId}/permissions`, accessToken, {permissions: selectedRows});

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

    if (loading)
    {
        return <div className="mt-5"><Spinner/></div>
    }

    return (
        <div className="container mx-auto px-4 mt-5 pb-20 md:pb-10">
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h2 className="text-xl">Peran: {role.name}</h2>
                </div>

                <Link
                    to={'/master/roles'}
                    className="bg-red-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                >
                    Kembali
                </Link>
            </div>

            <Datatable
                title="Daftar Perizinan Peran"
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
                actions={{
                    actions,
                    onDelete: handleOnDelete
                }}
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
                <p>Hapus perizinan {itemToDelete?.name} dari peran {role.name}?</p>
            </Modal>

            {role && role.id ?
                <RolePermissionFormModal
                    role={role}
                    show={modalShow}
                    handleClose={() => setModalShow(false)}
                    handleSubmit={handleSubmit}
                />:''
            }
        </div>
    )
}