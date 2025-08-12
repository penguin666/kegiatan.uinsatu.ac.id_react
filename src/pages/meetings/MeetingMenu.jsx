import React from "react";
import {Link} from "react-router-dom";
import {usePermissions} from "../../context/PermissionProvider.jsx";
import {motion} from "framer-motion";

function MeetingMenu() {
    const { hasPermission } = usePermissions();

    return (
        <div className="mainCard">
            <h1 className="text-slate-500 pb-3 text-base md:text-lg">
                Rapat
            </h1>

            <div
                className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-hidden overflow-x-auto mb-10"
            >
                {hasPermission('create mymeetings') &&
                    <Link to={'/meetings/my-meetings'}>
                        <motion.div
                            whileHover={{
                                scale: 0.9,
                                transition: { duration: 0.2 },
                            }}
                            className="widgetCard px-6 py-4 text-center flex flex-col justify-between bg-teal-700 text-slate-50"
                        >
                            <div
                                className="items-center mx-auto p-3 justify-between">
                                <img src="/assets/icon/conversation.png" alt="Rapat Saya"/>
                            </div>
                            <div className="font-semibold m-auto pt-4">
                                <span className="text-lg lg:text-[30px]">Rapat Saya</span>
                            </div>
                        </motion.div>
                    </Link>
                }
                <Link to={'/meetings/followed-meetings'}>
                    <motion.div
                        whileHover={{
                            scale: 0.9,
                            transition: { duration: 0.2 },
                        }}
                        className="widgetCard px-6 py-4 text-center flex flex-col justify-between bg-cyan-700 text-slate-50"
                    >
                        <div
                            className="items-center mx-auto p-3 justify-between">
                            <img src="/assets/icon/meeting%20(1).png" alt="Rapat Yang Diikuti"/>
                        </div>
                        <div className="font-semibold m-auto pt-4">
                            <span className="text-lg lg:text-[30px]">Rapat Yang Diikuti</span>
                        </div>
                    </motion.div>
                </Link>
                {hasPermission('create meetings') &&
                    <Link to={'/meetings/admin'}>
                        <motion.div
                            whileHover={{
                                scale: 0.9,
                                transition: { duration: 0.2 },
                            }}
                            className="widgetCard px-6 py-4 text-center flex flex-col justify-between bg-red-700 text-slate-50"
                        >
                            <div
                                className="items-center mx-auto p-3 justify-between">
                                <img src="/assets/icon/meeting%20(2).png" alt="Rapat Admin"/>
                            </div>
                            <div className="font-semibold m-auto pt-4">
                                <span className="text-lg lg:text-[30px]">Rapat Admin</span>
                            </div>
                        </motion.div>
                    </Link>
                }
            </div>
        </div>
    );
}

export default MeetingMenu;
