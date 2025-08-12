import React, {useEffect, useRef, useState} from "react";
import {AnimatePresence, motion, useAnimate} from "framer-motion";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import '../../assets/css/scrollbarStyle.css'

export default function Modal({show, title, children, onClose, onSubmit, loading = false, size = "md", confirmButton="Simpan", bodyClass='p-4'})
{
    const sizeClasses = {
        xs: "max-w-sm",
        sm: "max-w-xl",
        md: "max-w-3xl",
        lg: "max-w-5xl",
        xl: "max-w-7xl",
        full: "max-w-full",
    };

    const [needsScrollbar, setNeedsScrollbar] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            // Cek apakah konten lebih tinggi dari tinggi maksimal (membutuhkan scrollbar)
            setNeedsScrollbar(contentRef.current.scrollHeight > contentRef.current.clientHeight);
        }
    }, [children, show]);

    const [scope, animate] = useAnimate();

    async function open() {
        await animate(scope.current, { scaleY:0.005 }, {duration:0.1});
        await animate(scope.current, { scaleX:1 }, {duration:0.2});
        await animate(scope.current, { scaleY:1 }, {duration:0.2});
    }

    async function openBody() {
        const target = scope.current.querySelector('.child-ref');

        await animate(target, { y: 0, opacity: 1 }, {duration:0.1});
    }

    async function close() {
        await animate(scope.current, { scaleY:0.005 }, {duration:0.2});
        await animate(scope.current, { scaleX:0 }, {duration:0.2});
        await animate(scope.current, { scaleY:0 }, {duration:0.1});
    }

    async function closeBody() {
        const target = scope.current.querySelector('.child-ref');
        await animate(target, { y: 50, opacity: 0 }, {duration:0.1});
    }

    const runOpen = async () =>
    {
        await open();
        await openBody()
    }

    const runClose = async () =>
    {
        await closeBody();
        await close();
    }

    useEffect(() => {
        if (show)
        {
            runOpen()
        }

        else
        {
            runClose()
        }
    }, [show]);

    return (
        <AnimatePresence>
            <motion.div
                ref={scope}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
                initial={{ scaleX:0, scaleY:0}}
            >
                <motion.div
                    className={`child-ref bg-white rounded-lg shadow-lg w-full mx-3 ${sizeClasses[size]}`}
                    initial={{ y: -50, opacity: 0 }}
                >
                    {/* Modal Header */}
                    <div className="flex justify-between items-center border-b pb-3 p-6">
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                            <FontAwesomeIcon icon={faTimes} className="h-6 w-6"/>
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div ref={contentRef}
                         className={`${bodyClass} overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-custom ${needsScrollbar && 'pr-4'}`}
                    >
                        {children}
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end space-x-2 p-4 border-t">
                        <button
                            onClick={onClose}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Tutup
                        </button>
                        <button
                            type="submit"
                            onClick={onSubmit}
                            disabled={loading}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            {loading ? 'Memproses…' : confirmButton}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}