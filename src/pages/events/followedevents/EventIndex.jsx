import React, {useEffect, useState} from "react";
import {get} from "../../../api/kegiatan.uinsatu.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import Datatable from "../../../components/Datatables/Datatable.jsx";
import {toast} from "react-toastify";
import useDebounce from "../../../hooks/useDebounce.jsx";
import usePagination from "../../../hooks/usePagination.jsx";
import {Link} from "react-router-dom";
import moment from "moment";

function EventIndex() {
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
        { label: "Tanggal Kegiatan", key: "event_start_date", sortable:true, render: (item) => (
                `${moment(item.event_start_date).format('LL')} s.d. ${moment(item.event_end_date).format('LL')}`
            )},
        { label: "Kode", key: "code", sortable:true},
        { label: "Nama Kegiatan", key: "name", sortable:true},
        { label: "Pembuat", key: "user_name", sortable:true}
    ];

    const fetchData = async () => {
        setLoading(true)
        try {
            const result = await get(`/followed-events?page=${page}&size=${rowsPerPage}&sortBy=${sorting.sortBy}&sortOrder=${sorting.sortOrder}&term=${search}`, accessToken, {});

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
    }, [page, rowsPerPage, debounceValue, sorting]);

    const handleOnView = (item) => {
        return `/events/followed-events/${item.id}`;
    }

    const actions = ['view']

    return (
        <>
            <div className="container mx-auto px-4 mt-5">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h2 className="text-xl">Kegiatan Yang Diikuti</h2>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            to={'/events'}
                            className="bg-red-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-5 pb-20 md:pb-10">
                <Datatable
                    title="Daftar Kegiatan Yang Diikuti"
                    page={page}
                    rowsPerPage={rowsPerPage}
                    search={search}
                    data={data}
                    total={total}
                    columns={columns}
                    loading={loading}
                    sort={sorting}
                    rowsPerPageOption={[1, 10, 25, 50, 100]}
                    onSort={handleOnSort}
                    onPageChange={handlePageChange}
                    onSearchChange={handleSearchChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    actions={{
                        actions,
                        onView: handleOnView
                    }}
                />
            </div>
        </>
    )
}

export default EventIndex;