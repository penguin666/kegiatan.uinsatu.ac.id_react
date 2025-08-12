import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Index() {
    const [isOpen, setIsOpen] = useState(false);

    // Fungsi untuk membuka atau menutup sub button
    const toggleButtons = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed bottom-10 right-8 flex flex-col items-end space-y-2 z-30">
            {/* Sub button muncul ketika tombol utama dibuka */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.button
                            className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600"
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 10}}
                            onClick={() => alert('Action 1 clicked!')}
                        >
                            Action 1
                        </motion.button>

                        <motion.button
                            className="bg-yellow-500 text-white p-3 rounded-full shadow-lg hover:bg-yellow-600"
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 10}}
                            onClick={() => alert('Action 2 clicked!')}
                        >
                            Action 2
                        </motion.button>

                        <motion.button
                            className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600"
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 10}}
                            onClick={() => alert('Action 3 clicked!')}
                        >
                            Action 3
                        </motion.button>
                    </>
                )}
            </AnimatePresence>

            {/* Tombol utama untuk membuka/menutup sub button */}
            <button className="w-12 h-12 bg-emerald-400 text-white rounded-full shadow-lg hover:bg-emerald-500 focus:outline-none" onClick={toggleButtons}>
                +
            </button>
        </div>
    );
}