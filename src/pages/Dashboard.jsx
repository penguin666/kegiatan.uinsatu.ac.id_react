import React from "react";
import DashboardHeader from "../components/Other/DashboardHeader.jsx";
import {Link, useOutletContext} from "react-router-dom";
import {useAuth} from "../context/AuthProvider.jsx";
import {motion} from "framer-motion";
import {usePermissions} from "../context/PermissionProvider.jsx";

function Dashboard() {
    const { hasPermission } = usePermissions();
    const {user} = useAuth();
    const avatar = "/assets/img/man_icon.png";
    const menus = [
        {
            group_name: 'Dashboard',
            children: [
                {
                    title: "Rapat",
                    icon: '/assets/icon/conversation.png',
                    to:'/meetings',
                    color: "bg-teal-700",
                },
                {
                    title: "Kegiatan",
                    icon: '/assets/icon/calendar.png',
                    to:'/events',
                    color: "bg-red-700",
                },
                {
                    title: "Buku Tamu",
                    icon: '/assets/icon/guests-book.png',
                    to:'/guest-books',
                    color: "bg-cyan-700",
                    permission: 'create guestbook',
                }
            ]
        }
    ];

    const [sidebarToggle] = useOutletContext();

    return (
        <>
            <main className="h-full">
                {/* Welcome Header */}
                <DashboardHeader
                    toggle={sidebarToggle}
                    avatar={avatar}
                    user={user}
                />

                {/* OS Kredit */}
                {menus.map(group => {
                    // Filter children: Tampilkan jika tidak memiliki permission atau jika user memiliki izin
                    const filteredChildren = group.children.filter(menu =>
                        !menu.permission || hasPermission(menu.permission)
                    );

                    if (filteredChildren.length === 0) return null; // Jangan tampilkan grup jika tidak ada menu yang valid

                    return (
                        <div className="px-2 mx-auto mainCard pb-20 md:pb-10" key={group.group_name}>
                            <h1 className="text-slate-500 pb-3 text-base md:text-lg">
                                {group.group_name}
                            </h1>

                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-hidden overflow-x-auto">
                                {filteredChildren.map(data => (
                                    <Link key={data.title} to={data.to}>
                                        <motion.div
                                            whileHover={{ scale: 0.9, transition: { duration: 0.2 } }}
                                            className={`widgetCard px-6 py-4 text-center flex flex-col justify-between text-slate-50 ${data.color}`}
                                        >
                                            <div className="items-center mx-auto p-3 justify-between">
                                                <img src={data.icon} alt="Icon Menu"/>
                                            </div>
                                            <div className="font-semibold m-auto pt-4">
                                                <span className="text-lg lg:text-[30px]">{data.title}</span>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/*<FloatingButton />*/}
            </main>
        </>
    );
}

export default Dashboard;