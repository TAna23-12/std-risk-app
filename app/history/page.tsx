'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PanicButton from '@/components/panic-button';
import { 
  History, ArrowLeft, ShieldCheck, Calendar, Activity, 
  RefreshCw, FileText, AlertCircle
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
}

export default function HistoryPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    // 1. ตรวจสอบว่าผู้ใช้ล็อกอินอยู่หรือไม่
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // ถ้ายังไม่ได้ล็อกอิน ให้เด้งไปหน้าล็อกอิน
      router.push('/auth');
      return;
    }

    setUserEmail(user.email || 'ผู้ใช้งาน');

    // 2. ดึงประวัติเฉพาะของ user_id ตัวเอง เรียงจากล่าสุดไปเก่าสุด
    const { data, error } = await supabase
      .from('assessment_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch history error:', error);
    } else if (data) {
      setLogs(data as AssessmentRecord[]);
    }
    setLoading(false);
  };

  // แปลงเวลาเป็นภาษาไทย (GMT+7 Bangkok)
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

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'HIGH':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'MEDIUM':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      default:
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 pb-24">
      <PanicButton />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header & Back Button */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับหน้าแรก</span>
          </Link>

          <button
            onClick={fetchHistory}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-xl shadow-sm transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>รีเฟรชประวัติ</span>
          </button>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy-First Personal Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            ประวัติการประเมินความเสี่ยง
          </h1>
          <p className="text-xs text-slate-500">
            ประวัติส่วนบุคคลเฉพาะของบัญชี <strong>{userEmail}</strong> (ปลอดภัยและเข้าถึงได้เฉพาะคุณเท่านั้น)
          </p>
        </div>

        {/* รายการประวัติ */}
        {loading ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 text-sm animate-pulse">
            กำลังโหลดข้อมูลประวัติการประเมิน...
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
            <History className="w-12 h-12 text-slate-300 mx-auto" />
            <div>
              <p className="font-bold text-slate-700">ยังไม่มีประวัติการประเมินความเสี่ยง</p>
              <p className="text-xs text-slate-400 mt-1">เมื่อคุณทำแบบประเมินขณะล็อกอิน ประวัติจะถูกเก็บไว้ที่นี่อัตโนมัติ</p>
            </div>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow transition"
            >
              <Activity className="w-4 h-4" />
              <span>เริ่มทำแบบประเมินใหม่</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((item, index) => (
              <div
                key={item.log_id || index}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span>ประเมินเมื่อ: {formatThaiDate(item.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.is_emergency_pep && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white">
                        เข้าเกณฑ์ยา PEP
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getBadgeColor(item.overall_level)}`}>
                      ระดับ: {item.overall_level}
                    </span>
                  </div>
                </div>

                {/* แสดงคะแนนแต่ละโรค */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[11px] font-semibold text-slate-500">HIV</span>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">{item.hiv_score}%</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[11px] font-semibold text-slate-500">ซิฟิลิส</span>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">{item.syphilis_score}%</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[11px] font-semibold text-slate-500">หนองใน</span>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">{item.gonorrhea_score}%</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[11px] font-semibold text-slate-500">ตับอักเสบบี</span>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">{item.hepatitis_b_score}%</p>
                  </div>
                </div>

                <div className="text-xs text-slate-500 flex flex-col sm:flex-row sm:justify-between gap-1 pt-1">
                  <span>ระยะเวลาที่ระบุ ณ วันตรวจ: <strong>{item.days_since_exposure} วัน</strong></span>
                  <span>อาการที่ระบุ: <strong>{item.symptoms && item.symptoms.length > 0 ? `${item.symptoms.length} รายการ` : 'ไม่มีอาการผิดปกติ'}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}