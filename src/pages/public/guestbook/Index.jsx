import React, {useEffect, useState} from "react";
import {faIdCard} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {toast} from 'react-toastify';
import axios from "axios";
import {BASE_API_URL} from "/src/config/variable.jsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import Spinner from "../../../components/Other/Spinner.jsx";

export default function Index()
{
    const [searchParams] = useSearchParams();
    const unit_id = searchParams.get("unit_id");

    const initialFormData = {
        type_id:'',
        unit_id: unit_id||'',
        unit_position_id: '',
        name: '',
        email:'',
        hp: '',
        address: '',
        needs: '',
        satisfaction: '',
        suggestion: '',
        captcha_number:''
    }

    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialFormData);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [positions, setPositions] = useState([]);
    const [types, setTypes] = useState([]);
    const [units, setUnits] = useState([]);
    const [code, setCode] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const fetchSecurityCode = async () => {
        setLoadingSubmit(true)
        try {
            const response = await axios.get(`${BASE_API_URL}/common/guest-books/get-security-code`);

            const result = response.data;

            if (result.success) {
                setCode(result.data)
            } else {
                throw result.message
            }
        } catch (error) {
            toast.error(error)
        } finally {
            setLoadingSubmit(false)
        }
    }

    const fetchUnits = async () => {
        setLoadingSubmit(true)
        try {
            const response = await axios.get(`${BASE_API_URL}/common/units?size=50&sortBy=id&sortOrder=asc`);

            const result = response.data;

            if (result.success) {
                setUnits(result.data.data)
            } else {
                throw result.message
            }
        } catch (error) {
            toast.error(error)
        } finally {
            setLoadingSubmit(false)
        }
    }

    const fetchPosition = async (unitId) => {
        setLoadingSubmit(true);
        try {
            const response = await axios.get(`${BASE_API_URL}/common/units/${unitId}/positions?size=50`);

            const result = response.data;

            if (result.success) {
                setPositions(result.data.data)
            } else {
                throw result.message
            }
        } catch (error) {
            toast.error(error)
        }finally {
            setLoadingSubmit(false)
        }
    }

    const fetchTypes = async () => {
        setLoadingSubmit(true);
        try {
            const response = await axios.get(`${BASE_API_URL}/common/guest-types?size=50`);

            const result = response.data;

            if (result.success) {
                setTypes(result.data.data)
            } else {
                throw result.message
            }
        } catch (error) {
            toast.error(error)
        }finally {
            setLoadingSubmit(false)
        }
    }

    useEffect(() => {
        if (formData.unit_id)
        {
            fetchPosition(formData.unit_id)
        }
        else
        {
            setPositions([])
        }
    }, [formData.unit_id]);

    useEffect(() => {
        if (unit_id && units.length > 0) {
            const foundUnit = units.find((unit) => unit.id === parseInt(unit_id));
            setSelectedUnit(foundUnit || null);
        }
    }, [unit_id, units]);

    useEffect(() => {
        fetchTypes();
        fetchUnits();
        fetchSecurityCode()
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true)
        try {
            const response = await axios.post(`${BASE_API_URL}/common/guest-books`, formData);

            const result = response.data;

            if (result.success)
            {
                toast.success(result.message);
                await fetchSecurityCode();
                navigate("/common/guest-books/success");
                return;
            }
            else
            {
                throw result.message
            }
        }
        catch (err)
        {
            fetchSecurityCode();
            toast.error(err)
            return;
        }
        finally {
            setLoadingSubmit(false)
        }
    };

    return (
        <>
            {/* Login Header Text */}
            <div
                className="hidden md:block font-medium self-center text-xl sm:text-3xl text-gray-800 text-center"
            >
                Form Kunjungan Tamu
            </div>

            <div className="relative mt-6 h-px bg-gray-300">
                <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                                  <span className="bg-white px-4 text-xs text-gray-500 uppercase">
                                    {selectedUnit ? selectedUnit.unit : "UIN SATU Tulungagung"}
                                  </span>
                </div>
            </div>

            <div className="md:hidden block text-center my-4">
                <h1 className="text-2xl font-semibold text-slate-500">Form Kunjungan Tamu</h1>
            </div>

            {/* Login Form */}
            <div className="md:mt-6 mt-4">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col mb-3">
                        <label className="text-gray-700 mb-2">Jenis Tamu</label>
                        <div className="relative">
                            <div
                                className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <FontAwesomeIcon icon={faIdCard}/>
                            </div>

                            <select
                                name="type_id"
                                value={formData.type_id}
                                onChange={handleChange}
                                className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                                required
                                disabled={loadingSubmit}
                            >
                                <option value="">Pilih salah satu</option>
                                {types.map(t => (
                                    <option key={t.id} value={t.id}>{t.type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col mb-3">
                        <label className="text-gray-700 mb-2">Nama Pengunjung</label>
                        <div className="relative">
                            <div
                                className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <FontAwesomeIcon icon={faIdCard}/>
                            </div>

                            <input
                                required
                                type="text"
                                placeholder="Nama Pengunjung"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col mb-3">
                        <label className="text-gray-700 mb-2">Email Pengunjung</label>
                        <div className="relative">
                            <div
                                className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <FontAwesomeIcon icon={faIdCard}/>
                            </div>

                            <input
                                required
                                type="email"
                                placeholder="Email Pengunjung"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col mb-3">
                        <label className="text-gray-700 mb-2">Handphone Pengunjung</label>
                        <div className="relative">
                            <div
                                className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <FontAwesomeIcon icon={faIdCard}/>
                            </div>

                            <input
                                required
                                type="number"
                                placeholder="Handphone Pengunjung"
                                name="hp"
                                value={formData.hp}
                                onChange={handleChange}
                                className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col mb-3">
                        <label className="text-gray-700 mb-2">Alamat / Asal Instansi</label>
                        <div className="relative">
                            <div
                                className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <FontAwesomeIcon icon={faIdCard}/>
                            </div>

                            <input
                                required
                                type="text"
                                placeholder="Alamat / Asal Instansi"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                    </div>

                    {!formData.unit_id &&
                        <div className="flex flex-col mb-3">
                            <label className="text-gray-700 mb-2">Unit Tujuan</label>
                            <div className="relative">
                                <div
                                    className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                    <FontAwesomeIcon icon={faIdCard}/>
                                </div>

                                <select
                                    name="unit_id"
                                    value={formData.unit_id}
                                    onChange={handleChange}
                                    className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                                    required
                                    disabled={loadingSubmit}
                                >
                                    <option value="">Pilih salah satu</option>
                                    {units.map(unit => (
                                        <option key={unit.id} value={unit.id}>{unit.unit}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    }

                    <div className="flex flex-col mb-3">
                        <label className="text-gray-700 mb-2">Jabatan Tujuan</label>
                        <div className="relative">
                            <div
                                className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <FontAwesomeIcon icon={faIdCard}/>
                            </div>

                            <select
                                name="unit_position_id"
                                value={formData.unit_position_id}
                                onChange={handleChange}
                                className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                                required
                                disabled={loadingSubmit}
                            >
                                <option value="">Pilih salah satu</option>
                                {positions.map(p => (
                                    <option key={p.id} value={p.pivot.id}>{p.position}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col mb-3">
                        <label className="text-gray-700 mb-2">Keperluan</label>
                        <div className="relative">
                            <div
                                className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <FontAwesomeIcon icon={faIdCard}/>
                            </div>

                            <input
                                required
                                type="text"
                                placeholder="Keperluan"
                                name="needs"
                                value={formData.needs}
                                onChange={handleChange}
                                className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                    </div>

                    {/*<div className="flex flex-col mb-3">*/}
                    {/*    <label className="text-gray-700 mb-2">Apakah Anda Puas Dengan Pelayanan Tamu di*/}
                    {/*        UIN*/}
                    {/*        SATU</label>*/}
                    {/*    <div className="relative">*/}
                    {/*        <div*/}
                    {/*            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">*/}
                    {/*            <FontAwesomeIcon icon={faIdCard}/>*/}
                    {/*        </div>*/}

                    {/*        <select*/}
                    {/*            name="satisfaction"*/}
                    {/*            value={formData.satisfaction}*/}
                    {/*            onChange={handleChange}*/}
                    {/*            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"*/}
                    {/*            required*/}
                    {/*        >*/}
                    {/*            <option value="">Pilih salah satu</option>*/}
                    {/*            <option value="1">Puas</option>*/}
                    {/*            <option value="0">Tidak</option>*/}
                    {/*        </select>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*<div className="flex flex-col mb-3">*/}
                    {/*    <label className="text-gray-700 mb-2">Saran Perbaikan Atas Pelayanan*/}
                    {/*        Tamu</label>*/}
                    {/*    <div className="relative">*/}
                    {/*        <div*/}
                    {/*            className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">*/}
                    {/*            <FontAwesomeIcon icon={faIdCard}/>*/}
                    {/*        </div>*/}

                    {/*        <input*/}
                    {/*            required*/}
                    {/*            type="text"*/}
                    {/*            placeholder="Saran Perbaikan"*/}
                    {/*            name="suggestion"*/}
                    {/*            value={formData.suggestion}*/}
                    {/*            onChange={handleChange}*/}
                    {/*            className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    <div className="flex flex-col mb-5">
                        <label
                            className="text-gray-700 mb-2">{code && `${code.a_number} + ${code.b_number}`}</label>
                        <div className="relative">
                            <div
                                className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <FontAwesomeIcon icon={faIdCard}/>
                            </div>

                            <input
                                required
                                type="number"
                                placeholder="Masukkan hasil penjumlahan"
                                name="captcha_number"
                                value={formData.captcha_number}
                                onChange={handleChange}
                                className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col mb-3">
                        <button
                            disabled={loadingSubmit}
                            type={loadingSubmit ? 'button':'submit'}
                            className="bg-emerald-600 hover:bg-emerald-700 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm"
                        >
                            {loadingSubmit ? 'Menyimpan...':'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
