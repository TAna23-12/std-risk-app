'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PanicButton from '@/components/panic-button';
import { Calendar as CalendarIcon, ArrowLeft, Info, Clock, Download, CheckCircle2 } from 'lucide-react';

interface TestMilestone {
  id: string;
  title: string;
  technology: string;
  minDays: number;
  maxDays: number;
  description: string;
  badgeColor: string;
}

const MILESTONES: TestMilestone[] = [
  {
    id: 'hiv-nat',
    title: 'HIV NAT (Nucleic Acid Test)',
    technology: 'ตรวจหาสารพันธุกรรมของเชื้อโดยตรง',
    minDays: 3,
    maxDays: 7,
    description: 'ตรวจจับเชื้อได้เร็วที่สุด เริ่มตรวจได้ตั้งแต่ 3-7 วันหลังสัมผัสเชื้อ เหมาะสำหรับผู้ที่มีความเสี่ยงสูง',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  {
    id: 'hiv-4th-gen',
    title: 'HIV 4th Gen Combo Test (Ag/Ab)',
    technology: 'ตรวจแอนติเจน p24 และ แอนติบอดี',
    minDays: 14,
    maxDays: 28,
    description: 'วิธีมาตรฐานตามโรงพยาบาลและคลินิก ให้ผลแม่นยำสูงตั้งแต่ 14 วัน และผลแน่นอนเกือบ 100% ที่ 28 วันขึ้นไป',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  {
    id: 'syphilis-rpr',
    title: 'Syphilis (ซิฟิลิส RPR / TPHA)',
    technology: 'ตรวจคัดกรองแอนติบอดีต่อเชื้อซิฟิลิส',
    minDays: 28,
    maxDays: 90,
    description: 'เชื้อซิฟิลิสใช้เวลาสร้างภูมิคุ้มกัน ควรตรวจคัดกรองครั้งแรกที่ 1 เดือน และตรวจยืนยันความแน่นอนที่ 3 เดือน',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    id: 'rapid-test',
    title: 'HIV Rapid Test (3rd/4th Gen)',
    technology: 'ชุดตรวจคัดกรองเร็วแบบรู้ผลทันที',
    minDays: 30,
    maxDays: 90,
    description: 'ตรวจยืนยันระดับภูมิคุ้มกัน (Antibody) ตรวจที่ 30 วัน และตรวจซ้ำเพื่อปิดเคสสมบูรณ์ที่ 90 วัน (3 เดือน)',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
];

export default function TimelinePage() {
  const [exposureDate, setExposureDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const getTargetDateObj = (days: number) => {
    const d = new Date(exposureDate);
    d.setDate(d.getDate() + days);
    return d;
  };

  const calculateTargetDate = (days: number) => {
    const base = getTargetDateObj(days);
    if (isNaN(base.getTime())) return '-';
    return base.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // ส่งออกไฟล์ .ics สำหรับ Google Calendar / Apple Calendar
  const handleExportICS = (item: TestMilestone) => {
    const targetDate = getTargetDateObj(item.maxDays);
    const y = targetDate.getFullYear();
    const m = String(targetDate.getMonth() + 1).padStart(2, '0');
    const d = String(targetDate.getDate()).padStart(2, '0');
    const dateStr = `${y}${m}${d}`;

    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//RiskGuard//STD Calendar//TH',
      'BEGIN:VEVENT',
      `UID:${item.id}-${Date.now()}@riskguard.local`,
      `DTSTAMP:${dateStr}T090000Z`,
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${dateStr}`,
      `SUMMARY:นัดตรวจ ${item.title}`,
      `DESCRIPTION:${item.description} (ช่วงตรวจแนะนำ: ${item.minDays}-${item.maxDays} วันหลังสัมผัส)`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `appointment-${item.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 pb-24">
      <PanicButton />

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>หน้าแรก</span>
          </Link>
          <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-semibold border border-indigo-200">
            Window Period Planner
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            วางแผนวันนัดตรวจ (Window Period)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            คำนวณวันตรวจที่แม่นยำ พร้อมส่งออกแจ้งเตือนลงปฏิทินในมือถือของคุณ
          </p>
        </div>

        {/* Date Selector */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <label className="block text-sm font-bold text-slate-800">
            ระบุวันที่เกิดเหตุการณ์เสี่ยง
          </label>
          <input
            type="date"
            value={exposureDate}
            onChange={(e) => setExposureDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>ระบบจะคำนวณวันตรวจที่แน่นอนที่สุดตามเทคโนโลยีของน้ำยาตรวจ</span>
          </p>
        </div>

        {/* Timeline Items */}
        <div className="space-y-4">
          {MILESTONES.map((item) => {
            const startDateStr = calculateTargetDate(item.minDays);
            const endDateStr = calculateTargetDate(item.maxDays);

            return (
              <div
                key={item.id}
                className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border mb-1.5 ${item.badgeColor}`}
                    >
                      {item.title}
                    </span>
                    <h2 className="text-base font-bold text-slate-900">{item.technology}</h2>
                  </div>
                  <div className="bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-100 text-right shrink-0">
                    <p className="text-[11px] text-slate-400 font-semibold">ช่วงตรวจที่แนะนำ</p>
                    <p className="text-xs sm:text-sm font-extrabold text-indigo-700 mt-0.5">
                      {startDateStr} - {endDateStr}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {item.minDays} - {item.maxDays} วันหลังสัมผัส
                  </span>

                  <button
                    type="button"
                    onClick={() => handleExportICS(item)}
                    className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>บันทึกลงปฏิทิน (.ics)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}