import React, {Suspense} from "react";
import Navbar from "../../components/Navbar/Index";
import {Outlet, useOutletContext} from "react-router-dom";
import Spinner from "../../components/Other/Spinner.jsx";
import {usePermissions} from "../../context/PermissionProvider.jsx";
import NotFound from "../NotFound.jsx";

function MasterLayout() {
    const [sidebarToggle] = useOutletContext();
    const { hasPermission } = usePermissions();

    if (!hasPermission('view master'))
    {
        return <NotFound/>
    }

    return (
        <>
            <main className="h-full">
                <Navbar toggle={sidebarToggle}/>

                <Suspense fallback={<Spinner />}>
                    <Outlet/>
                </Suspense>
            </main>
        </>
    );
}

export default MasterLayout;
