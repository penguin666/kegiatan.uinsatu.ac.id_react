import React from "react";
import {Link} from "react-router-dom";
import {usePermissions} from "/src/context/PermissionProvider.jsx";
import {motion} from "framer-motion";

function GuestBookMenu() {
    const { hasPermission } = usePermissions();

    return (
        <div className="mainCard">
            <h1 className="text-slate-500 pb-3 text-base md:text-lg">
                Buku Tamu
            </h1>

            <div
                className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-hidden overflow-x-auto mb-10"
            >
                {hasPermission('view guestbook dashboard') &&
                    <Link to={'/guest-books/dashboard'}>
                        <motion.div
                            whileHover={{
                                scale: 0.9,
                                transition: { duration: 0.2 },
                            }}
                            className="widgetCard px-6 py-4 text-center flex flex-col justify-between bg-emerald-500 text-slate-50"
                        >
                            <div
                                className="items-center mx-auto p-3 justify-between">
                                <img src="/assets/icon/dashboard.png" alt="Dashboard Buku Tamu"/>
                            </div>
                            <div className="font-semibold m-auto pt-4">
                                <span className="text-lg lg:text-[30px]">Dashboard Buku Tamu</span>
                            </div>
                        </motion.div>
                    </Link>
                }

                {hasPermission('create guestbook') &&
                    <Link to={'/guest-books/admin'}>
                        <motion.div
                            whileHover={{
                                scale: 0.9,
                                transition: { duration: 0.2 },
                            }}
                            className="widgetCard px-6 py-4 text-center flex flex-col justify-between bg-cyan-700 text-slate-50"
                        >
                            <div
                                className="items-center mx-auto p-3 justify-between">
                                <img src="/assets/icon/guests-book.png" alt="Buku Tamu Admin"/>
                            </div>
                            <div className="font-semibold m-auto pt-4">
                                <span className="text-lg lg:text-[30px]">Buku Tamu Admin</span>
                            </div>
                        </motion.div>
                    </Link>
                }
            </div>
        </div>
    );
}

export default GuestBookMenu;
