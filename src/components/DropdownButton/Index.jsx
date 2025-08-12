import React, { useState, useEffect } from 'react';
import {faAngleDown, faAngleUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { motion } from 'framer-motion';

export default function DropdownButton({ buttonLabel = "Actions", options = [], onOptionSelect }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const closeDropdown = (event) => {
        if (!event.target.closest('#dropdownButton')) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', closeDropdown);
        return () => document.removeEventListener('click', closeDropdown);
    }, []);

    return (
        <div className="relative inline-block text-left" id="dropdownButton">
            {/* Tombol utama */}
            <button onClick={toggleDropdown} className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-500">
                {buttonLabel}
                {isOpen ?
                    <FontAwesomeIcon icon={faAngleUp} className="w-5 h-5 ml-2 -mr-1"/>
                    :
                    <FontAwesomeIcon icon={faAngleDown} className="w-5 h-5 ml-2 -mr-1"/>
                }
            </button>

            {/* Menu dropdown */}
            {isOpen && (
                <motion.div
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    transition={{duration: 0.2}}
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    onOptionSelect(option);
                                    setIsOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
