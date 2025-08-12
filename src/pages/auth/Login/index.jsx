import React, {useEffect, useState} from "react";
import {faIdCard, faLock} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";
import {SSO_APP_ID} from "../../../config/variable.jsx";
import {toast} from 'react-toastify';
import {useAuth} from "../../../context/AuthProvider.jsx";

function LoginIndex() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username:'',
        password:''
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        e.preventDefault();
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]:e.target.value
        }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await login(formData.username, formData.password);
            if (result.success)
            {
                toast.success(result.message)
                return navigate('/')
            }

            throw result.message
        } catch (error) {
            toast.error(error)
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            setTimeout(() => navigate('/'), 0)
        }
    }, [isAuthenticated, navigate]);

    return (
        <>
            <div className="flex min-h-screen">
                <div className="flex w-full flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:bg-[url('/assets/img/18397.jpg')] bg-cover bg-center backdrop-blur-md md:min-h-screen flex flex-wrap md:w-1/2">
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
                            {/* Login Header Text */}
                            <div className="hidden md:block font-medium self-center text-xl sm:text-3xl text-gray-800">
                                Selamat Datang!
                            </div>

                            {/* Sparator */}
                            <div className="hidden md:block relative mt-10 h-px bg-gray-300">
                                <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                                  <span className="bg-white px-4 text-xs text-gray-500 uppercase">
                                    Login dengan NIP atau SSO UINSATU
                                  </span>
                                </div>
                            </div>

                            <div className="md:hidden block my-4">
                                <h1 className="text-2xl font-semibold">Login</h1>
                            </div>

                            {/* Login Form */}
                            <div className="md:mt-10 mt-4">
                                <form onSubmit={handleSubmit}>
                                    {/* Username */}
                                    <div className="flex flex-col mb-3">
                                        <div className="relative">
                                            <div
                                                className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                                <FontAwesomeIcon icon={faIdCard} />
                                            </div>

                                            <input
                                                type="text"
                                                name="username"
                                                autoComplete="off"
                                                onChange={handleInputChange}
                                                className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                                                placeholder="Username"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="flex flex-col mb-6">
                                        <div className="relative">
                                            <div
                                                className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                                <FontAwesomeIcon icon={faLock}/>
                                            </div>

                                            <input
                                                type="password"
                                                name="password"
                                                onChange={handleInputChange}
                                                className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                                                placeholder="Password"
                                            />
                                        </div>
                                    </div>

                                    {/* Button Login */}
                                    <div className="flex w-full">
                                        <button
                                            disabled={loading}
                                            type="submit"
                                            className="flex items-center justify-center focus:outline-none text-white text-sm bg-emerald-500 hover:bg-emerald-700 rounded-lg md:rounded md:py-2 py-3 w-full transition duration-150 ease-in"
                                        >
                                          <span className="mr-2 md:uppercase">
                                            {loading ? "Memproses..." : "Login"}
                                          </span>
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Sparator */}
                            <div className="relative mt-6 h-px bg-gray-300">
                                <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                                  <span className="bg-white px-4 text-xs text-gray-500 uppercase">
                                    OR
                                  </span>
                                </div>
                            </div>

                            {/* Social Button */}
                            <div className="flex items-center justify-center text-center w-full mt-6">
                                <a
                                    href={`https://sso.uinsatu.ac.id/login?appid=${SSO_APP_ID}`}
                                    className="inline-flex items-center focus:outline-none text-slate-500 text-sm bg-slate-200 rounded-lg md:rounded md:py-2 px-3 py-3 w-full transition duration-150 ease-in"
                                >
                                    <span className="mr-2 flex-1">Login dengan SSO UINSATU</span>
                                </a>
                            </div>
                            {/* End Social Button */}

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

export default LoginIndex;
