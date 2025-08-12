import React, {useEffect, useState} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import {sidebarToggle} from "./../../utils/toggler.js";
import BottomNavbar from "../BottomNavbar/Index";
import {useAuth} from "../../context/AuthProvider.jsx";

function AuthLayout({...props}) {
    const isDesktop = () => document.body.clientWidth > 768;
    const [sidebarStatus, setSidebarStatus] = useState("");

    const { isAuthenticated, accessToken } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        sessionStorage.setItem('lastPath', location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        if (isAuthenticated) {
            let lastPath = sessionStorage.getItem('lastPath');
            navigate(lastPath);
        } else {
            // navigate('/auth/login');
            window.location.replace('https://sso.uinsatu.ac.id');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        window.addEventListener("resize", () => {
            setSidebarStatus(isDesktop());
        });
        return () => window.removeEventListener("resize", isDesktop);
    }, []);

    return (
        <div className="adminLayout">
            {/* Sidebar */}
            <Sidebar
                toggle={sidebarToggle}
                className={sidebarStatus ? "" : "mobile"}
            />

            {/* Main Wrapper */}
            <div className="mainWrapper">
                <Outlet context={[sidebarToggle]}/>
            </div>

            {/* Bottom Navigation */}
            <BottomNavbar/>
        </div>
    );
}

export default AuthLayout;
