import useDebounce from "/src/hooks/useDebounce.jsx";
import usePagination from "/src/hooks/usePagination.jsx";
import {get} from "/src/api/kegiatan.uinsatu.jsx";
import React, {useEffect, useState} from "react";
import {useAuth} from "/src/context/AuthProvider.jsx";
import Datatable from "/src/components/Datatables/Datatable.jsx";
import {toast} from "react-toastify";
import DownloadButton from "./DownloadButton.jsx";

export default function EventSessionParticipant({session}) {
    const {accessToken} = useAuth();
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

    const columns = [
        { label: "Username", key: "username", sortable:true},
        { label: "Nama Peserta", key: "name", sortable:true},
        { label: "Waktu Presensi", key: "confirmed_at", sortable:true},
    ];

    const fetchParticipants = async () => {
        setLoadingData(true)
        try {
            const result = await get(`/my-events/${session.event_id}/sessions/${session.id}/participants?page=${page}&size=${rowsPerPage}&sortBy=${sorting.sortBy}&sortOrder=${sorting.sortOrder}&term=${search}`, accessToken, {});

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
        fetchParticipants();
    }, [page, rowsPerPage, debounceValue, sorting, refresh, session]);

    return (
        <>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden min-h-40">
                <div className="bg-teal-700 px-4 py-3 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Peserta Sesi</h3>
                    <div className="flex gap-2">
                        <DownloadButton session={session}/>
                    </div>
                </div>

                <Datatable
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
            </div>
        </>
    )
}