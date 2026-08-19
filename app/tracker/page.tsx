'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PanicButton from '@/components/panic-button';
import { 
  ArrowLeft, CheckCircle2, Pill, Clock, AlertTriangle, 
  PlusCircle, XCircle, ShieldAlert, Sparkles, Calendar as CalendarIcon, 
  RefreshCw, LogIn, ShieldCheck, Lock
} from 'lucide-react';

interface MedicationLog {
  log_id: string;
  medication_type: string;
  scheduled_time: string;
  taken_at: string | null;
  status: string;
  user_id?: string;
}

export default function TrackerPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tracker' | 'missed_dose_guide'>('tracker');

  const getTodayDate = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getCurrentTime = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [selectedTime, setSelectedTime] = useState<string>(getCurrentTime());
  const [selectedMed, setSelectedMed] = useState<'PREP_DAILY' | 'PREP_ON_DEMAND' | 'PEP'>('PREP_DAILY');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Missed Dose Assistant
  const [guideMedType, setGuideMedType] = useState<'PREP_DAILY' | 'PEP'>('PREP_DAILY');
  const [hoursLate, setHoursLate] = useState<number>(4);

  // ตรวจสอบสิทธิ์ผู้ใช้และดึงข้อมูลจาก Supabase
  async function checkUserAndFetchLogs() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);

    if (user) {
      const { data, error } = await supabase
        .from('medication_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_time', { ascending: false });

      if (!error && data) {
        setLogs(data as MedicationLog[]);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    checkUserAndFetchLogs();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user) {
        checkUserAndFetchLogs();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // ฟังก์ชันบันทึกยาลง Supabase Cloud
  const handleLogDose = async (status: 'TAKEN' | 'MISSED') => {
    if (!currentUser) return;
    setIsSubmitting(true);
    try {
      const targetDateTime = new Date(`${selectedDate}T${selectedTime}:00`);

      const newRecord = {
        user_id: currentUser.id,
        medication_type: selectedMed,
        scheduled_time: targetDateTime.toISOString(),
        taken_at: status === 'TAKEN' ? targetDateTime.toISOString() : null,
        status: status,
      };

      const { data, error } = await supabase
        .from('medication_logs')
        .insert([newRecord])
        .select();

      if (error) {
        alert('เกิดข้อผิดพลาด: ' + error.message);
      } else if (data && data.length > 0) {
        setLogs([data[0] as MedicationLog, ...logs]);
        alert(status === 'TAKEN' ? 'บันทึกว่าทานยาเรียบร้อยแล้ว' : 'บันทึกสถานะข้ามมื้อเรียบร้อย');
      }
    } catch (err: any) {
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };

  const takenCount = logs.filter((l) => l.status === 'TAKEN').length;
  const totalCount = logs.length;
  const adherenceRate = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 100;

  const formatDateLabel = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return 'ไม่ระบุเวลา';
      return d.toLocaleString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'ไม่ระบุเวลา';
    }
  };

  const getMissedDoseAdvice = () => {
    if (guideMedType === 'PREP_DAILY') {
      if (hoursLate <= 12) {
        return {
          title: 'ให้ทาน 1 เม็ดทันทีที่นึกได้',
          desc: 'เนื่องจากยังไม่เกิน 12 ชั่วโมง ให้ทานยาทันที และทานมื้อถัดไปตามเวลาเดิมตามปกติ',
          warning: 'ห้ามทานเพิ่มเป็น 2 เม็ดพร้อมกันเพื่อชดเชยมื้อที่ลืม',
          color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      } else {
        return {
          title: 'ให้ข้ามมื้อนี้ไป แล้วรอทานมื้อถัดไปในเวลาปกติ',
          desc: 'เนื่องจากใกล้ถึงรอบมื้อถัดไปแล้ว ให้ข้ามมื้อที่ลืมไปเลย เพื่อป้องกันปริมาณยาในกระแสเลือดสูงเกินไป',
          warning: 'หากลืมทานยาติดต่อกันเกิน 2 วัน ให้ใช้ถุงยางอนามัยร่วมด้วยอย่างน้อย 7 วัน',
          color: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      }
    } else {
      if (hoursLate <= 6) {
        return {
          title: 'ทานยา PEP ทันทีที่รู้ตัว และทานมื้อต่อไปตามเวลาเดิม',
          desc: 'การรักษาความต่อเนื่องของยา PEP ในคอร์ส 28 วันสำคัญมาก ให้รีบทานทันที',
          warning: 'ห้ามหยุดยาเองเด็ดขาด แม้จะรู้สึกว่าไม่มีอาการใดๆ',
          color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        };
      } else {
        return {
          title: 'ข้ามมื้อที่ลืม แล้วทานมื้อถัดไปในเวลาเดิม (อย่ากินเบิ้ล)',
          desc: 'ทานมื้อต่อไปตามปกติจนครบจำนวน 28 วัน หากลืมบ่อยควรปรึกษาแพทย์ประจำคลินิกทันที',
          warning: 'งดการมีเพศสัมพันธ์ที่ไม่ได้ป้องกันระหว่างการทานยา PEP',
          color: 'bg-rose-50 text-rose-800 border-rose-200',
        };
      }
    }
  };

  const advice = getMissedDoseAdvice();

  // กำลังโหลดสถานะ
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
          <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-500">กำลังตรวจสอบสิทธิ์การเข้าใช้งาน...</p>
        </div>
      </main>
    );
  }

  // กรณีผู้ใช้ยังไม่ได้ล็อกอิน -> แสดงการแจ้งเตือนพร้อมปุ่มไปล็อกอิน/สมัครสมาชิก
  if (!currentUser) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4">
        <PanicButton />

        <div className="max-w-md mx-auto space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับหน้าแรก</span>
          </Link>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-indigo-600 font-extrabold text-[11px] tracking-wider uppercase bg-indigo-50 px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>สงวนสิทธิ์เฉพาะสมาชิก</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                เข้าสู่ระบบเพื่อบันทึกยา
              </h1>
              <p className="text-xs text-slate-500 leading-relaxed">
                ระบบบันทึกและติดตามการทานยา (PrEP / PEP) เป็นฟังก์ชันข้อมูลส่วนบุคคล กรุณาเข้าสู่ระบบหรือสมัครสมาชิกก่อนใช้งาน เพื่อความปลอดภัยและการแจ้งเตือนที่ต่อเนื่อง
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/auth"
                className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-xs sm:text-sm shadow transition"
              >
                <LogIn className="w-4 h-4" />
                <span>เข้าสู่ระบบ / สมัครสมาชิก</span>
              </Link>
            </div>

            <p className="text-[11px] text-slate-400">
              * ข้อมูลการทานยาจะถูกเข้ารหัสและดูได้เฉพาะบัญชีของคุณเท่านั้น
            </p>
          </div>
        </div>
      </main>
    );
  }

  // กรณีล็อกอินแล้ว -> แสดงหน้าบันทึกยาตามปกติ (ไม่มีปุ่มโปรไฟล์ซ้ำซ้อนด้านล่าง)
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 pb-24">
      <PanicButton />

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับหน้าแรก</span>
          </Link>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            ระบบบันทึกและติดตามการทานยา
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            กำลังบันทึกข้อมูลส่วนบุคคลของ: <strong className="text-slate-700">{currentUser.email}</strong>
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('tracker')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'tracker'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>บันทึกการทานยา</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('missed_dose_guide')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'missed_dose_guide'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>คู่มือกรณีลืมทานยา (Missed-Dose)</span>
          </button>
        </div>

        {/* TAB 1: บันทึกการทานยา */}
        {activeTab === 'tracker' && (
          <div className="space-y-6">
            {/* Adherence Rate Banner */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  ความสม่ำเสมอในการทานยา (Adherence Rate)
                </span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                  สะสม {takenCount} / {totalCount} ครั้ง
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-slate-900">{adherenceRate}%</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {adherenceRate >= 90 ? 'ระดับการป้องกันสูง (>99%)' : 'ควรทานยาให้ตรงเวลาสม่ำเสมอ'}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${adherenceRate}%` }}
                />
              </div>
            </div>

            {/* Form บันทึกยา */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-indigo-600" />
                <span>ระบุข้อมูลการทานยา</span>
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  ประเภทยา
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'PREP_DAILY', label: 'Daily PrEP', sub: 'ทานประจำวัน' },
                    { key: 'PEP', label: 'PEP 28 วัน', sub: 'ยาต้านฉุกเฉิน' },
                    { key: 'PREP_ON_DEMAND', label: 'PrEP 2-1-1', sub: 'On Demand' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setSelectedMed(item.key as any)}
                      className={`p-3 rounded-2xl border text-center transition ${
                        selectedMed === item.key
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 ring-1 ring-indigo-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <p className="text-xs font-bold">{item.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>วันที่ทานยา</span>
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>เวลาที่ทาน</span>
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleLogDose('TAKEN')}
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm shadow transition disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'กำลังบันทึก...' : 'บันทึกว่า "ทานยาแล้ว"'}</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleLogDose('MISSED')}
                  className="w-full inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition disabled:opacity-50 cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>{isSubmitting ? 'กำลังบันทึก...' : 'บันทึกว่า "ลืมทาน/ข้ามมื้อ"'}</span>
                </button>
              </div>
            </div>

            {/* ประวัติรายการยา */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>ประวัติการบันทึกยาของคุณ (Cloud Sync)</span>
                </h2>
                <button
                  type="button"
                  onClick={checkUserAndFetchLogs}
                  className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>รีเฟรช</span>
                </button>
              </div>

              {loading ? (
                <p className="text-xs text-slate-400 text-center py-4">กำลังโหลดประวัติ...</p>
              ) : logs.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  ยังไม่มีประวัติการบันทึกยา
                </div>
              ) : (
                <div className="space-y-2.5">
                  {logs.map((log) => {
                    const isTaken = log.status === 'TAKEN';
                    return (
                      <div
                        key={log.log_id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 ${
                              isTaken ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            <Pill className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">
                              {log.medication_type === 'PREP_DAILY'
                                ? 'Daily PrEP (ทานประจำ)'
                                : log.medication_type === 'PEP'
                                ? 'PEP (ยาฉุกเฉิน)'
                                : 'PrEP on Demand (2-1-1)'}
                            </p>
                            <p className="text-slate-500 font-medium">
                              {formatDateLabel(log.scheduled_time || log.taken_at || '')}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`font-bold px-2.5 py-1 rounded-xl border shrink-0 ${
                            isTaken
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                              : 'text-rose-700 bg-rose-50 border-rose-200'
                          }`}
                        >
                          {isTaken ? 'ทานแล้ว' : 'ลืมทาน/ข้ามมื้อ'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Missed-Dose Assistant */}
        {activeTab === 'missed_dose_guide' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  ระบบช่วยประเมินเมื่อลืมทานยา (CDC Clinical Algorithm)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  เลือกประเภทยาและระยะเวลาที่เลยกำหนด ระบบจะแนะนำวิธีปฏิบัติที่ถูกต้องทันที
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  1. ยาที่คุณกำลังรับประทานอยู่
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'PREP_DAILY', label: 'PrEP ทานป้องกันประจำวัน' },
                    { key: 'PEP', label: 'PEP ยาต้านฉุกเฉิน 28 วัน' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setGuideMedType(item.key as any)}
                      className={`p-3.5 rounded-2xl border text-xs font-bold transition text-center ${
                        guideMedType === item.key
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    2. ลืมทานยาเลยเวลาเดิมมากี่ชั่วโมงแล้ว?
                  </label>
                  <span className="text-sm font-extrabold text-indigo-600">
                    {hoursLate} ชั่วโมง
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={hoursLate}
                  onChange={(e) => setHoursLate(parseInt(e.target.value) || 1)}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>1 ชม.</span>
                  <span>12 ชม.</span>
                  <span>24 ชม.</span>
                </div>
              </div>

              <div className={`p-5 rounded-2xl border ${advice.color} space-y-2`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <h3>{advice.title}</h3>
                </div>
                <p className="text-xs leading-relaxed opacity-90">{advice.desc}</p>
                <div className="pt-2 border-t border-black/10 flex items-start gap-1.5 text-[11px] font-semibold text-rose-700">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>คำเตือน: {advice.warning}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}