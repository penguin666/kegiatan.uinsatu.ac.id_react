import React, {useEffect, useState} from "react";
import Modal from "../../components/Modal/Index.jsx";
import {useAuth} from "../../context/AuthProvider.jsx";
import usePagination from "../../hooks/usePagination.jsx";
import useDebounce from "../../hooks/useDebounce.jsx";
import {toast} from "react-toastify";
import Datatable from "../../components/Datatables/Datatable.jsx";
import {get} from "../../api/kegiatan.uinsatu.jsx";

function UserFormModal({ show, handleClose, handleSubmit }) {
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
    const [selectedRows, setSelectedRows] = useState([]);

    const handleSelectedRows = (rows) => {
        setSelectedRows(rows);
    };

    const columns = [
        { label: "SIMAK ID", key: "simak_id", sortable:true, className:"d-none d-sm-table-cell"},
        { label: "Username", key: "username", sortable:true},
        { label: "Nama", key: "name", sortable:true},
        { label: "Status", key: "role_name", sortable:true},
    ];

    const fetchData = async () => {
        setLoading(true)
        try {
            const result = await get(`/sso/users?page=${page}&size=${rowsPerPage}&sortBy=${sorting.sortBy}&sortOrder=${sorting.sortOrder}&term=${search}`, accessToken, {});

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

    const onSubmit = async () => {
        setLoading(true)
        const res = await handleSubmit(selectedRows);
        res && handleClose();
        setLoading(false)
    };

    return (
        <Modal
            show={show}
            title="Tambah Pengguna"
            onClose={handleClose}
            onSubmit={onSubmit}
            loading={loading}
            bodyClass="p-0"
            size="lg"
        >
            <form onSubmit={onSubmit}>
                <Datatable
                    selectable
                    selectedKey="name"
                    page={page}
                    rowsPerPage={rowsPerPage}
                    search={search}
                    data={data}
                    total={total}
                    columns={columns}
                    // loading={loading}
                    sort={sorting}
                    rowsPerPageOption={[10, 25, 50, 100, 1000]}
                    onSelectRows={handleSelectedRows}
                    onSort={handleOnSort}
                    onPageChange={handlePageChange}
                    onSearchChange={handleSearchChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    onSelect={handleSubmit}
                />
            </form>
        </Modal>
    )
}

export default UserFormModal;