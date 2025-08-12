import React from "react";
import {Link} from "react-router-dom";
import {usePermissions} from "../../context/PermissionProvider.jsx";
import {motion} from "framer-motion";
import EventSearch from "./EventSearch.jsx";

function EventMenu() {
    const { hasPermission } = usePermissions();

    return (
        <div className="mainCard">
            <h1 className="text-slate-500 pb-3 text-base md:text-lg">
                Kegiatan
            </h1>

            <div className="md:w-96">
                <EventSearch/>
            </div>

            <div
                className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-hidden overflow-x-auto mb-10"
            >
                {hasPermission('create myevents') &&
                    <Link to={'/events/my-events'}>
                        <motion.div
                            whileHover={{
                                scale: 0.9,
                                transition: {duration: 0.2},
                            }}
                            className="widgetCard px-6 py-4 text-center flex flex-col justify-between bg-teal-700 text-slate-50"
                        >
                            <div
                                className="items-center mx-auto p-3 justify-between">
                                <img src="/assets/icon/calendar.png" alt="Kegiatan Saya"/>
                            </div>
                            <div className="font-semibold m-auto pt-4">
                                <span className="text-lg lg:text-[30px]">Kegiatan Saya</span>
                            </div>
                        </motion.div>
                    </Link>
                }
                <Link to={'/events/followed-events'}>
                    <motion.div
                        whileHover={{
                            scale: 0.9,
                            transition: {duration: 0.2},
                        }}
                        className="widgetCard px-6 py-4 text-center flex flex-col justify-between bg-cyan-700 text-slate-50"
                    >
                        <div
                            className="items-center mx-auto p-3 justify-between">
                            <img src="/assets/icon/event.png" alt="Kegiatan Yang Diikuti"/>
                        </div>
                        <div className="font-semibold m-auto pt-4">
                            <span className="text-lg lg:text-[30px]">Kegiatan Yang Diikuti</span>
                        </div>
                    </motion.div>
                </Link>
                {hasPermission('create events') &&
                    <Link to={'/events/admin'}>
                        <motion.div
                            whileHover={{
                                scale: 0.9,
                                transition: {duration: 0.2},
                            }}
                            className="widgetCard px-6 py-4 text-center flex flex-col justify-between bg-red-700 text-slate-50"
                        >
                            <div
                                className="items-center mx-auto p-3 justify-between">
                                <img src="/assets/icon/planner.png" alt="Kegiatan Admin"/>
                            </div>
                            <div className="font-semibold m-auto pt-4">
                                <span className="text-lg lg:text-[30px]">Kegiatan Admin</span>
                            </div>
                        </motion.div>
                    </Link>
                }
            </div>
        </div>
    );
}

export default EventMenu;
