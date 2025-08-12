import React, { createContext, useState, useEffect, useContext } from 'react';
import Loader from "../components/Other/Loader.jsx";
import {toast} from "react-toastify";
import {BASE_API_URL} from "../config/variable.jsx";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const setAuth = (data) => {
        setAccessToken(data.access_token);
        setIsAuthenticated(true);
        setUser(data.user);
    }

    // Fungsi login
    const login = async (username, password) => {
        try {
            const response = await fetch(`${BASE_API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success)
            {
                setAuth(data.data)
            }

            return data;
        } catch (error) {
            console.error('Login failed', error);
            setIsAuthenticated(false);
        }
    };

    // Fungsi logout
    const logout = async () => {
        const response = await fetch(`${BASE_API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (data.success)
        {
            setUser(null);
            setAccessToken(null);
            setIsAuthenticated(false);
        }

        return data;
    };

    // Fungsi refresh token
    const refreshAccessToken = async () => {
        try {
            const response = await fetch(`${BASE_API_URL}/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            });
            const data = await response.json();

            if (data.success)
            {
                setAuth(data.data)
            }
        } catch (error) {
            console.error('Refresh token failed', error);
            setIsAuthenticated(false);
        }
    };

    // Fungsi untuk cek token saat browser reload
    const checkTokenOnReload = async () => {
        if (!accessToken) {
            await refreshAccessToken();
        }
        setLoading(false);
    };

    useEffect(() => {
        checkTokenOnReload();
    }, []);

    const value = {
        accessToken,
        isAuthenticated,
        user,
        login,
        logout,
        refreshAccessToken,
        setAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <Loader/> : children}
        </AuthContext.Provider>
    );
};
