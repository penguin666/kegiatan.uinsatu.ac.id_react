import React, {useEffect, useState} from "react";
import {get} from "../../../api/kegiatan.uinsatu.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import Datatable from "../../../components/Datatables/Datatable.jsx";
import {toast} from "react-toastify";
import useDebounce from "../../../hooks/useDebounce.jsx";
import usePagination from "../../../hooks/usePagination.jsx";
import {Link} from "react-router-dom";
import moment from "moment";

function MeetingIndex() {
    const {accessToken} = useAuth();
    const [loadingData, setDoadingData] = useState(false);
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
        { label: "Tanggal Rapat", key: "date", sortable:true, render: (item) => (
                moment(item.date).format('LL')
            )},
        { label: "Nama Rapat", key: "name", sortable:true}
    ];

    const fetchData = async () => {
        setDoadingData(true)
        try {
            const result = await get(`/followed-meetings?page=${page}&size=${rowsPerPage}&sortBy=${sorting.sortBy}&sortOrder=${sorting.sortOrder}&term=${search}`, accessToken, {});

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
            setDoadingData(false)
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage, debounceValue, refresh, sorting]);

    const handleOnView = (item) => {
        return `/meetings/followed-meetings/${item.id}`;
    }

    const actions = ['view']

    return (
        <>
            <div className="container mx-auto px-4 mt-5">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h2 className="text-xl">Rapat Yang Diikuti</h2>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            to={'/meetings'}
                            className="bg-red-600 hover:bg-red-700 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-5 pb-20 md:pb-10">
                <Datatable
                    title="Daftar Rapat Yang Diikuti"
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
                        onView: handleOnView
                    }}
                />
            </div>
        </>
    )
}

export default MeetingIndex;