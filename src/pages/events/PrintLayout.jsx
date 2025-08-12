import {Outlet} from "react-router-dom";
import React, {Suspense} from "react";
import Spinner from "/src/components/Other/Spinner.jsx";
import {setMomentLocaleID} from "/src/config/locale.jsx";

export default function PrintLayout() {
    setMomentLocaleID();

    return (
        <Suspense fallback={<Spinner />}>
            <Outlet />
        </Suspense>
    )
}