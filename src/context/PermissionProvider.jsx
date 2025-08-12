import React, { createContext, useState, useEffect, useContext } from 'react';
import {BASE_API_URL} from "../config/variable.jsx";
const PermissionsContext  = createContext();

export const usePermissions = () => {
    return useContext(PermissionsContext );
};

// Provider
export const PermissionsProvider = ({ children, userToken }) => {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                setLoading(true);

                const response = await fetch(`${BASE_API_URL}/permissions/get-user-permissions`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPermissions(data.data);
                } else {
                    console.error("Failed to fetch permissions");
                }
            } catch (error) {
                console.error("Error fetching permissions:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userToken) {
            fetchPermissions();
        }
    }, [userToken]);

    // Fungsi untuk mengecek apakah user memiliki permission tertentu
    const hasPermission = (permission) => {
        if (permissions.includes('is superadmin'))
        {
            return true;
        }
        else
        {
            return permissions.includes(permission)
        }
    };

    return (
        <PermissionsContext.Provider value={{ permissions, hasPermission, loading }}>
            {children}
        </PermissionsContext.Provider>
    );
};