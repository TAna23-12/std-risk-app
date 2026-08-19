'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PanicButton from '@/components/panic-button';
import { 
  Users, ShieldAlert, Activity, Pill, Download, 
  ArrowLeft, RefreshCw, BarChart3, PieChart as PieIcon, 
  AlertTriangle, FileSpreadsheet, CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';

interface AssessmentStat {
  log_id: string;
  user_id: string | null;
  overall_level: string;
  hiv_score: number;
  is_emergency_pep: boolean;
  condom_used: string;
  exposure_types: string[];
  symptoms: string[];
  created_at: string;
}

interface MedicationStat {
  log_id: string;
  medication_type: string;
  status: string;
  created_at: string;
}

const RISK_COLORS: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#eab308',
  LOW: '#10b981',
};

export default function AdminDashboardPage() {
  const [assessments, setAssessments] = useState<AssessmentStat[]>([]);
  const [medLogs, setMedLogs] = useState<MedicationStat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assessRes, medRes] = await Promise.all([
        supabase.from('assessment_logs').select('*').order('created_at', { ascending: false }),
        supabase.from('medication_logs').select('*').order('created_at', { ascending: false }),
      ]);

      if (assessRes.data) setAssessments(assessRes.data as AssessmentStat[]);
      if (medRes.data) setMedLogs(medRes.data as MedicationStat[]);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 1. คำนวณ KPI Metrics
  const totalAssessments = assessments.length;
  const emergencyPepCases = assessments.filter((a) => a.is_emergency_pep).length;
  const totalMedTrackers = medLogs.length;
  const takenMeds = medLogs.filter((m) => m.status === 'TAKEN').length;
  const avgAdherence = totalMedTrackers > 0 ? Math.round((takenMeds / totalMedTrackers) * 100) : 0;

  // 2. ข้อมูลสัดส่วนระดับความเสี่ยง (Risk Distribution)
  const riskCounts = assessments.reduce((acc, curr) => {
    const level = curr.overall_level || 'LOW';
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const riskPieData = [
    { name: 'CRITICAL (วิกฤต)', value: riskCounts['CRITICAL'] || 0, color: RISK_COLORS.CRITICAL },
    { name: 'HIGH (สูง)', value: riskCounts['HIGH'] || 0, color: RISK_COLORS.HIGH },
    { name: 'MEDIUM (ปานกลาง)', value: riskCounts['MEDIUM'] || 0, color: RISK_COLORS.MEDIUM },
    { name: 'LOW (ต่ำ)', value: riskCounts['LOW'] || 0, color: RISK_COLORS.LOW },
  ].filter((item) => item.value > 0);

  // 3. ข้อมูลพฤติกรรมการใช้ถุงยาง
  const condomCounts = assessments.reduce((acc, curr) => {
    const key = curr.condom_used || 'NONE';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const condomBarData = [
    { name: 'ไม่ใช้ถุงยาง', count: condomCounts['NONE'] || 0 },
    { name: 'ถุงยางแตก/หลุด', count: condomCounts['BROKEN'] || 0 },
    { name: 'ใช้ไม่สม่ำเสมอ', count: condomCounts['INCONSISTENT'] || 0 },
    { name: 'ใช้สม่ำเสมอ', count: condomCounts['ALWAYS'] || 0 },
  ];

  // ฟังก์ชัน Export CSV
  const handleExportCSV = () => {
    if (assessments.length === 0) {
      alert('ไม่มีข้อมูลสำหรับส่งออก');
      return;
    }

    const headers = ['Log ID', 'User ID', 'Overall Risk', 'HIV Score', 'PEP Emergency', 'Condom Used', 'Date'];
    const rows = assessments.map((a) => [
      a.log_id,
      a.user_id || 'Anonymous',
      a.overall_level,
      a.hiv_score,
      a.is_emergency_pep ? 'YES' : 'NO',
      a.condom_used,
      new Date(a.created_at).toLocaleString('th-TH'),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
      + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `STD_RiskGuard_Analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 pb-24">
      <PanicButton />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs tracking-wider uppercase mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>Public Health Epidemiological Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              ระบบวิเคราะห์แนวโน้มและสถิติภาพรวม (Admin Analytics)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              ข้อมูลสถิติรวมเชิงประชากรแบบไม่ระบุตัวตน (Anonymized Aggregate Data)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchData}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>รีเฟรชข้อมูล</span>
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>ส่งออกข้อมูล CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">ผู้ทำแบบประเมินทั้งหมด</span>
              <Activity className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{totalAssessments}</div>
            <p className="text-[11px] text-slate-400">ครั้งที่มีการประเมินความเสี่ยง</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">เคสฉุกเฉิน PEP 72 ชม.</span>
              <ShieldAlert className="w-5 h-5 text-rose-600" />
            </div>
            <div className="text-3xl font-black text-rose-600">{emergencyPepCases}</div>
            <p className="text-[11px] text-rose-500 font-medium">
              {totalAssessments > 0 ? Math.round((emergencyPepCases / totalAssessments) * 100) : 0}% ของเคสทั้งหมด
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">บันทึกการทานยาสะสม</span>
              <Pill className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{totalMedTrackers}</div>
            <p className="text-[11px] text-slate-400">มื้อยาที่ถูกบันทึกลงระบบ</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Adherence Rate เฉลี่ย</span>
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-black text-indigo-600">{avgAdherence}%</div>
            <p className="text-[11px] text-slate-400">อัตราความต่อเนื่องในการทานยา</p>
          </div>
        </div>

        {/* Visual Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Risk Distribution Pie Chart */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-indigo-600" />
                <span>สัดส่วนระดับความเสี่ยง (Risk Distribution)</span>
              </h2>
            </div>

            {riskPieData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                ยังไม่มีข้อมูลเพียงพอสำหรับสร้างกราฟ
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                    >
                      {riskPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Chart 2: Condom Usage Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span>พฤติกรรมการใช้ถุงยางอนามัย (Condom Behavior)</span>
              </h2>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={condomBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="count" name="จำนวนผู้ใช้" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Assessment Log Table */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              <span>รายการประเมินความเสี่ยงล่าสุด (Anonymized Logs)</span>
            </h2>
            <span className="text-xs text-slate-400">แสดงสูงสุด 10 รายการล่าสุด</span>
          </div>

          {loading ? (
            <p className="text-xs text-slate-400 text-center py-6">กำลังโหลดข้อมูล...</p>
          ) : assessments.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">ยังไม่มีประวัติการประเมินในระบบ</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-3">เวลาที่ประเมิน</th>
                    <th className="py-3 px-3">สถานะบัญชี</th>
                    <th className="py-3 px-3">ระดับความเสี่ยง</th>
                    <th className="py-3 px-3">คะแนน HIV</th>
                    <th className="py-3 px-3">PEP ฉุกเฉิน</th>
                    <th className="py-3 px-3">การใช้ถุงยาง</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {assessments.slice(0, 10).map((item) => (
                    <tr key={item.log_id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 text-slate-600">
                        {new Date(item.created_at).toLocaleString('th-TH', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-3">
                        {item.user_id ? (
                          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold border border-indigo-200">
                            Logged In
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                            Anonymous
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-md border text-[10px] ${
                            item.overall_level === 'CRITICAL'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : item.overall_level === 'HIGH'
                              ? 'bg-orange-50 text-orange-700 border-orange-200'
                              : item.overall_level === 'MEDIUM'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {item.overall_level}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800">{item.hiv_score}%</td>
                      <td className="py-3 px-3">
                        {item.is_emergency_pep ? (
                          <span className="font-bold text-rose-600">ใช่ (PEP)</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-600">{item.condom_used}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}