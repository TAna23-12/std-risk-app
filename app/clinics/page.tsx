'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PanicButton from '@/components/panic-button';
import { 
  MapPin, Phone, Heart, ArrowLeft, Search, Navigation, 
  Sparkles, RotateCcw
} from 'lucide-react';

interface Clinic {
  clinic_id: string;
  name_th: string;
  region: string;
  province: string;
  latitude: number;
  longitude: number;
  services: any;
  contact_phone: string;
  is_lgbtq_friendly: boolean;
  distanceKm?: number;
}

// คำนวณระยะทาง Haversine Formula (กิโลเมตร)
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export default function ClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);

  // Filters State
  const [searchInput, setSearchInput] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedProvince, setSelectedProvince] = useState('ALL');
  const [selectedService, setSelectedService] = useState('ALL');
  const [filterLgbtqOnly, setFilterLgbtqOnly] = useState(false);

  // 1. ดึงข้อมูลจาก Supabase
  useEffect(() => {
    async function fetchClinics() {
      const { data, error } = await supabase.from('clinics_master').select('*');
      if (!error && data) {
        setClinics(data as Clinic[]);
      }
      setLoading(false);
    }
    fetchClinics();
  }, []);

  // 2. ขอพิกัด GPS อัตโนมัติ
  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert('เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง GPS');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocating(false);
      },
      (error) => {
        console.warn('Geolocation denied/failed:', error);
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActiveQuery(searchInput.trim());
    // ถ้าพิมพ์ค้นหา ให้ปลดล็อกจังหวัดเป็นทั้งหมด เพื่อไม่ให้เงื่อนไขขัดกัน
    if (searchInput.trim() !== '') {
      setSelectedProvince('ALL');
    }
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setActiveQuery('');
    setSelectedRegion('ALL');
    setSelectedProvince('ALL');
    setSelectedService('ALL');
    setFilterLgbtqOnly(false);
  };

  // รายชื่อภาค และจังหวัดที่มีในระบบ
  const regions = useMemo(() => {
    const set = new Set(clinics.map((c) => c.region).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [clinics]);

  const provinces = useMemo(() => {
    const filteredByReg = selectedRegion === 'ALL' 
      ? clinics 
      : clinics.filter((c) => c.region === selectedRegion);
    const set = new Set(filteredByReg.map((c) => c.province).filter(Boolean));
    return ['ALL', ...Array.from(set).sort()];
  }, [clinics, selectedRegion]);

  // กรองข้อมูลและจัดเรียงตามระยะทาง
  const processedClinics = useMemo(() => {
    let list = clinics.map((c) => {
      if (userLocation && c.latitude && c.longitude) {
        return {
          ...c,
          distanceKm: getDistanceFromLatLonInKm(
            userLocation.lat,
            userLocation.lng,
            c.latitude,
            c.longitude
          ),
        };
      }
      return c;
    });

    const query = activeQuery.toLowerCase();

    list = list.filter((c) => {
      // ค้นหาครอบคลุม: ชื่อคลินิก, จังหวัด, หรือภาค
      const matchSearch = !query || 
        c.name_th?.toLowerCase().includes(query) ||
        c.province?.toLowerCase().includes(query) ||
        c.region?.toLowerCase().includes(query);

      const matchRegion = selectedRegion === 'ALL' || c.region === selectedRegion;
      const matchProvince = selectedProvince === 'ALL' || c.province === selectedProvince;
      const matchLgbtq = filterLgbtqOnly ? c.is_lgbtq_friendly : true;

      // จัดการ Services รองรับทั้ง Array และ JSON
      let serviceList: string[] = [];
      if (Array.isArray(c.services)) {
        serviceList = c.services;
      } else if (typeof c.services === 'string') {
        serviceList = [c.services];
      }

      const matchService = selectedService === 'ALL' || 
        serviceList.some((s) => String(s).toLowerCase().includes(selectedService.toLowerCase()));

      return matchSearch && matchRegion && matchProvince && matchLgbtq && matchService;
    });

    // เรียงลำดับ: ถ้ามี GPS ให้เรียงจากใกล้ไปไกลที่สุด
    if (userLocation) {
      list.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
    }

    return list;
  }, [clinics, userLocation, activeQuery, selectedRegion, selectedProvince, selectedService, filterLgbtqOnly]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 pb-24">
      <PanicButton />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>หน้าแรก</span>
          </Link>
          <button
            type="button"
            onClick={requestLocation}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:border-indigo-400 px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-700 shadow-sm transition cursor-pointer"
          >
            <Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
            <span>{userLocation ? 'อัปเดตตำแหน่งใกล้คุณ' : 'กดอนุญาตเปิด GPS'}</span>
          </button>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            สถานพยาบาล & คลินิกนิรนามทั่วประเทศ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ค้นหาคลินิกตรวจคัดกรอง รับยา PrEP / PEP ฉุกเฉิน และบริการสุขภาพทางเพศที่ปลอดภัย
            {userLocation && ' (เรียงลำดับจากจุดที่ใกล้คุณที่สุด)'}
          </p>
        </div>

        {/* Filter Controls Card */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          
          {/* Search Box with Search Button */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="พิมพ์ชื่อคลินิก หรือจังหวัด เช่น ตาก, เชียงใหม่, ราชดำริ..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setActiveQuery(e.target.value.trim());
                  if (e.target.value.trim() !== '') setSelectedProvince('ALL');
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition shadow-sm cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>ค้นหา</span>
            </button>
          </form>

          {/* Region & Province Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                เลือกภาค
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setSelectedProvince('ALL');
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">ทุกภาคทั่วประเทศ</option>
                {regions.filter((r) => r !== 'ALL').map((r) => (
                  <option key={r} value={r}>ภาค{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                เลือกจังหวัด
              </label>
              <select
                value={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  if (e.target.value !== 'ALL') setSearchInput('');
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">ทุกจังหวัด</option>
                {provinces.filter((p) => p !== 'ALL').map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Badges Filter & Reset Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterLgbtqOnly(!filterLgbtqOnly)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  filterLgbtqOnly
                    ? 'bg-pink-50 text-pink-700 border-pink-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${filterLgbtqOnly ? 'fill-pink-500 text-pink-500' : ''}`} />
                <span>LGBTQ+ Safe</span>
              </button>

              {['ALL', 'PEP', 'PrEP', 'HIV', 'ซิฟิลิส', 'ตรวจ HIV ฟรี'].map((svc) => (
                <button
                  key={svc}
                  type="button"
                  onClick={() => setSelectedService(svc)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    selectedService === svc
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {svc === 'ALL' ? 'ทุกบริการ' : svc}
                </button>
              ))}
            </div>

            {(searchInput || activeQuery || selectedRegion !== 'ALL' || selectedProvince !== 'ALL' || selectedService !== 'ALL' || filterLgbtqOnly) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ล้างตัวกรองทั้งหมด</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
          <span>พบสถานพยาบาลทั้งหมด {processedClinics.length} แห่ง</span>
          {userLocation && (
            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              GPS Active: เรียงจากใกล้ที่สุด
            </span>
          )}
        </div>

        {/* Clinics List */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium">กำลังโหลดข้อมูลสถานพยาบาลทั่วประเทศ...</div>
        ) : processedClinics.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-500 space-y-3">
            <p className="font-bold text-slate-700">ไม่พบสถานพยาบาลตามเงื่อนไขที่ค้นหา</p>
            <p className="text-xs text-slate-400">ลองกดปุ่มด้านล่างเพื่อรีเซ็ตตัวกรองทั้งหมด</p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-xl text-xs font-bold transition hover:bg-indigo-100 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>รีเซ็ตการค้นหา</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {processedClinics.map((clinic, index) => {
              const servicesArray = Array.isArray(clinic.services) 
                ? clinic.services 
                : typeof clinic.services === 'string' ? [clinic.services] : [];

              return (
                <div
                  key={clinic.clinic_id}
                  className={`bg-white p-5 sm:p-6 rounded-3xl border shadow-sm space-y-4 hover:border-indigo-300 transition relative overflow-hidden ${
                    index === 0 && userLocation ? 'border-indigo-400 ring-1 ring-indigo-400/30' : 'border-slate-200'
                  }`}
                >
                  {/* Top Row: Clinic Name & Distance */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          {clinic.province} ({clinic.region})
                        </span>
                        {index === 0 && userLocation && (
                          <span className="text-[11px] font-extrabold bg-indigo-600 text-white px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> แนะนำ: ใกล้คุณที่สุด
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-indigo-600 shrink-0" />
                        <span>{clinic.name_th}</span>
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      {clinic.distanceKm !== undefined && (
                        <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-xl">
                          ห่าง {clinic.distanceKm} กม.
                        </span>
                      )}
                      {clinic.is_lgbtq_friendly && (
                        <span className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 border border-pink-200 text-xs px-3 py-1 rounded-full font-bold">
                          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                          LGBTQ+ Safe
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Services Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {servicesArray.map((srv: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Row: Phone & Maps Link */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span>โทร: {clinic.contact_phone || 'ไม่มีข้อมูล'}</span>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${clinic.latitude},${clinic.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      <span>นำทางด้วย Google Maps</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}