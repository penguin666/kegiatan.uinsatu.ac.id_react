import moment from "moment";

function EventShow({event}) {
    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-teal-700 px-4 py-3 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Detail Kegiatan</h3>
            </div>

            <div className="px-4 pb-5">
                <div className="flex flex-col border-b pb-2 mt-3">
                    <span className="text-gray-500 text-sm">Kode Kegiatan</span>
                    <h4 className="text-gray-700"><strong>{event.code}</strong></h4>
                </div>
                <div className="flex flex-col border-b pb-2 mt-3">
                    <span className="text-gray-500 text-sm">Nama Kegiatan</span>
                    <h4 className="text-gray-700"><strong>{event.name}</strong></h4>
                </div>
                <div className="flex flex-col border-b pb-2 mt-3">
                    <span className="text-gray-500 text-sm">Tanggal Pelaksanaan</span>
                    <h4 className="text-gray-700">
                        <strong>
                            {moment(event.event_start_date).format('D MMMM Y')} s.d. {moment(event.event_end_date).format('D MMMM Y')}
                        </strong>
                    </h4>
                </div>
                <div className="flex flex-col border-b pb-2 mt-3">
                    <span className="text-gray-500 text-sm">Tempat Kegiatan</span>
                    <h4 className="text-gray-700"><strong>{event.event_place}</strong></h4>
                </div>
                <div className="flex flex-col border-b pb-2 mt-3">
                    <span className="text-gray-500 text-sm">Deskripsi Kegiatan</span>
                    <h4 className="text-gray-700"><strong>{event.description}</strong></h4>
                </div>
                <div className="flex flex-col border-b pb-2 mt-3">
                    <span className="text-gray-500 text-sm">Penanggung Jawab</span>
                    <h4 className="text-gray-700"><strong>{event.signer_name}</strong></h4>
                </div>
                <div className="flex flex-col border-b pb-2 mt-3">
                    <span className="text-gray-500 text-sm">Kota Tanda Tangan</span>
                    <h4 className="text-gray-700"><strong>{event.city_signature}</strong></h4>
                </div>
                <div className="flex flex-col border-b pb-2 mt-3">
                    <span className="text-gray-500 text-sm">Tanggal Konfirmasi</span>
                    <h4 className="text-gray-700">
                        <strong>
                            {moment(event.confirm_start_date).format('D MMMM Y')} s.d. {moment(event.confirm_end_date).format('D MMMM Y')}
                        </strong>
                    </h4>
                </div>
            </div>
        </div>
    )
}

export default EventShow