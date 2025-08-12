import React from "react";
import {Link} from "react-router-dom";
import {usePermissions} from "../../context/PermissionProvider.jsx";
import {motion} from "framer-motion";

function MasterMenu() {
    const { hasPermission } = usePermissions();

    const menus = [
        { permission: 'create roles', link: '/master/roles', color: 'bg-teal-700', icon: 'coordinate.png', label: 'Peran' },
        { permission: 'create permissions', link: '/master/permissions', color: 'bg-red-700', icon: 'permission.png', label: 'Perizinan' },
        { permission: 'create units', link: '/master/units', color: 'bg-cyan-500', icon: 'corporate.png', label: 'Unit' },
        { permission: 'create positions', link: '/master/positions', color: 'bg-orange-500', icon: 'talent-search.png', label: 'Jabatan' },
        { permission: 'create guesttypes', link: '/master/guest-types', color: 'bg-emerald-500', icon: 'guest-list.png', label: 'Jenis Tamu' }
    ];

    return (
        <div className="mainCard">
            <h1 className="text-slate-500 pb-3 text-base md:text-lg">
                Master Data
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-hidden overflow-x-auto mb-10">
                {menus.map(({permission, link, color, icon, label}) =>
                        hasPermission(permission) && (
                            <Link key={permission} to={link}>
                                <motion.div
                                    whileHover={{scale: 0.9, transition: {duration: 0.2}}}
                                    className={`widgetCard px-6 py-4 text-center flex flex-col justify-between ${color} text-slate-50`}
                                >
                                    <div className="items-center mx-auto p-3">
                                        <img src={`/assets/icon/${icon}`} alt={label}/>
                                    </div>
                                    <div className="font-semibold m-auto pt-4">
                                        <span className="text-md lg:text-[30px]">{label}</span>
                                    </div>
                                </motion.div>
                            </Link>
                        )
                )}
            </div>
        </div>
    );
}

export default MasterMenu;
