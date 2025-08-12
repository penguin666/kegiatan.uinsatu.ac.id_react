import React from "react";
import {useOutletContext} from "react-router-dom";
import '/src/assets/css/ckEditor.css'

function MeetingShow() {
    const [meeting] = useOutletContext();

    return (
        <>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden min-h-40">
                <div className="bg-teal-700 px-4 py-3 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Hasil Rapat</h3>
                </div>
                <div className="mb-10 px-4 prose max-w-full">
                    <div dangerouslySetInnerHTML={{__html: meeting.description}}/>
                </div>
            </div>
        </>
    )
}

export default MeetingShow