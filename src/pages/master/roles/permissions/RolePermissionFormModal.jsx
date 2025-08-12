import React, {useEffect, useState} from "react";
import Modal from "../../../../components/Modal/Index.jsx";
import {useAuth} from "../../../../context/AuthProvider.jsx";
import {get} from "../../../../api/kegiatan.uinsatu.jsx";
import {toast} from "react-toastify";
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';

function EventParticipantFormModal({ show, handleClose, handleSubmit, role}) {
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [options, setOptions] = useState([]);

    const fetchOptions = async () => {
        setLoading(true)
        try {
            const result = await get(`/permissions?size=1000`, accessToken, {});

            if (result.success)
            {
                setOptions(result.data.data)
            }
            else
            {
                throw result.message
            }
        } catch (error) {
            toast.error(error)
        }
        finally {
            setLoading(false)
        }
    };

    const fetchPermissions = async () => {
        setLoading(true)
        try {
            const result = await get(`/roles/${role.id}/permissions?size=1000`, accessToken, {});

            if (result.success)
            {
                const data = result.data.data;
                const exist = data.map(opt => opt.id)
                setSelectedRows(exist);
            }
            else
            {
                throw result.message
            }
        } catch (error) {
            toast.error(error)
        }
        finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchOptions();
        fetchPermissions();
    }, []);

    const onSubmit = async () => {
        setLoading(true)
        const result = await handleSubmit(selectedRows);
        result && handleClose();
        setLoading(false)
    };

    return (
        <Modal
            show={show}
            title={`Tambah Perizinan Peran`}
            onClose={handleClose}
            onSubmit={onSubmit}
            loading={loading}
            size="lg"
        >
            <form onSubmit={onSubmit}>
                <DualListBox
                    options={options}
                    selected={selectedRows}
                    onChange={(newValue) => setSelectedRows(newValue)}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    canFilter
                    preserveSelectOrder
                />
            </form>
        </Modal>
    )
}

export default EventParticipantFormModal