import useDebounce from "/src/hooks/useDebounce.jsx";
import usePagination from "/src/hooks/usePagination.jsx";
import {get} from "/src/api/kegiatan.uinsatu.jsx";
import React, {useEffect, useState} from "react";
import {useAuth} from "/src/context/AuthProvider.jsx";
import Datatable from "/src/components/Datatables/Datatable.jsx";
import {toast} from "react-toastify";
import {useOutletContext} from "react-router-dom";

export default function EventParticipant() {
    const [event] = useOutletContext();
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

    const columns = [
        { label: "Username Peserta", key: "username", sortable:true},
        { label: "Nama Peserta", key: "name", sortable:true}
    ];

    const fetchParticipants = async () => {
        setLoading(true)
        try {
            const result = await get(`/followed-events/${event.id}/participants?page=${page}&size=${rowsPerPage}&sortBy=${sorting.sortBy}&sortOrder=${sorting.sortOrder}&term=${search}`, accessToken, {});

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
        fetchParticipants();
    }, [page, rowsPerPage, debounceValue, sorting, event]);

    const actions = []

    return (
        <>
            <Datatable
                title="Peserta Kegiatan"
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
                    actions
                }}
            />
        </>
    )
}