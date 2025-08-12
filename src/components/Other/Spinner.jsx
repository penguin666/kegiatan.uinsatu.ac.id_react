import React from 'react';

const Loader = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};

export default Loader;