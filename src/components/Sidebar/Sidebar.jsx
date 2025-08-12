import {faLeaf, faSignOut} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useEffect, useRef, useState} from "react";
import initMenus from "/src/data/menus.js";
import "./sidebar.css";
import SidebarLogo from "./SidebarLogo.jsx";
import SidebarSearch from "./SidebarSearch.jsx";
import MenuList from "./MenuList.jsx";
import {useAuth} from "/src/context/AuthProvider.jsx";
import {toast} from "react-toastify";
import {usePermissions} from "/src/context/PermissionProvider.jsx";

function Sidebar({...props}) {
    const {hasPermission} = usePermissions();
    const {logout} = useAuth();

    const [menus, setMenus] = useState([]);
    const [scButton, setScButton] = useState(false);
    const search = useRef("");

    useEffect(() => {
        const filteredMenu = initMenus.filter(
            (menu) => !menu.permission || hasPermission(menu.permission)
        );
        setMenus(filteredMenu);
    }, [hasPermission]); // Dependensi agar update saat izin berubah

    const handleChange = (e) => {
        if (e.target.value) {
            setScButton(true);
            setMenus(
                menus.filter((el) => {
                    return el.label.toLowerCase().includes(e.target.value.toLowerCase());
                })
            );
        } else {
            setScButton(false);
            setMenus(filteredMenu);
        }
    };

    const clearSearch = () => {
        search.current.value = "";
        setMenus(filteredMenu);
        setScButton(false);
    };

    const handleLogout = async () => {
        try {
            const result = await logout();
            if (result.success)
            {
                toast.success(result.message)
                return navigate('/auth/login')
            }

            throw result.message
        } catch (error) {
            toast.error(error)
        }
    }

    return (
        <>
            <aside
                id="sidebar"
                className={`sidebarWrapper md:translate-x-0 -translate-x-full md:z-0 z-20 no-scrollbar ${props.className}`}
            >
                {/* Sidebar wrapper */}
                <div className="md:w-64 border-r-2 border-gray-100 h-full flex-col flex flex-shrink-0">
                    {/* Logo */}
                    <SidebarLogo toggle={props.toggle} icon={faLeaf}/>

                    {/* Search Menu */}
                    <SidebarSearch
                        clearSearch={clearSearch}
                        handleChange={handleChange}
                        scButton={scButton}
                        search={search}
                    />

                    {/* Menu */}
                    <MenuList menus={menus} toggle={props.toggle}/>

                    {/* Profile */}
                    <div className="pt-2 border-t border-gray-300">
                        <div className="py-2 px-4">
                            {/* Logout Button */}
                            <button
                                className="py-2 px-4 border border-emerald-500 bg-emerald-600 w-full rounded-full text-gray-200 hover:bg-emerald-600 hover:border-emerald-600 justify-end text-sm"
                                onClick={handleLogout}
                            >
                                <FontAwesomeIcon icon={faSignOut}></FontAwesomeIcon> Logout
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {props.className === "mobile" && (
                <div
                    id="overlaySidebar"
                    onClick={props.toggle}
                    className="hidden absolute w-full h-screen bg-black z-10 inset-0 opacity-60"
                >
                    <div></div>
                </div>
            )}
        </>
    );
}

export default Sidebar;
