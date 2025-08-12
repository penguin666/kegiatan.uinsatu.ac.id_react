import {Modal, Button} from "react-bootstrap";
import {useState} from "react";

function ConfirmDialog({show, title, handleClose, handleConfirmed}) {
    const [loading, setLoading] = useState(false);
    const onConfirmed = async () => {
        setLoading(true)
        await handleConfirmed();
        handleClose();
        setLoading(false)
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" size="sm" className="modal-blur">
            <Modal.Header closeButton>
                <Modal.Title>Konfirmasi</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {title}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                    Tidak
                </Button>
                <Button variant="primary" onClick={onConfirmed} disabled={loading}>
                    {loading ? 'Memproses…' : 'Ya'}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ConfirmDialog;