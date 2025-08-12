import React, {Suspense, useEffect, useState} from "react";
import {Link, Outlet, useParams} from "react-router-dom";
import {get} from "../../api/kegiatan.uinsatu.jsx";
import {useAuth} from "../../context/AuthProvider.jsx";
import Spinner from "../../components/Other/Spinner.jsx";
import {toast} from "react-toastify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBuilding,
    faIdCard,
    faUser,
    faUserNinja,
} from "@fortawesome/free-solid-svg-icons";
import {usePermissions} from "../../context/PermissionProvider.jsx";
import NotFound from "../NotFound.jsx";

export default function UserShowLayout() {
    let { userId } = useParams();
    const { hasPermission } = usePermissions();
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});

    const fetchUser = async () => {
        setLoading(true)
        try {
            const result = await get(`/users/${userId}`, accessToken, {});

            if (result.success)
            {
                setUser(result.data)
            }
            else
            {
                throw result.message
            }
        } catch (error) {
            toast.error(error)
        }
        finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchUser();
    }, [userId]);

    if (!hasPermission('create users'))
    {
        return <NotFound />
    }
    else if (loading)
    {
        return <div className="mt-5"><Spinner/></div>
    }

    const menuItems = [
        { link: `/users/${userId}`, icon: faIdCard, label: 'Akun' },
        { link: `/users/${userId}/profile`, icon: faUser, label: 'Profil' },
        { link: `/users/${userId}/roles`, icon: faUserNinja, label: 'Peran' },
        { link: `/users/${userId}/units`, icon: faBuilding, label: 'Unit' }
    ];

    return (
        <>
            <div className="container mx-auto px-4 mt-5 pb-20 md:pb-10">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h2 className="text-xl">{user.name}</h2>
                    </div>

                    <Link
                        to={'/users'}
                        className="bg-red-600 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                    >
                        Kembali
                    </Link>
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
                                             style={{width: '200px', height:'200px'}}
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
                        <div className="justify-center space-x-4 grid grid-cols-4">
                            {menuItems.map(({link, icon, label}) => (
                                <div key={link}
                                     className="bg-teal-700 shadow rounded-lg overflow-hidden text-white mb-3">
                                    <div className="px-2 py-1.5">
                                        <Link to={link}
                                              className="flex flex-row justify-center items-center text-gray-200 hover:text-white transition">
                                            <FontAwesomeIcon icon={icon} className="mx-1"/>
                                            <span className="mx-1">{label}</span>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Suspense fallback={<Spinner/>}>
                            <Outlet context={[user]}/>
                        </Suspense>
                    </div>
                </div>
            </div>
        </>
    )
}