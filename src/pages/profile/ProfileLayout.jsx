import React, {Suspense} from "react";
import Navbar from "../../components/Navbar/Index";
import {Link, Outlet, useOutletContext} from "react-router-dom";
import Spinner from "../../components/Other/Spinner.jsx";
import {usePermissions} from "../../context/PermissionProvider.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faIdCard, faUser, faUserNinja} from "@fortawesome/free-solid-svg-icons";
import {useAuth} from "../../context/AuthProvider.jsx";
import NotFound from "../NotFound.jsx";

export default function ProfileLayout() {
    const [sidebarToggle] = useOutletContext();
    const { hasPermission } = usePermissions();
    const {user} = useAuth();

    if(!user)
    {
        return <NotFound/>
    }

    return (
        <>
            <main className="h-full">
                <Navbar toggle={sidebarToggle}/>

                <div className="container mx-auto px-4 mt-5 pb-20 md:pb-10">
                    <div className="flex justify-between items-center mb-5">
                        <div>
                            <h2 className="text-xl">{user.name}</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 md:gap-x-4 gap-y-4">
                        <div>
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden min-h-40">
                                <div className="bg-teal-700 px-4 py-3 border-b flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-white">Informasi</h3>
                                </div>

                                <div className="px-4 py-3">
                                    <div className="flex flex-col">
                                        <div className="relative mx-auto my-3">
                                            <img src="/assets/img/man_icon.png" alt={`Foto ${user.name}`}
                                                 style={{width: '200px', height: '200px'}}
                                                 className="w-full h-full object-cover rounded-full"
                                            />
                                            {/*<button*/}
                                            {/*    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs hover:bg-red-700">*/}
                                            {/*    Delete*/}
                                            {/*</button>*/}
                                        </div>
                                        <div className=" text-center mx-auto">
                                            <h2 className="font-bold text-xl text-gray-700">{user.name}</h2>
                                            <span className="text-gray-500">
                                            {user.email}
                                        </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-3">
                            <div className="justify-center space-x-4 flex">
                                <div className="flex-1 bg-teal-700 shadow-lg rounded-lg overflow-hidden mb-3">
                                    <div className="px-4 py-3">
                                        <Link
                                            to={`/profile`}
                                            className="flex flex-row justify-center items-center text-gray-200 hover:text-white transition"
                                        >
                                            <FontAwesomeIcon icon={faIdCard} className="mx-1"/>
                                            <span className="mx-1">Akun</span>
                                        </Link>
                                    </div>
                                </div>
                                {user.simak_id &&
                                    <div
                                        className="flex-1 bg-teal-700 shadow rounded-lg overflow-hidden text-white mb-3">
                                        <div className="px-4 py-3">
                                            <Link
                                                to={`/profile/show`}
                                                className="flex flex-row justify-center items-center text-gray-200 hover:text-white transition"
                                            >
                                                <FontAwesomeIcon icon={faUser}/>
                                                <span className="mx-1">Profil</span>
                                            </Link>
                                        </div>
                                    </div>
                                }
                                {hasPermission('create userroles') &&
                                    <div
                                        className="flex-1 bg-teal-700 shadow rounded-lg overflow-hidden text-white mb-3">
                                        <div className="px-4 py-3">
                                            <Link
                                                to={`/profile/roles`}
                                                className="flex flex-row justify-center items-center text-gray-200 hover:text-white transition"
                                            >
                                                <FontAwesomeIcon icon={faUserNinja}/>
                                                <span className="mx-1">Peran</span>
                                            </Link>
                                        </div>
                                    </div>
                                }
                            </div>

                            <Suspense fallback={<Spinner/>}>
                                <Outlet context={[user]}/>
                            </Suspense>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}