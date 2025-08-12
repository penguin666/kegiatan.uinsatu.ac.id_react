import React, {useEffect, useState} from "react";
import Modal from "/src/components/Modal/Index.jsx";
import {useAuth} from "/src/context/AuthProvider.jsx";
import {get} from "/src/api/kegiatan.uinsatu.jsx";
import {toast} from "react-toastify";
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';

function UnitPositionFormModal({ show, handleClose, handleSubmit, unit}) {
    const {accessToken} = useAuth();
    const [loading, setLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [options, setOptions] = useState([]);

    const fetchOptions = async () => {
        setLoading(true)
        try {
            const result = await get(`/positions?size=1000`, accessToken, {});

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

    const fetchPositions = async () => {
        setLoading(true)
        try {
            const result = await get(`/units/${unit.id}/positions?size=1000`, accessToken, {});

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
        fetchPositions();
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const result = await handleSubmit(selectedRows);
        result && handleClose();
        setLoading(false)
    };

    return (
        <Modal
            show={show}
            title={`Tambah Jabatan`}
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
                    getOptionLabel={(option) => option.position}
                    getOptionValue={(option) => option.id}
                    canFilter
                    preserveSelectOrder
                />
            </form>
        </Modal>
    )
}

export default UnitPositionFormModal