import React, {Suspense} from "react";
import {Outlet, useOutletContext} from "react-router-dom";
import Spinner from "/src/components/Other/Spinner.jsx";

export default function EventSessionLayout() {
    const [event] = useOutletContext();

    return (
        <Suspense fallback={<Spinner />}>
            <Outlet context={[event]}/>
        </Suspense>
    );
}