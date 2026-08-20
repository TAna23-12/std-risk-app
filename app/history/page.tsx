'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PanicButton from '@/components/panic-button';
import { 
  History, ArrowLeft, ShieldCheck, Calendar, Activity, 
  RefreshCw, LogIn, FileText, Printer, X
} from 'lucide-react';

interface AssessmentRecord {
  log_id: string;
  created_at: string;
  overall_level: string;
  hiv_score: number;
  syphilis_score: number;
  gonorrhea_score: number;
  hepatitis_b_score: number;
  days_since_exposure: number;
  is_emergency_pep: boolean;
  symptoms: string[];
  exposure_types?: string[];
  condom_used?: string;
  prep_pep_status?: string;
  partner_risk?: string;
}

const formatThaiDate = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatThaiFullDate = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('th-TH', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const translateExposureType = (type: string) => {
  const map: Record<string, string> = {
    ANAL_RECEPTIVE: 'ทางทวารหนัก (ฝ่ายรับ)',
    ANAL_INSERTIVE: 'ทางทวารหนัก (ฝ่ายรุก)',
    VAGINAL_RECEPTIVE: 'ทางช่องคลอด (ฝ่ายรับ)',
    VAGINAL_INSERTIVE: 'ทางช่องคลอด (ฝ่ายรุก)',
    ORAL_GIVING: 'การทำออรัลเซ็กส์ (ฝ่ายใช้ปาก)',
    ORAL_RECEIVING: 'การรับออรัลเซ็กส์ (ฝ่ายถูกใช้ปาก)',
  };
  return map[type] || type;
};

const translateCondom = (condom?: string) => {
  if (!condom) return 'ไม่ได้ใช้ถุงยางอนามัย';
  const map: Record<string, string> = {
    ALWAYS: 'ใช้ถุงยางอนามัยตลอดทุกครั้ง / ไม่รั่วซึม',
    BROKEN: 'ถุงยางอนามัยฉีกขาด / แตก / หลุด',
    INCONSISTENT: 'ใช้ไม่สม่ำเสมอ / สวมใส่เพียงบางช่วง',
    NONE: 'ไม่ได้ใช้ถุงยางอนามัย',
  };
  return map[condom] || condom;
};

const translatePrepStatus = (status?: string) => {
  if (!status) return 'ไม่ได้ใช้ยาต้านไวรัสป้องกันใดๆ';
  const map: Record<string, string> = {
    DAILY_PREP: 'รับประทานยา Daily PrEP ต่อเนื่องสม่ำเสมอ',
    ON_DEMAND_PREP: 'รับประทานยา PrEP on Demand (สูตร 2-1-1)',
    PEP: 'อยู่ระหว่างรับประทานยาต้านฉุกเฉิน PEP',
    NONE: 'ไม่ได้ใช้ยาต้านไวรัสป้องกันใดๆ',
  };
  return map[status] || status;
};

const translatePartnerRisk = (risk?: string) => {
  if (!risk) return 'ไม่ทราบสถานะผลเลือดของคู่นอน';
  const map: Record<string, string> = {
    HIV_UNDETECTABLE: 'มีเชื้อ HIV แต่ตรวจไม่พบเชื้อในกระแสเลือด (U=U)',
    LOW_NEGATIVE: 'ผลตรวจเลือดเป็นลบชัดเจน (Negative)',
    UNKNOWN: 'ไม่ทราบสถานะผลเลือดของคู่นอน',
    HIGH_POSITIVE: 'ผลตรวจเลือดเป็นบวกและไม่ได้รักษา',
  };
  return map[risk] || risk;
};

const translateSymptom = (sym: string) => {
  const map: Record<string, string> = {
    discharge: 'มีหนองหรือของเหลวผิดปกติจากท่อปัสสาวะ/ช่องคลอด',
    burning_urination: 'รู้สึกแสบขัดเวลาปัสสาวะ',
    painless_sore: 'มีแผลริมแข็ง ไม่เจ็บ บริเวณอวัยวะเพศ/ทวาร/ปาก',
    rash_palms_soles: 'มีผื่นแดงตามฝ่ามือ ฝ่าเท้า หรือลำตัว',
    fever_flu: 'มีไข้สูง ต่อมน้ำเหลืองโต เจ็บคอ มีผื่น (คล้ายไข้หวัดใหญ่)',
    jaundice: 'ตาเหลือง ตัวเหลือง หรือปัสสาวะสีเข้มผิดปกติ',
  };
  return map[sym] || sym;
};

const getClinicalRecommendation = (diseaseName: string, score: number) => {
  if (score >= 60) {
    return `พบแพทย์หรือคลินิกเฉพาะทางเพื่อตรวจ ${diseaseName} ทันที • งดการมีเพศสัมพันธ์จนกว่าจะได้รับการยืนยันผลตรวจ`;
  }
  if (score >= 30) {
    return `แนะนำตรวจคัดกรอง ${diseaseName} ตามรอบ Window Period • สวมถุงยางอนามัยทุกครั้ง`;
  }
  return `ความเสี่ยงต่ำ แนะนำตรวจคัดกรองสุขภาพทางเพศประจำปีตามปกติ`;
};

const getDiseaseLevelText = (score: number) => {
  if (score >= 80) return `CRITICAL (${score}%)`;
  if (score >= 60) return `HIGH (${score}%)`;
  if (score >= 30) return `MEDIUM (${score}%)`;
  return `LOW (${score}%)`;
};

export default function HistoryPage() {
  const [logs, setLogs] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      setUser(null);
      setLoading(false);
      return;
    }

    setUser(session.user);

    const { data, error } = await supabase
      .from('assessment_logs')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch history error:', error);
    } else if (data) {
      setLogs(data as AssessmentRecord[]);
    }
    setLoading(false);
  };

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'HIGH': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'MEDIUM': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      default: return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    }
  };

  const getBarColor = (score: number) => {
    if (score >= 60) return 'bg-rose-600';
    if (score >= 30) return 'bg-amber-500';
    return 'bg-indigo-600';
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 pb-24">
      <PanicButton />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับหน้าแรก</span>
          </Link>

          {user && (
            <button
              onClick={fetchHistory}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-xl shadow-sm transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>รีเฟรช</span>
            </button>
          )}
        </div>

        {/* Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Personal Health Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            ประวัติการประเมินความเสี่ยง
          </h1>
          <p className="text-xs text-slate-500">
            {user ? (
              <>บันทึกประวัติเฉพาะของบัญชี <strong>{user.email}</strong></>
            ) : (
              'เข้าสู่ระบบเพื่อดูประวัติการประเมินย้อนหลังส่วนบุคคล'
            )}
          </p>
        </div>

        {/* State: ยังไม่ได้ล็อกอิน */}
        {!loading && !user && (
          <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
            <History className="w-12 h-12 text-slate-300 mx-auto" />
            <div>
              <p className="font-bold text-slate-700">กรุณาเข้าสู่ระบบก่อนดูประวัติ</p>
              <p className="text-xs text-slate-400 mt-1">ข้อมูลประวัติถูกป้องกันด้วยระบบความปลอดภัยส่วนบุคคล</p>
            </div>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow transition"
            >
              <LogIn className="w-4 h-4" />
              <span>เข้าสู่ระบบตอนนี้</span>
            </Link>
          </div>
        )}

        {/* State: กำลังโหลด */}
        {loading && (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 text-sm animate-pulse">
            กำลังโหลดข้อมูลประวัติการประเมิน...
          </div>
        )}

        {/* State: ล็อกอินแล้ว แต่ยังไม่มีประวัติ */}
        {!loading && user && logs.length === 0 && (
          <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
            <History className="w-12 h-12 text-slate-300 mx-auto" />
            <div>
              <p className="font-bold text-slate-700">ยังไม่มีรายการประวัติการประเมิน</p>
              <p className="text-xs text-slate-400 mt-1">เมื่อคุณทำแบบประเมิน ผลลัพธ์จะถูกบันทึกมาที่นี่อัตโนมัติ</p>
            </div>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow transition"
            >
              <Activity className="w-4 h-4" />
              <span>เริ่มทำแบบประเมินความเสี่ยง</span>
            </Link>
          </div>
        )}

        {/* State: แสดงรายการประวัติ */}
        {!loading && user && logs.length > 0 && (
          <div className="space-y-4">
            {logs.map((item) => {
              const diseases = [
                { label: 'HIV', score: item.hiv_score },
                { label: 'ซิฟิลิส', score: item.syphilis_score },
                { label: 'หนองใน', score: item.gonorrhea_score },
                { label: 'ตับอักเสบบี', score: item.hepatitis_b_score },
              ];

              return (
                <div
                  key={item.log_id}
                  className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      <span>วันที่ประเมิน: {formatThaiDate(item.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.is_emergency_pep && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white">
                          เกณฑ์รับยา PEP
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getBadgeColor(item.overall_level)}`}>
                        ระดับ: {item.overall_level}
                      </span>
                    </div>
                  </div>

                  {/* 4 Disease Progress Bars */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {diseases.map((d) => (
                      <div key={d.label} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-600">{d.label}</span>
                          <span className="font-extrabold text-slate-900">{d.score}%</span>
                        </div>
                        <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`${getBarColor(d.score)} h-full rounded-full transition-all duration-500`}
                            style={{ width: `${Math.min(d.score, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <div className="space-y-0.5">
                      <p>ระยะเวลาที่ระบุ ณ วันตรวจ: <strong>{item.days_since_exposure} วัน</strong></p>
                      <p>อาการที่ระบุ: <strong>{item.symptoms && item.symptoms.length > 0 ? `${item.symptoms.length} รายการ` : 'ไม่มีอาการ'}</strong></p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedRecord(item)}
                      className="inline-flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>พิมพ์ใบสรุปประวัติ</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MODAL: IDENTICAL CLINICAL HANDOVER FORM */}
        {selectedRecord && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-300 my-auto">
              
              {/* Modal Top Control Bar */}
              <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between print:hidden">
                <span className="text-xs font-bold tracking-wider">
                  แบบฟอร์มสรุปข้อมูลความเสี่ยง (ประวัติรอบวันที่ {formatThaiDate(selectedRecord.created_at)})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 bg-white text-slate-900 hover:bg-slate-100 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>พิมพ์ / บันทึก PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRecord(null)}
                    className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-lg transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* FORM CONTENT (IDENTICAL MONOCHROME FORMAT) */}
              <div className="p-8 sm:p-10 space-y-6 text-black bg-white font-sans" id="medical-print-document">
                
                {/* Header เอกสารทางการ */}
                <div className="text-center border-b-2 border-black pb-4 space-y-1">
                  <h1 className="text-base sm:text-lg font-bold tracking-wide">
                    แบบสรุปข้อมูลประวัติความเสี่ยงเพื่อประกอบการคัดกรองเบื้องต้น
                  </h1>
                  <p className="text-[11px] text-gray-700">
                    (สำหรับผู้รับบริการยื่นต่อเจ้าหน้าที่คัดกรอง • ข้อมูลไม่ระบุตัวตน)
                  </p>
                  <div className="flex justify-between text-[10px] text-gray-600 pt-2">
                    <span>วันที่ประเมิน: {formatThaiFullDate(selectedRecord.created_at)} ({formatThaiDate(selectedRecord.created_at)})</span>
                    <span>ผู้รับบริการ: {user?.email || 'นิรนาม (Anonymous)'}</span>
                  </div>
                </div>

                {/* ข้อความชี้แจง */}
                <div className="border border-black p-2.5 text-[11px] leading-relaxed text-gray-800">
                  <strong>หมายเหตุถึงเจ้าหน้าที่:</strong> ผู้รับบริการได้บันทึกข้อมูลประวัติความเสี่ยงส่วนบุคคลผ่านระบบคัดกรองตนเองล่วงหน้า เพื่อความสะดวก รวดเร็ว และลดความกังวลในการสนทนาเรื่องส่วนบุคคล สามารถใช้ข้อมูลด้านล่างนี้ประกอบการพิจารณาส่งตรวจได้ทันที
                </div>

                {/* ตารางประวัติความเสี่ยง 6 หัวข้อ */}
                <div className="space-y-1.5">
                  <h2 className="text-xs font-bold">1. ข้อมูลการสัมผัสเชื้อและพฤติกรรมเสี่ยง</h2>
                  <table className="w-full text-xs border border-black border-collapse">
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="p-2 font-bold w-1/3 border-r border-black bg-gray-100">ระยะเวลาสัมผัสเชื้อล่าสุด</td>
                        <td className="p-2">
                          {selectedRecord.days_since_exposure} วันที่ผ่านมา ({selectedRecord.days_since_exposure * 24} ชั่วโมง)
                          {selectedRecord.days_since_exposure <= 3 && (
                            <span className="ml-2 font-bold underline">
                              [อยู่ในเกณฑ์พิจารณายาต้านฉุกเฉิน PEP 72 ชม.]
                            </span>
                          )}
                        </td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-2 font-bold border-r border-black bg-gray-100">ลักษณะกิจกรรม</td>
                        <td className="p-2">
                          {selectedRecord.exposure_types && selectedRecord.exposure_types.length > 0
                            ? selectedRecord.exposure_types.map(translateExposureType).join(', ')
                            : 'ทางช่องคลอด / ทางทวารหนัก (ฝ่ายรับ)'}
                        </td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-2 font-bold border-r border-black bg-gray-100">การใช้ถุงยางอนามัย</td>
                        <td className="p-2">{translateCondom(selectedRecord.condom_used)}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-2 font-bold border-r border-black bg-gray-100">การใช้ยาป้องกัน (PrEP / PEP)</td>
                        <td className="p-2">{translatePrepStatus(selectedRecord.prep_pep_status)}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-2 font-bold border-r border-black bg-gray-100">สถานะผลเลือดของคู่นอน</td>
                        <td className="p-2">{translatePartnerRisk(selectedRecord.partner_risk)}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border-r border-black bg-gray-100">อาการทางกายภาพที่ระบุ</td>
                        <td className="p-2 font-bold">
                          {selectedRecord.symptoms && selectedRecord.symptoms.length > 0
                            ? selectedRecord.symptoms.map(translateSymptom).join(', ')
                            : 'ไม่มีอาการทางกายภาพผิดปกติในขณะนี้'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* ตารางสรุปความเสี่ยง 4 โรค */}
                <div className="space-y-1.5">
                  <h2 className="text-xs font-bold">2. ผลการวิเคราะห์ระดับความเสี่ยงเบื้องต้น (Risk Stratification)</h2>
                  <table className="w-full text-xs border border-black border-collapse text-left">
                    <thead>
                      <tr className="border-b border-black bg-gray-100">
                        <th className="p-2 border-r border-black w-2/5">เชื้อก่อโรค / สภาวะ</th>
                        <th className="p-2 border-r border-black text-center w-1/4">ระดับความเสี่ยง</th>
                        <th className="p-2">คำแนะนำการตรวจเบื้องต้น</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="p-2 border-r border-black font-semibold">เชื้อเอชไอวี (HIV)</td>
                        <td className="p-2 border-r border-black text-center font-bold">
                          {getDiseaseLevelText(selectedRecord.hiv_score)}
                        </td>
                        <td className="p-2 text-[11px]">
                          {getClinicalRecommendation('HIV', selectedRecord.hiv_score)}
                        </td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-2 border-r border-black font-semibold">โรคซิฟิลิส (Syphilis)</td>
                        <td className="p-2 border-r border-black text-center font-bold">
                          {getDiseaseLevelText(selectedRecord.syphilis_score)}
                        </td>
                        <td className="p-2 text-[11px]">
                          {getClinicalRecommendation('ซิฟิลิส', selectedRecord.syphilis_score)}
                        </td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-2 border-r border-black font-semibold">หนองในแท้ / เทียม (Gonorrhea/Chlamydia)</td>
                        <td className="p-2 border-r border-black text-center font-bold">
                          {getDiseaseLevelText(selectedRecord.gonorrhea_score)}
                        </td>
                        <td className="p-2 text-[11px]">
                          {getClinicalRecommendation('หนองใน', selectedRecord.gonorrhea_score)}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-black font-semibold">ไวรัสตับอักเสบบี (Hepatitis B)</td>
                        <td className="p-2 border-r border-black text-center font-bold">
                          {getDiseaseLevelText(selectedRecord.hepatitis_b_score)}
                        </td>
                        <td className="p-2 text-[11px]">
                          {getClinicalRecommendation('ไวรัสตับอักเสบบี', selectedRecord.hepatitis_b_score)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* ท้ายเอกสาร */}
                <div className="border-t border-black pt-3 flex justify-between text-[10px] text-gray-500">
                  <span>* ข้อมูลนี้ใช้เพื่อประกอบการซักประวัติเท่านั้น ไม่ใช่ผลการตรวจทางห้องปฏิบัติการ</span>
                  <span>STD Risk Screening System</span>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}