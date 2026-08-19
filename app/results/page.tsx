'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserAssessmentInput } from '@/types';
import { calculateSTDRisk } from '@/lib/risk-calculator';
import PanicButton from '@/components/panic-button';
import { 
  ShieldAlert, ArrowRight, MapPin, RefreshCw, 
  FileText, CheckCircle2, X, Printer, SlidersHorizontal, Mail,
  HeartPulse, Calendar, Pill
} from 'lucide-react';

// ฟังก์ชันแปลงวันที่และเวลาแบบไทยทางการ (GMT+7)
const formatThaiDateTime = (dateObj: Date = new Date()) => {
  return dateObj.toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatThaiFullDate = (dateObj: Date = new Date()) => {
  return dateObj.toLocaleDateString('th-TH', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// แปลงค่าเป็นภาษาไทยทางการ
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

const translateCondom = (condom: string) => {
  const map: Record<string, string> = {
    ALWAYS: 'ใช้ถุงยางอนามัยตลอดทุกครั้ง / ไม่รั่วซึม',
    BROKEN: 'ถุงยางอนามัยฉีกขาด / แตก / หลุด',
    INCONSISTENT: 'ใช้ไม่สม่ำเสมอ / สวมใส่เพียงบางช่วง',
    NONE: 'ไม่ได้ใช้ถุงยางอนามัย',
  };
  return map[condom] || condom;
};

const translatePrepStatus = (status: string) => {
  const map: Record<string, string> = {
    DAILY_PREP: 'รับประทานยา Daily PrEP ต่อเนื่องสม่ำเสมอ',
    ON_DEMAND_PREP: 'รับประทานยา PrEP on Demand (สูตร 2-1-1)',
    PEP: 'อยู่ระหว่างรับประทานยาต้านฉุกเฉิน PEP',
    NONE: 'ไม่ได้ใช้ยาต้านไวรัสป้องกันใดๆ',
  };
  return map[status] || status;
};

const translatePartnerRisk = (risk: string) => {
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

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [userInput, setUserInput] = useState<UserAssessmentInput | null>(null);
  const [showMedicalCard, setShowMedicalCard] = useState(false);

  // State สำหรับ What-If Simulation
  const [simCondom, setSimCondom] = useState<boolean>(false);
  const [simPrep, setSimPrep] = useState<boolean>(false);

  useEffect(() => {
    const savedResult = localStorage.getItem('latest_assessment_result');
    const savedInput = localStorage.getItem('latest_assessment_input');

    if (!savedResult || !savedInput) {
      router.push('/assessment');
      return;
    }

    try {
      const parsedInput = JSON.parse(savedInput);
      setResult(JSON.parse(savedResult));
      setUserInput(parsedInput);
      setSimCondom(parsedInput.condomUsed === 'ALWAYS');
      setSimPrep(parsedInput.prepPepStatus === 'DAILY_PREP');
    } catch (e) {
      router.push('/assessment');
    }
  }, [router]);

  const simulatedResult = useMemo(() => {
    if (!userInput) return null;
    const modifiedInput: UserAssessmentInput = {
      ...userInput,
      condomUsed: simCondom ? 'ALWAYS' : 'NONE',
      prepPepStatus: simPrep ? 'DAILY_PREP' : 'NONE',
    };
    return calculateSTDRisk(modifiedInput);
  }, [userInput, simCondom, simPrep]);

  if (!result || !userInput || !simulatedResult) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-slate-400 font-medium text-sm animate-pulse">
          กำลังโหลดผลการประเมิน...
        </div>
      </main>
    );
  }

  const hoursSince = userInput.daysSinceExposure * 24;
  const pepHoursRemaining = Math.max(0, 72 - hoursSince);

  const getRecText = (diseaseObj: any) => {
    if (!diseaseObj) return '';
    if (diseaseObj.recommendation) return diseaseObj.recommendation;
    if (diseaseObj.recommendedActions && Array.isArray(diseaseObj.recommendedActions)) {
      return diseaseObj.recommendedActions.join(' • ');
    }
    return 'แนะนำตรวจคัดกรองตามระยะเวลาที่เหมาะสม';
  };

  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'CRITICAL': return { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', label: 'วิกฤต (CRITICAL)' };
      case 'HIGH': return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'ความเสี่ยงสูง (HIGH)' };
      case 'MEDIUM': return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', label: 'ความเสี่ยงปานกลาง (MEDIUM)' };
      default: return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', label: 'ความเสี่ยงต่ำ (LOW)' };
    }
  };

  const getBarColor = (score: number) => {
    if (score >= 60) return 'bg-rose-600';
    if (score >= 30) return 'bg-amber-500';
    return 'bg-indigo-600';
  };

  const badge = getBadgeStyle(result.overallLevel);

  const diseaseList = [
    { 
      name: 'เชื้อไวรัสเอชไอวี (HIV-1 / HIV-2)', 
      code: 'HIV', 
      score: result.hiv?.score ?? 0, 
      simScore: simulatedResult.hiv?.score ?? 0,
      obj: result.hiv 
    },
    { 
      name: 'โรคซิฟิลิส (Treponema pallidum)', 
      code: 'Syphilis', 
      score: result.syphilis?.score ?? 0, 
      simScore: simulatedResult.syphilis?.score ?? 0,
      obj: result.syphilis 
    },
    { 
      name: 'หนองในแท้และหนองในเทียม (Gonorrhea / Chlamydia)', 
      code: 'Gonorrhea', 
      score: result.gonorrhea?.score ?? 0, 
      simScore: simulatedResult.gonorrhea?.score ?? 0,
      obj: result.gonorrhea 
    },
    { 
      name: 'ไวรัสตับอักเสบบี (Hepatitis B - HBsAg)', 
      code: 'Hepatitis B', 
      score: result.hepatitisB?.score ?? 0, 
      simScore: simulatedResult.hepatitisB?.score ?? 0,
      obj: result.hepatitisB 
    },
  ];

  const handleEmailSelf = () => {
    const subject = encodeURIComponent('[STD RiskGuard] บันทึกผลสรุปประวัติความเสี่ยงเพื่อยื่นตรวจ');
    const body = encodeURIComponent(
      `ผลสรุปการประเมินความเสี่ยงสุขภาพทางเพศ (STD RiskGuard)\n` +
      `วันที่และเวลาประเมิน: ${formatThaiDateTime()}\n` +
      `ระดับความเสี่ยงโดยรวม: ${result?.overallLevel}\n` +
      `คะแนน HIV: ${result?.hiv?.score}%\n` +
      `คะแนน ซิฟิลิส: ${result?.syphilis?.score}%\n` +
      `คะแนน หนองใน: ${result?.gonorrhea?.score}%\n` +
      `คะแนน ไวรัสตับอักเสบบี: ${result?.hepatitisB?.score}%\n` +
      `การใช้ถุงยาง: ${translateCondom(userInput.condomUsed)}\n` +
      `ระยะเวลาสัมผัสเชื้อ: ${userInput.daysSinceExposure} วัน\n\n` +
      `*เอกสารนี้จัดทำขึ้นเพื่อใช้ยื่นต่อบุคลากรทางการแพทย์เพื่อความสะดวกในการคัดกรอง*`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 pb-24">
      <PanicButton />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>ประเมินใหม่อีกครั้ง</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowMedicalCard(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 hover:border-slate-900 px-4 py-2 rounded-xl transition shadow-sm cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>ใบสรุปประวัติสำหรับยื่นเจ้าหน้าที่</span>
          </button>
        </div>

        {/* PEP Emergency Alert */}
        {result.isEmergencyPEP && pepHoursRemaining > 0 && (
          <div className="bg-rose-50 border-2 border-rose-500 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-700 font-extrabold text-sm sm:text-base">
                <ShieldAlert className="w-6 h-6 animate-bounce" />
                <span>คำเตือนฉุกเฉิน: อยู่ในเกณฑ์รับยาต้านไวรัส PEP</span>
              </div>
              <span className="text-xs font-extrabold bg-rose-600 text-white px-3 py-1 rounded-full">
                เหลือเวลาอีก ~{pepHoursRemaining} ชม.
              </span>
            </div>
            <p className="text-xs sm:text-sm text-rose-800 leading-relaxed">
              คุณมีความเสี่ยงต่อเชื้อ HIV และยังอยู่ในกรอบเวลา 72 ชั่วโมง ยาต้านไวรัสฉุกเฉิน (PEP) สามารถป้องกันการติดเชื้อได้สูงสุดหากเริ่มทานโดยเร็วที่สุด
            </p>
            <div className="pt-2">
              <Link
                href="/clinics"
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow transition"
              >
                <MapPin className="w-4 h-4" />
                <span>ค้นหาคลินิกจ่ายยา PEP ใกล้คุณที่สุด</span>
              </Link>
            </div>
          </div>
        )}

        {/* Overall Status Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                <HeartPulse className="w-4 h-4" />
                <span>ผลการวิเคราะห์ระดับคลินิก (Clinical Evaluation)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                ระดับความเสี่ยงโดยรวม: <span className={badge.text}>{result.overallLevel}</span>
              </h1>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400">ประเมินเมื่อ</span>
              <p className="text-xs font-bold text-slate-700">
                {formatThaiDateTime()}
              </p>
            </div>
          </div>

          {/* Unified Horizontal Risk Bars Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                คะแนนความเสี่ยงจำแนกรายโรค (Risk Score 0 - 100)
              </h2>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" /> ความเสี่ยงจริงของคุณ
                </span>
                {(simCondom || simPrep) && (
                  <span className="flex items-center gap-1.5 text-emerald-600">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> เมื่อมีมาตรการป้องกัน
                  </span>
                )}
              </div>
            </div>

            {/* 4 Disease Horizontal Progress Bars */}
            <div className="space-y-3.5 pt-1">
              {diseaseList.map((d) => {
                const isSimulated = simCondom || simPrep;
                const displayScore = isSimulated ? d.simScore : d.score;
                return (
                  <div key={d.code} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                      <span className="text-slate-800">{d.name}</span>
                      <div className="flex items-center gap-2">
                        {isSimulated && d.simScore !== d.score && (
                          <span className="text-xs text-slate-400 line-through">
                            {d.score}%
                          </span>
                        )}
                        <span className={`font-black ${isSimulated ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {displayScore}%
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`${isSimulated ? 'bg-emerald-500' : getBarColor(displayScore)} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(displayScore, 100)}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                      {getRecText(d.obj)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* WHAT-IF SIMULATOR TOOL */}
          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-indigo-950">
                เครื่องมือจำลองผลการลดความเสี่ยง (What-If Simulation)
              </h3>
            </div>
            <p className="text-xs text-indigo-900/80 leading-relaxed">
              ลองเปิด-ปิดตัวเลือกด้านล่าง เพื่อดูว่าการใช้ถุงยางหรือการทานยา PrEP ส่งผลให้ระดับความเสี่ยงของแต่ละโรคลดลงอย่างไร
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setSimCondom(!simCondom)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 cursor-pointer ${
                  simCondom
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${simCondom ? 'text-white' : 'text-slate-300'}`} />
                <span>จำลอง: ใช้ถุงยางอนามัย 100%</span>
              </button>

              <button
                type="button"
                onClick={() => setSimPrep(!simPrep)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 cursor-pointer ${
                  simPrep
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${simPrep ? 'text-white' : 'text-slate-300'}`} />
                <span>จำลอง: ทาน Daily PrEP สม่ำเสมอ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Links to Other Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/timeline"
            className="p-5 bg-white border border-slate-200 hover:border-indigo-400 rounded-3xl shadow-sm flex items-center justify-between group transition"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-600">สเต็ปถัดไป</span>
              <p className="font-bold text-sm text-slate-900">ปฏิทินนัดตรวจ</p>
              <p className="text-xs text-slate-400">วางแผนวันตรวจ Window Period</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition" />
          </Link>

          <Link
            href="/clinics"
            className="p-5 bg-white border border-slate-200 hover:border-indigo-400 rounded-3xl shadow-sm flex items-center justify-between group transition"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-600">ค้นหาพิกัด</span>
              <p className="font-bold text-sm text-slate-900">ค้นหาคลินิกนิรนาม</p>
              <p className="text-xs text-slate-400">สถานพยาบาลใกล้คุณที่สุด</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition" />
          </Link>

          <Link
            href="/tracker"
            className="p-5 bg-white border border-slate-200 hover:border-indigo-400 rounded-3xl shadow-sm flex items-center justify-between group transition"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-600">การป้องกัน</span>
              <p className="font-bold text-sm text-slate-900">บันทึกยา PrEP / PEP</p>
              <p className="text-xs text-slate-400">ติดตามและเตือนเวลาทานยา</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* MODAL: FORMAL BLACK & WHITE CLINICAL HANDOVER FORM */}
        {showMedicalCard && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-300 my-auto">
              
              {/* Modal Top Control Bar */}
              <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between print:hidden">
                <span className="text-xs font-bold tracking-wider">
                  แบบฟอร์มสรุปข้อมูลความเสี่ยง (แบบทางการ)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleEmailSelf}
                    className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm border border-slate-700 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>ส่งสำเนาเข้าอีเมล</span>
                  </button>
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
                    onClick={() => setShowMedicalCard(false)}
                    className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-lg transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* FORM CONTENT (MONOCHROME FORMAT) */}
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
                    <span>วันที่ประเมิน: {formatThaiFullDate()} ({formatThaiDateTime()})</span>
                    <span>สถานะ: นิรนาม (Anonymous)</span>
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
                          {userInput.daysSinceExposure} วันที่ผ่านมา ({userInput.daysSinceExposure * 24} ชั่วโมง)
                          {userInput.daysSinceExposure <= 3 && (
                            <span className="ml-2 font-bold underline">
                              [อยู่ในเกณฑ์พิจารณายาต้านฉุกเฉิน PEP 72 ชม.]
                            </span>
                          )}
                        </td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-2 font-bold border-r border-black bg-gray-100">ลักษณะกิจกรรม</td>
                        <td className="p-2">{userInput.exposureTypes.map(translateExposureType).join(', ')}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-2 font-bold border-r border-black bg-gray-100">การใช้ถุงยางอนามัย</td>
                        <td className="p-2">{translateCondom(userInput.condomUsed)}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-2 font-bold border-r border-black bg-gray-100">การใช้ยาป้องกัน (PrEP / PEP)</td>
                        <td className="p-2">{translatePrepStatus(userInput.prepPepStatus)}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-2 font-bold border-r border-black bg-gray-100">สถานะผลเลือดของคู่นอน</td>
                        <td className="p-2">{translatePartnerRisk(userInput.partnerRisk)}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border-r border-black bg-gray-100">อาการทางกายภาพที่ระบุ</td>
                        <td className="p-2 font-bold">
                          {userInput.symptoms.length > 0
                            ? userInput.symptoms.map(translateSymptom).join(', ')
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
                        <td className="p-2 border-r border-black text-center font-bold">{result.hiv?.level} ({result.hiv?.score}%)</td>
                        <td className="p-2 text-[11px]">{getRecText(result.hiv)}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-2 border-r border-black font-semibold">โรคซิฟิลิส (Syphilis)</td>
                        <td className="p-2 border-r border-black text-center font-bold">{result.syphilis?.level} ({result.syphilis?.score}%)</td>
                        <td className="p-2 text-[11px]">{getRecText(result.syphilis)}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-2 border-r border-black font-semibold">หนองในแท้ / เทียม (Gonorrhea/Chlamydia)</td>
                        <td className="p-2 border-r border-black text-center font-bold">{result.gonorrhea?.level} ({result.gonorrhea?.score}%)</td>
                        <td className="p-2 text-[11px]">{getRecText(result.gonorrhea)}</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-black font-semibold">ไวรัสตับอักเสบบี (Hepatitis B)</td>
                        <td className="p-2 border-r border-black text-center font-bold">{result.hepatitisB?.level} ({result.hepatitisB?.score}%)</td>
                        <td className="p-2 text-[11px]">{getRecText(result.hepatitisB)}</td>
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