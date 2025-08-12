import '../../assets/css/print.css'
import moment from "moment";
import {useEffect, useState} from "react";

export default function SimakProfile({data})
{
    const [position, setPosition] = useState(null);
    const [functional, setFunctional] = useState(null);
    const [sortedPositions, setSortedPositions] = useState([]);
    const [sortedEducations, setSortedEducations] = useState([]);

    useEffect(() => {
        if (data.positions && data.positions.length > 0) {
            const sortedData = data.positions.sort((a, b) => a.startYear - b.startYear);
            setSortedPositions(sortedData);

            const positionNow = data.positions.filter(item => item.endYear === 0);
            setPosition(positionNow[0])
        }

        if (data.functionals && data.functionals.length > 0) {
            const sortedFunctionals = data.functionals.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
            setFunctional(sortedFunctionals[0]);
        }

        if (data.educations && data.educations.length > 0) {
            const sortedEducations = data.educations.sort((a, b) => a.graduationYear - b.graduationYear);
            setSortedEducations(sortedEducations);
        }
    }, [data]);

    return (
        <table style={{width: '100%'}}>
            <tbody>
            <tr>
                <td style={{width: '30%'}}>Nama Lengkap</td>
                <td style={{width: '2%'}}>:</td>
                <td>{data.profile?.fullName}</td>
            </tr>
            <tr>
                <td>Tempat, tanggal lahir</td>
                <td>:</td>
                <td>{`${data.profile?.placeOfBirth}, ${moment(data.profile?.dateOfBirth).format('D MMMM Y')}`}</td>
            </tr>
            <tr>
                <td>Status Kepegawaian</td>
                <td>:</td>
                <td>{data.profile?.employmentTypeName}</td>
            </tr>
            <tr>
                <td>Pangkat / Golongan Ruang</td>
                <td>:</td>
                <td>{data.rank?.rankName}</td>
            </tr>
            <tr>
                <td>Jabatan Sekarang</td>
                <td>:</td>
                <td>{position ? position.AdditionalPositionName: functional?.FunctionalPositionName}</td>
            </tr>
            <tr>
                <td>Instansi / Lembaga</td>
                <td>:</td>
                <td>UIN Sayyid Ali Rahmatullah Tulungagung</td>
            </tr>
            <tr>
                <td>Alamat</td>
                <td>:</td>
                <td>
                    Jalan {data.address?.street} Dusun {data.address?.dusun} RT {data.address?.RT} RW {data.address?.RW} Desa {data.address?.village} Kecamatan {data.address?.subdistrictName} Kabupaten {data.address?.cityName}
                </td>
            </tr>
            <tr>
                <td>Handphone</td>
                <td>:</td>
                <td>{data.address?.phoneNo}</td>
            </tr>
            <tr>
                <td>E-mail</td>
                <td>:</td>
                <td>{data.profile?.email}</td>
            </tr>
            <tr>
                <td>Riwayat Pendidikan</td>
                <td>:</td>
                <td>
                    <ol>
                        {sortedEducations.length > 0 && sortedEducations.map(edu => (
                            <li key={edu.ID}>{edu.educationalStageName} {edu.programName}  {edu.educationalInstitutionName} {edu.enrollmentYear && edu.enrollmentYear !== 0 ? `Tahun ${edu.enrollmentYear}`:''}</li>
                        ))}
                    </ol>
                </td>
            </tr>
            <tr>
                <td>Pengalaman Jabatan</td>
                <td>:</td>
                <td>
                    <ol>
                        {sortedPositions.length > 0 && sortedPositions.map(pos => (
                            <li key={pos.ID}>{`${pos.AdditionalPositionName} ${pos.SiakadFacultyName ? pos.SiakadFacultyName:''} ${pos.SiakadProgramName ? pos.SiakadProgramName:''}`} {`Tahun ${pos.startYear}`} {pos.endYear === 0 ? 's.d. Sekarang':`s.d. ${pos.endYear}`}</li>
                        ))}
                    </ol>
                </td>
            </tr>
            </tbody>
        </table>
    )
}