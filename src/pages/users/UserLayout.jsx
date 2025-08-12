import React, {Suspense} from "react";
import Navbar from "/src/components/Navbar/Index";
import {Outlet, useOutletContext} from "react-router-dom";
import Spinner from "/src/components/Other/Spinner.jsx";
import {usePermissions} from "/src/context/PermissionProvider.jsx";
import NotFound from "/src/pages/NotFound.jsx";
import {setMomentLocaleID} from "/src/config/locale.jsx";

export default function UserLayout() {
    setMomentLocaleID();
    const [sidebarToggle] = useOutletContext();
    const { hasPermission } = usePermissions();

    if (!hasPermission('create users'))
    {
        return <NotFound/>
    }

    return (
        <>
            <main className="h-full">
                <Navbar toggle={sidebarToggle}/>

                <Suspense fallback={<Spinner />}>
                    <Outlet />
                </Suspense>
            </main>
        </>
    );
}