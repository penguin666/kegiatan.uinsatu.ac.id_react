import React, {useEffect, useState} from 'react'
import { Scanner } from '@yudiel/react-qr-scanner';
import {post} from "/src/api/kegiatan.uinsatu.jsx";
import {useAuth} from "/src/context/AuthProvider.jsx";
import {toast} from "react-toastify";

export default function EventQrScanner({isOpen, setIsOpen}){
    const {accessToken} = useAuth();
    const [code, setCode] = useState();
    const handleScan = (result) => {
        setCode(result[0].rawValue);
    }

    const submitQrCode = async () =>
    {
        try {
            const result = await post('/followed-events/sessions/assign', accessToken, {code});

            if (result.success)
            {
                toast.success(result.message)
                return;
            }

            throw result.message
        }
        catch (err)
        {
            toast.error(err)
        }
        finally
        {
            setIsOpen(!isOpen);
            setCode('');
        }
    }

    useEffect(() => {
        if (code)
        {
            submitQrCode();
        }
    }, [code]);

    return(
        <div className="flex items-center justify-center">
            <div className="w-full md:max-w-md text-center px-4">
                <Scanner
                    onScan={handleScan}
                    className="w-full"
                    onError={(error) => console.log(error)}
                />
            </div>
        </div>
    )
}