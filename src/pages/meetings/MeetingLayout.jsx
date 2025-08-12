import React, {Suspense} from "react";
import Navbar from "../../components/Navbar/Index";
import {Outlet, useOutletContext} from "react-router-dom";
import Spinner from "../../components/Other/Spinner.jsx";
import {setMomentLocaleID} from "../../config/locale.jsx";

function MeetingLayout() {
    setMomentLocaleID();
    const [sidebarToggle] = useOutletContext();

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

export default MeetingLayout;
