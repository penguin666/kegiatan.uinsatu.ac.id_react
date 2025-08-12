import React, {useEffect, useRef, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {post} from "../../../api/kegiatan.uinsatu.jsx";
import {toast} from "react-toastify";
import {useAuth} from "../../../context/AuthProvider.jsx";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import '/src/assets/css/ckEditor.css'

function MeetingShow() {
    const [meeting, refreshData] = useOutletContext();
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const toolbarRef = useRef(null);
    const [editorData, setEditorData] = useState(meeting.description);
    const [ isMounted, setMounted ] = useState( false );

    useEffect( () => {
        setMounted( true );

        return () => {
            setMounted( false );
        };
    }, [] );

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const result = await post(`/my-meetings/${meeting.id}`, accessToken, {description:editorData});

            if (result.success)
            {
                refreshData()
                toast.success(result.message)
                return;
            }

            throw result.message;
        }
        catch (err)
        {
            toast.error(err)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden min-h-40">
                <div className="bg-teal-700 px-4 py-3 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Hasil Rapat</h3>
                </div>
                <div className="mb-3 prose max-w-full">
                    <div ref={toolbarRef} style={{position:'sticky', top:'0'}}></div>

                    {isMounted && (
                        <CKEditor
                            editor={DecoupledEditor}
                            data={editorData}
                            onReady={editor => {
                                // Attach the toolbar to the specified container.
                                if (toolbarRef.current) {
                                    toolbarRef.current.appendChild(editor.ui.view.toolbar.element);
                                }
                                console.log('Editor is ready!', editor);
                            }}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setEditorData(data);
                            }}
                            onBlur={(event, editor) => {
                                console.log('Blur.', editor);
                            }}
                            onFocus={(event, editor) => {
                                console.log('Focus.', editor);
                            }}
                        />
                    )}
                </div>

                <div className="flex w-full mb-5 p-3">
                    <button
                        disabled={loading}
                        type="submit"
                        onClick={handleSubmit}
                        className="flex items-center justify-center focus:outline-none text-white text-sm bg-emerald-600 hover:bg-emerald-700 rounded-lg md:rounded md:py-2 py-3 w-full transition duration-150 ease-in"
                    >
                          <span className="mr-2">
                            {loading ? "Menyimpan..." : "Simpan Hasil Rapat"}
                          </span>
                    </button>
                </div>
            </div>
        </>
    )
}

export default MeetingShow