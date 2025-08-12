import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import FilterForm from "./FilterForm.jsx";
import GuestBookChart from "./GuestBookChart.jsx";
import {AnimatePresence, motion} from "framer-motion";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import {get} from "../../../api/kegiatan.uinsatu.jsx";
import {toast} from "react-toastify";
import {useAuth} from "../../../context/AuthProvider.jsx";
import NotFound from "../../NotFound.jsx";
import {usePermissions} from "../../../context/PermissionProvider.jsx";

export default function GuestBookDashboard() {
    const { hasPermission } = usePermissions();
    const {accessToken, user} = useAuth();
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [units, setUnits] = useState([]);
    const [data, setData] = useState(null);

    const [filters, setFilters] = useState({
        unit_id : 0,
        start_date: '',
        end_date:''
    });

    const fetchUnits = async () => {
        setLoading(true)
        try {
            const result = await get(`/users/${user?.id}/units?page=1&size=50&sortBy=id&sortOrder=asc&term=`, accessToken, {});

            if (result.success) {
                setUnits(result.data.data)
            } else {
                throw result.message
            }
        } catch (error) {
            toast.error(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchChart = async () => {
        setLoading(true)
        try {
            const result = await get(`/guest-books/chart?unit_id=${filters.unit_id}&start_date=${filters.start_date}&end_date=${filters.end_date}`, accessToken, {});

            if (result.success) {
                setData(result.data)
            } else {
                throw result.message
            }
        } catch (error) {
            toast.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user && user.id)
        {
            fetchUnits();
        }
    }, []);

    useEffect(() => {
        if (filters.unit_id)
        {
            fetchChart()
        }
    }, [filters, setFilters]);

    if (!hasPermission('view guestbook dashboard'))
    {
        return <NotFound />
    }

    console.log(data)

    return (
        <>
            <div className="container mx-auto px-4 mt-5">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h2 className="text-xl">Dashboard Buku Tamu</h2>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            to={'/guest-books'}
                            className="bg-red-600 hover:bg-red-700 text-gray-100 px-3 py-2 rounded shadow-lg text-sm"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-5">
                <div>
                    {/* Tombol Filter untuk Layar Kecil */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className=" md:hidden flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded shadow hover:bg-emerald-600 transition mb-3"
                    >
                        <FontAwesomeIcon icon={faFilter}/>
                        Filters
                    </button>

                    {/* Filter Grid untuk Layar Besar */}
                    <div className="hidden md:grid md:grid-cols-3 gap-3">
                        <FilterForm
                            units={units}
                            filters={filters}
                            setFilters={setFilters}
                            loading={loading}
                        />
                    </div>

                    {/* Animasi Show/Hide Filter untuk Layar Kecil */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{opacity: 0, y: -10}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -10}}
                                transition={{duration: 0.3, ease: "easeInOut"}}
                                className="flex flex-col md:hidden gap-3"
                            >
                                <FilterForm
                                    units={units}
                                    filters={filters}
                                    setFilters={setFilters}
                                    loading={loading}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-5 pb-20 md:pb-10">
                <GuestBookChart
                    dataset={data}
                    loading={loading}
                />
            </div>
        </>
    )
}