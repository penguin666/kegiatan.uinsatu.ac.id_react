import React, {useEffect, useState} from "react";
import {del, get, post, put} from "/src/api/kegiatan.uinsatu.jsx";
import {useAuth} from "/src/context/AuthProvider.jsx";
import Datatable from "/src/components/Datatables/Datatable.jsx";
import {toast} from "react-toastify";
import {usePermissions} from "/src/context/PermissionProvider.jsx";
import useDebounce from "/src/hooks/useDebounce.jsx";
import usePagination from "/src/hooks/usePagination.jsx";
import Modal from "/src/components/Modal/Index.jsx";
import NotFound from "/src/pages/NotFound.jsx";
import DropdownButton from "/src/components/DropdownButton/Index.jsx";
import UserFormModal from "./UserFormModal.jsx";
import UserAdminFormModal from "./UserAdminFormModal.jsx";
import {Link} from "react-router-dom";

function UserIndex() {
    const { hasPermission } = usePermissions();
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);

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
    const [ssoModalShow, setSsoModalShow] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(false);
    const [editData, setEditData] = useState(null);

    const refreshData = () => {
        setRefresh(!refresh); // Trigger refresh
    };

    const columns = [
        { label: "Prioritas", key: "priority", sortable:true},
        { label: "Username", key: "username", sortable:true},
        { label: "Nama", key: "name", sortable:true},
        { label: "E-mail", key: "email", sortable:true, className:"hidden md:table-cell"},
    ];

    const fetchData = async () => {
        setLoading(true)
        try {
            const result = await get(`/users?page=${page}&size=${rowsPerPage}&sortBy=${sorting.sortBy}&sortOrder=${sorting.sortOrder}&term=${search}`, accessToken, {});

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
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage, debounceValue, refresh, sorting]);

    const handleOnView = (item) => {
        return `/users/${item.id}`;
    }

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
                result = await put(`/users/${editData.id}`, accessToken, newData);
            } else {
                result = await post('/users', accessToken, newData);
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
            const result = await del(`/users/${itemToDelete?.id}`, accessToken, {});

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

    const handleSsoSubmit = async (selectedRows) => {
        try {
            const result = await post(`/users/staff`, accessToken, {staffs: selectedRows});

            if (result.success)
            {
                refreshData();
                toast.success(result.message)
                setSsoModalShow(false)
                return true;
            }

            throw result.message;
        }
        catch (err)
        {
            toast.error(err)
            return false
        }
    }

    const actions = ['view', 'edit', 'delete']

    if (!hasPermission('create users'))
    {
        return <NotFound />
    }

    const handleOptionSelect = (option) => {
        if (option.value === 'pengguna')
        {
            setSsoModalShow(true)
        }
        else if (option.value === 'admin')
        {
            setEditData(null);
            setModalShow(true);
        }
    };

    const options = [
        { label: "Pengguna", value: "pengguna" },
        { label: "Admin", value: "admin" },
    ];

    return (
        <>
            <div className="container mx-auto px-4 mt-5">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h2 className="text-xl">Pengguna</h2>
                    </div>

                    <div className="flex gap-2">
                        <DropdownButton
                            buttonLabel="Tambah"
                            options={options}
                            onOptionSelect={handleOptionSelect}
                        />
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-5 pb-20 md:pb-10">
                <Datatable
                    title="Daftar Pengguna"
                    page={page}
                    rowsPerPage={rowsPerPage}
                    search={search}
                    data={data}
                    total={total}
                    columns={columns}
                    loading={loading}
                    sort={sorting}
                    rowsPerPageOption={[10, 25, 50, 100]}
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
                <p>Hapus pengguna {itemToDelete?.name}?</p>
            </Modal>

            <UserFormModal
                show={ssoModalShow}
                handleClose={() => setSsoModalShow(false)}
                handleSubmit={handleSsoSubmit}
                loading={loading}
            />

            <UserAdminFormModal
                show={modalShow}
                handleClose={() => setModalShow(false)}
                handleSubmit={handleSubmit}
                loading={loading}
                defaultData={editData}
            />
        </>
    )
}

export default UserIndex;