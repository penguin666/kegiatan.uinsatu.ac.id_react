import {
    faBookOpen,
    faCalendarCheck, faDatabase,
    faHandshake,
    faHome, faUser, faUsers
} from "@fortawesome/free-solid-svg-icons";

const initMenu = [
    {
        label: "Beranda",
        path: "/",
        icon: faHome
    },
    {
        label: "Rapat",
        path: "/meetings",
        icon: faHandshake,
    },
    {
        label: "Kegiatan",
        path: "/events",
        icon: faCalendarCheck,
    },
    {
        label: "Buku Tamu",
        path: "/guest-books",
        icon: faBookOpen,
        permission:'create guestbook'
    },
    {
        label: "Pengguna",
        path: "/users",
        icon: faUsers,
        permission:'create users'
    },
    {
        label: "Master Data",
        path: "/master",
        icon: faDatabase,
        permission:'view master'
    },
    {
        label: "Profil",
        path: "/profile",
        icon: faUser,
    }
];

export default initMenu