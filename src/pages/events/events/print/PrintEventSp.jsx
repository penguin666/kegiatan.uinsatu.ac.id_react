import '/src/assets/css/print.css'
import moment from "moment";
import {setMomentLocaleID} from '/src/config/locale.jsx'
import React, {useEffect, useState} from "react";
import {QRCodeSVG} from "qrcode.react";

export default function PrintEventSp({event, profile, no}) {
    setMomentLocaleID();
    const [position, setPosition] = useState(null);
    const [functional, setFunctional] = useState(null);

    useEffect(() => {
        if (profile && profile.positions) {
            const positionNow = profile.positions.filter(item => item.endYear === 0);
            setPosition(positionNow[0])
        }
        if (profile.functionals && profile.functionals.length > 0) {
            const sortedFunctionals = profile.functionals.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
            setFunctional(sortedFunctionals[0]);
        }
    }, [profile]);

    return (
        <>
            <div className="card mb-3">
                <div className="flex justify-end m-4">
                    <span className="text-sm text-slate-500">{no}</span>
                </div>
                <div className="card-body">
                    <h2 className="text-center font-bold"><u>SURAT PERNYATAAN</u></h2>

                    <div className="p-5">
                        <p>Yang bertanda tangan di bawah ini, saya:</p>

                        <table style={{width: '100%'}}>
                            <tbody>
                            <tr>
                                <td style={{width: '30%'}}>Nama Lengkap</td>
                                <td style={{width: '2%'}}>:</td>
                                <td>{profile?.profile?.fullName}</td>
                            </tr>
                            <tr>
                                <td>Tempat, tanggal lahir</td>
                                <td>:</td>
                                <td>{`${profile?.profile?.placeOfBirth}, ${moment(profile?.profile?.dateOfBirth).format('D MMMM Y')}`}</td>
                            </tr>
                            <tr>
                                <td>NIP</td>
                                <td>:</td>
                                <td>{profile?.profile?.username}</td>
                            </tr>
                            <tr>
                                <td>Jenis Kelamin</td>
                                <td>:</td>
                                <td>{profile?.profile?.gender === 'm' ? 'Laki-laki' : 'Perempuan'}</td>
                            </tr>
                            <tr>
                                <td>Nama Instansi</td>
                                <td>:</td>
                                <td>UIN Sayyid Ali Rahmatullah Tulungagung</td>
                            </tr>
                            <tr>
                                <td>Jabatan Sekarang</td>
                                <td>:</td>
                                <td>{position ? position.AdditionalPositionName : functional?.FunctionalPositionName}</td>
                            </tr>
                            </tbody>
                        </table>

                        <p style={{textAlign: 'justify'}}>Dengan ini menyatakan dengan sesungguhnya bahwa saya bersedia
                            menjadi
                            peserta {event.name} pada tanggal {moment(event.event_start_date).format('D MMMM Y')} sampai
                            dengan {moment(event.event_end_date).format('D MMMM Y')} di {event.event_place}. Sebagai
                            peserta, saya akan bersungguh-sungguh mengikuti kegiatan tersebut sampai selesai.</p>
                        <p style={{textAlign: 'justify'}}>Jika kemudian hari pernyataan saya terbukti tidak benar atau
                            melanggar komitmen saya ini,
                            maka saya bersedia dituntut secara hukum termasuk mengembalikan uang negara yang telah saya
                            terima berikut denda dan/atau lainnya.</p>
                        <p style={{textAlign: 'justify'}}>Demikian surat pernyataan ini saya buat dengan sadar dan tidak
                            dalam tekanan pihak mana
                            pun.</p>

                        <div style={{margin: '25pt 0 0 50%'}}>
                            <span>{event.city_signature}, {moment(event.event_start_date).format('D MMMM Y')}<br/>Peserta,</span>
                            <div className={''}>
                                <QRCodeSVG
                                    value={`${window.location.origin}/common/events/${event?.code}/participants/${profile?.profile?.username}/types/2`}
                                    className="w-20"
                                />
                            </div>
                            <span>{profile?.profile?.fullName}</span>
                            <br/>
                            <span>NIP {profile?.profile?.username}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pagebreak"></div>
        </>
    )
}