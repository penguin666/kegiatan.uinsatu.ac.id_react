import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBuilding, faCalendar} from "@fortawesome/free-solid-svg-icons";

export default function FilterForm({filters, setFilters, units, loading})
{
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({...prev, [name]: value}));
    };

    return (
        <>
            {/* Unit */}
            <div className="flex flex-col">
                <label className="text-gray-700 mb-2">Unit</label>
                <div className="relative">
                    <div className="absolute left-0 top-0 h-full w-10 flex items-center justify-center text-gray-400">
                        <FontAwesomeIcon icon={faBuilding} />
                    </div>
                    <select
                        name="unit_id"
                        value={filters.unit_id}
                        onChange={handleChange}
                        required
                        className="min-h-[40px] text-sm placeholder-gray-500 pl-10 pr-4 rounded border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        disabled={loading}
                    >
                        <option value="">Pilih Unit</option>
                        {units.length > 0 && units.map(option => (
                            <option key={option.id} value={option.id}>{option.unit}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Dari Tanggal */}
            <div className="flex flex-col">
                <label className="text-gray-700 mb-2">Dari Tanggal</label>
                <div className="relative">
                    <div className="absolute left-0 top-0 h-full w-10 flex items-center justify-center text-gray-400">
                        <FontAwesomeIcon icon={faCalendar} />
                    </div>
                    <input
                        required
                        type="date"
                        name="start_date"
                        value={filters.start_date}
                        onChange={handleChange}
                        className="min-h-[40px] text-sm placeholder-gray-500 pl-10 pr-4 rounded border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                    />
                </div>
            </div>

            {/* Sampai Tanggal */}
            <div className="flex flex-col">
                <label className="text-gray-700 mb-2">Sampai Tanggal</label>
                <div className="relative">
                    <div className="absolute left-0 top-0 h-full w-10 flex items-center justify-center text-gray-400">
                        <FontAwesomeIcon icon={faCalendar} />
                    </div>
                    <input
                        required
                        type="date"
                        name="end_date"
                        value={filters.end_date}
                        onChange={handleChange}
                        className="min-h-[40px] text-sm placeholder-gray-500 pl-10 pr-4 rounded border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                    />
                </div>
            </div>
        </>
    )
}