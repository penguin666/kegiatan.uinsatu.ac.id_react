import '/src/assets/css/print.css'
import moment from "moment";
import SimakProfile from "/src/components/Other/SimakProfile.jsx";
import {QRCodeSVG} from "qrcode.react";
import React from "react";

export default function EventPrintCv({event, profile, no}) {
    return (
        <>
            <div className="card mb-3">
                <div className="flex justify-end m-4">
                    <span className="text-sm text-slate-500">{no}</span>
                </div>
                <div className="card-body">
                    <h2 className="text-center font-bold">BIODATA PESERTA</h2>
                    <p className="text-center">
                        <strong>
                            {event.name} <br/>
                            {moment(event.event_start_date).format('D MMMM Y')} s.d. {moment(event.event_end_date).format('D MMMM Y')}
                        </strong>
                    </p>
                    <div className="p-5">
                        <SimakProfile data={profile}/>

                        <div style={{margin: '25pt 0 0 50%'}}>
                            <span>{event.city_signature}, {moment(event.event_start_date).format('D MMMM Y')}<br/>Peserta,</span>
                            <div className={''}>
                                <QRCodeSVG
                                    value={`${window.location.origin}/common/events/${event?.code}/participants/${profile?.profile?.username}/types/1`}
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