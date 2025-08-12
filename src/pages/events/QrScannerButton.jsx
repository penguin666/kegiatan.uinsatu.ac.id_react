import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQrcode, faTimes} from "@fortawesome/free-solid-svg-icons";
import EventQrScanner from "./EventQrScanner.jsx";

export default function QrScannerButton() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            {/* Button to open drawer */}

            <button
                title="Scan QR Code Kegiatan"
                className="fixed bottom-20 right-6 md:bottom-10 md:right-10 z-30 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-500 focus:outline-none w-14 h-14 md:w-16 md:h-16"
                onClick={toggleDrawer}
            >
                <FontAwesomeIcon icon={faQrcode}/>
            </button>

            {/* Drawer */}
            <div
                className={`fixed bottom-0 left-0 w-full bg-white shadow-lg transform rounded-lg
                    ${isOpen ? "translate-y-0" : "translate-y-full"} 
                    transition-transform duration-300 ease-in-out z-20 md:z-50`
                }
                style={{height: "80vh"}}
            >
                {/* Drawer Header */}
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-lg font-bold">Scan QR Code Kegiatan</h2>
                    <button
                        className="text-gray-600 hover:text-gray-900"
                        onClick={toggleDrawer}
                    >
                        <FontAwesomeIcon icon={faTimes}/>
                    </button>
                </div>

                {/* Drawer Content */}
                <div className="p-4">
                    {isOpen && <EventQrScanner isOpen={isOpen} setIsOpen={setIsOpen}/>}
                </div>
            </div>

            {/* Background overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 md:z-40"
                    onClick={toggleDrawer}
                />
            )}
        </div>
    );
}