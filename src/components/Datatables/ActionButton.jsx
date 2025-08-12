import {Link} from "react-router-dom";
import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faEye, faTrash} from "@fortawesome/free-solid-svg-icons";

export default function ActionButton({actions, item})
{
    return (
        <>
            {actions && actions.actions.length > 0 && (
                <td className="p-3 text-center text-sm">
                    {actions.actions.includes('view') && (
                        <Link
                            className="text-blue-500 hover:underline py-2 md:py-0 px-2"
                            to={actions.onView(item)}
                            title={`Lihat Data`}
                        >
                            <FontAwesomeIcon icon={faEye}/>
                        </Link>
                    )}
                    {actions.actions.includes('edit') && (
                        <button
                            title={`Edit Data`}
                            className="text-yellow-500 hover:underline py-2 md:py-0 px-2"
                            onClick={() => actions.onEdit(item)}>
                            <FontAwesomeIcon icon={faEdit}/>
                        </button>
                    )}
                    {actions.actions.includes('delete') && (
                        <button
                            title={`Hapus Data`}
                            className="text-red-500 hover:underline py-2 md:py-0 px-2"
                            onClick={() => actions.onDelete(item)}>
                            <FontAwesomeIcon icon={faTrash}/>
                        </button>
                    )}
                </td>
            )}
        </>
    )
}