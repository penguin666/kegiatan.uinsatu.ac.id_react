import {faBars} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {useAuth} from "../../context/AuthProvider.jsx";
import {Link} from "react-router-dom";
import NotFound from "../../pages/NotFound.jsx";

function Index({toggle}) {
    const avatar = "/assets/img/man_icon.png";
    const {user} = useAuth();

    if(!user)
    {
        return <NotFound/>
    }

    return (
        <>
            <header className="print:hidden">
                <div className="shadow-sm">
                    <div className="relative bg-white flex w-full items-center px-5 py-2.5">
                        <div className="flex-1 flex items-center justify-start">
                            <p className="block md:hidden cursor-pointer">
                                <FontAwesomeIcon icon={faBars} onClick={toggle}/>
                            </p>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            <Link to={'/'}>
                                <p className="block md:hidden cursor-pointer">
                                    <img
                                        src="/assets/img/icon.png"
                                        alt="Logo Kegiatan UINSATU"
                                        className="md:w-72 w-48 mx-auto"
                                    />
                                </p>
                            </Link>
                        </div>
                        <div className="flex-1 flex items-center justify-end">
                            <ul className="flex flex-row gap-4 items-center">
                                <li className="hidden md:block">
                                  <span className="h-9 w-9 cursor-pointer text-gray-600">
                                    {user.name}
                                  </span>
                                </li>
                                <li>
                                  <span>
                                      <img
                                          className="rounded-full h-9 w-9 border cursor-pointer"
                                          src={avatar}
                                          alt="Avatar"
                                      />
                                  </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Index;
