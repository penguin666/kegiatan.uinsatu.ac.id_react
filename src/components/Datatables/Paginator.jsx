import {faAngleLeft, faAngleRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function Paginator({ page, total, rowsPerPage, onPageChange }) {
    const totalPages = Math.ceil(total / rowsPerPage);
    const startEntry = (page - 1) * rowsPerPage + 1;
    const endEntry = Math.min(page * rowsPerPage, total);

    // Hitung halaman yang akan ditampilkan (3 ke kiri dan 3 ke kanan)
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                Showing <span className="font-medium">{startEntry}</span> to <span
                className="font-medium">{endEntry}</span> of <span className="font-medium">{total}</span> entries
            </div>
            <div className="flex items-center space-x-1">
                {/* Previous Button */}
                <button
                    type="button"
                    className={`px-3 py-1 rounded ${page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-emerald-700 hover:bg-blue-100'}`}
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                >
                    <FontAwesomeIcon icon={faAngleLeft} />
                </button>

                {/* First Page */}
                {startPage > 1 && (
                    <>
                        <button
                            type="button"
                            className={`px-3 py-1 rounded ${page === 1 ? 'bg-emerald-500 text-white' : 'text-emerald-700 hover:bg-blue-100'}`}
                            onClick={() => onPageChange(1)}
                        >
                            1
                        </button>
                        {startPage > 2 && (
                            <span className="px-3 py-1 text-gray-500">...</span>
                        )}
                    </>
                )}

                {/* Page Numbers */}
                {Array.from({length: endPage - startPage + 1}, (_, index) => {
                    const pageIndex = startPage + index;
                    return (
                        <button
                            key={pageIndex}
                            type="button"
                            className={`px-3 py-1 rounded ${page === pageIndex ? 'bg-emerald-500 text-white' : 'text-emerald-700 hover:bg-blue-100'}`}
                            onClick={() => onPageChange(pageIndex)}
                        >
                            {pageIndex}
                        </button>
                    );
                })}

                {/* Last Page */}
                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && (
                            <span className="px-3 py-1 text-gray-500">...</span>
                        )}
                        <button
                            type="button"
                            className={`px-3 py-1 rounded ${page === totalPages ? 'bg-emerald-500 text-white' : 'text-emerald-700 hover:bg-blue-100'}`}
                            onClick={() => onPageChange(totalPages)}
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                {/* Next Button */}
                <button
                    type="button"
                    className={`px-3 py-1 rounded ${page === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-emerald-700 hover:bg-blue-100'}`}
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                >
                    <FontAwesomeIcon icon={faAngleRight} />
                </button>
            </div>
        </div>
    )
}

export default Paginator;