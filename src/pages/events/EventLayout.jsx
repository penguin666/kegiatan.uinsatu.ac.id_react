import React, {Suspense} from "react";
import Navbar from "/src/components/Navbar/Index";
import {Outlet, useOutletContext} from "react-router-dom";
import Spinner from "/src/components/Other/Spinner.jsx";
import {setMomentLocaleID} from "/src/config/locale.jsx";
import QrScannerButton from "./QrScannerButton.jsx";
import EventQrScanner from "./EventQrScanner.jsx";

function EventLayout() {
    setMomentLocaleID();
    const [sidebarToggle] = useOutletContext();

    return (
        <>
            <main className="h-full">
                <Navbar toggle={sidebarToggle}/>

                <Suspense fallback={<Spinner />}>
                    <Outlet />
                </Suspense>

                <QrScannerButton />
            </main>
        </>
    );
}

export default EventLayout;
