import {useNavigate, useSearchParams} from "react-router-dom";
import React, {useEffect} from "react";
import {useAuth} from "../context/AuthProvider.jsx";
import {BASE_API_URL} from "../config/variable.jsx";
import {toast} from "react-toastify";

function LoginSso() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const checkToken = async () => {
        try {
            const response = await fetch(`${BASE_API_URL}/login-sso?token=${token}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            });

            // Mengonversi respon ke format JSON
            const data = await response.json();

            if (data.success)
            {
                setAuth(data.data);
                return navigate('/')
            }

            throw data.message
        } catch (error) {
            // Menangani error jaringan atau lainnya
            toast.error(error)
            return navigate('/auth/login')
        }
    }

    useEffect(() => {
        checkToken();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen flex-col gap-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
            <h1 className="text-teal-700 text-lg">Login ke aplikasi...</h1>
        </div>
    )
}

export default LoginSso;