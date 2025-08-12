import {useOutletContext} from "react-router-dom";
import useDebounce from "../../../../hooks/useDebounce.jsx";
import usePagination from "../../../../hooks/usePagination.jsx";
import {get} from "../../../../api/kegiatan.uinsatu.jsx";
import React, {useEffect, useState} from "react";
import {useAuth} from "../../../../context/AuthProvider.jsx";
import Datatable from "../../../../components/Datatables/Datatable.jsx";
import {toast} from "react-toastify";

export default function MeetingParticipant() {
    const [meeting] = useOutletContext();
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [modalShow, setModalShow] = useState(false);
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
        { label: "Nama Peserta", key: "name", sortable:true},
        { label: "Kedatangan", key:'id', render: (item) => (
                <span
                    className={`px-2 py-1 text-white rounded-lg text-sm ${item.is_coming ? 'bg-teal-700' : 'bg-red-700'}`}
                >
                    {item.is_coming ? 'Datang' : 'Tidak Datang'}
                </span>
            )
        }
    ];

    const fetchParticipants = async () => {
        setLoading(true)
        try {
            const result = await get(`/followed-meetings/${meeting.id}/participants?page=${page}&size=${rowsPerPage}&sortBy=${sorting.sortBy}&sortOrder=${sorting.sortOrder}&term=${search}`, accessToken, {});

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
    }, [page, rowsPerPage, debounceValue, sorting, refresh, meeting]);

    const actions = []

    return (
        <>
            <Datatable
                title="Peserta Rapat"
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