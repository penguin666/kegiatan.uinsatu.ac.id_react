import { useState } from 'react';

function usePagination(initialPage = 1, initialRowsPerPage = 10) {
    const [page, setPage] = useState(initialPage);
    const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
    const [sorting, setSorting] = useState({
        sortBy: '',
        sortOrder: '',
    });
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleOnSort = (column) => {
        let sortOrder = 'asc';
        if (sorting.sortBy === column && sorting.sortOrder === 'asc') {
            sortOrder = 'desc';
        }
        setSorting({ sortBy: column, sortOrder });
    };

    return {
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
    };
}

export default usePagination;