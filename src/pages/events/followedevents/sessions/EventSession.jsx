import useDebounce from "/src/hooks/useDebounce.jsx";
import usePagination from "/src/hooks/usePagination.jsx";
import {get} from "/src/api/kegiatan.uinsatu.jsx";
import React, {useEffect, useState} from "react";
import {useAuth} from "/src/context/AuthProvider.jsx";
import Datatable from "/src/components/Datatables/Datatable.jsx";
import {toast} from "react-toastify";
import {useOutletContext} from "react-router-dom";

export default function EventSession() {
    const {accessToken} = useAuth();
    const [event] = useOutletContext();
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

    const columns = [
        { label: "Sesi", key: "name", sortable:true},
        { label: "Waktu Mulai", key: "start_time", sortable:true},
        { label: "Waktu Akhir", key: "end_time", sortable:true},
        { label: "Status", key: "status", sortable:true, render: (item) => (
                <span
                    className={`px-2 py-1 text-white rounded-lg text-sm ${item.status ? 'bg-teal-700' : 'bg-red-700'}`}
                >
                    {item.status ? 'Sudah Presensi' : 'Belum Presensi'}
                </span>
            )
        },
    ];

    const fetchSessions = async () => {
        setLoadingData(true)
        try {
            const result = await get(`/followed-events/${event.id}/sessions?page=${page}&size=${rowsPerPage}&sortBy=${sorting.sortBy}&sortOrder=${sorting.sortOrder}&term=${search}`, accessToken, {});

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
    }, [page, rowsPerPage, debounceValue, sorting, event]);

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
            />
        </>
    )
}