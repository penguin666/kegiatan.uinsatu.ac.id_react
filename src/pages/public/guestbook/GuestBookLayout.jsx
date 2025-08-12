import React, {Suspense} from "react";
import {Outlet} from "react-router-dom";
import Spinner from "/src/components/Other/Spinner.jsx";

function GuestBookLayout() {
    return (
        <>
            <div className="flex min-h-screen">
                <div className="flex w-full flex-col md:flex-row">
                    {/* Image */}
                    <div
                        className="md:bg-[url('/assets/img/18397.jpg')] bg-cover bg-center backdrop-blur-md md:min-h-screen flex flex-wrap md:w-1/2">
                        <div className="items-center text-center flex flex-col relative justify-center mx-auto mt-3">
                            <img
                                src="/assets/img/icon.png"
                                alt="Logo Login"
                                className="md:w-72 w-48 mx-auto"
                            />
                        </div>
                    </div>
                    {/* Login Section */}
                    <div className="flex flex-col md:flex-1 items-center justify-center">
                        <div className="loginWrapper flex flex-col w-full lg:px-36 md:px-8 px-8 md:py-8">

                            <Suspense fallback={<Spinner/>}>
                                <Outlet/>
                            </Suspense>

                            {/* Register Link */}
                            <div className="flex justify-center items-center  my-6 md:mb-0">
                                <span
                                    className="inline-flex items-center font-bold text-emerald-500 text-xs text-center"
                                >
                                    Copyright © 2024 PTIPD UIN SATU Tulungagung
                                </span>
                            </div>
                            {/* End Register Link */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default GuestBookLayout;
