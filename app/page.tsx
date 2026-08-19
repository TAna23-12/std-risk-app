'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Activity, MapPin, Pill, ArrowRight, 
  Lock, Calendar, CheckCircle2, Sparkles, Shield,
  TrendingDown, AlertCircle, HeartPulse
} from 'lucide-react';
import PanicButton from '@/components/panic-button';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <PanicButton />

      {/* Hero Section แบบ Modern Split Layout */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 border-b border-slate-200/80 pt-10 pb-16 px-4 sm:px-6">
        
        {/* Background Aura Layers (เห็นสีชัดเจน) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-20 w-[500px] h-[500px] bg-indigo-300/30 rounded-full blur-[90px]" />
          <div className="absolute top-10 right-0 w-[450px] h-[450px] bg-purple-200/40 rounded-full blur-[100px]" />
          <div 
            className="absolute inset-0 opacity-[0.04]" 
            style={{
              backgroundImage: 'radial-gradient(#4f46e5 1.5px, transparent 1.5px)',
              backgroundSize: '20px 20px'
            }} 
          />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* ฝั่งซ้าย: Headline & Call To Actions (7 คอลัมน์) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-100/80 border border-emerald-300 px-3.5 py-1.5 rounded-full text-emerald-900 text-xs font-extrabold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <Lock className="w-3.5 h-3.5" />
                <span>100% Anonymous • ไม่ระบุตัวตน • มาตรฐาน CDC</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                ระบบประเมินความเสี่ยง <br />
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 bg-clip-text text-transparent">
                  โรคติดต่อทางเพศสัมพันธ์
                </span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
                วิเคราะห์ความเสี่ยงรายโรค (HIV, ซิฟิลิส, หนองใน, ไวรัสตับอักเสบ) ด้วย Clinical Algorithm พร้อมปักหมุดระยะตรวจ Window Period และค้นหาคลินิกตรวจนิรนามใกล้คุณ
              </p>

              {/* ปุ่ม Action */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/assessment"
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition cursor-pointer"
                >
                  <span>เริ่มทำแบบประเมินฟรี</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/clinics"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xs transition cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span>ค้นหาคลินิกใกล้ฉัน</span>
                </Link>
              </div>

              {/* Badges การันตี 3 ช่อง */}
              <div className="pt-6 grid grid-cols-3 gap-2 border-t border-slate-200/80 text-[11px] font-bold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>เกณฑ์การแพทย์ CDC</span>
                </div>
                <div className="flex items-center gap-1.5 border-x border-slate-200 px-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>วิเคราะห์เฉพาะบุคคล</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>เข้ารหัสปลอดภัย 100%</span>
                </div>
              </div>
            </div>

            {/* ฝั่งขวา: Card จำลองการวิเคราะห์ (5 คอลัมน์ เติมเต็มพื้นที่ว่าง) */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-100/50 space-y-4">
                
                {/* Header จำลอง */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">ตัวอย่างผลวิเคราะห์ส่วนบุคคล</h4>
                      <p className="text-[10px] text-slate-400">Clinical Risk Matrix</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ความเสี่ยงต่ำ
                  </span>
                </div>

                {/* Score Bars จำลอง */}
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-1">
                      <span className="text-slate-600">HIV (ความเสี่ยง)</span>
                      <span className="text-indigo-600">5%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full w-[5%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-1">
                      <span className="text-slate-600">ซิฟิลิส (Syphilis)</span>
                      <span className="text-emerald-600">12%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[12%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-1">
                      <span className="text-slate-600">หนองใน (Gonorrhea)</span>
                      <span className="text-amber-600">18%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[18%]" />
                    </div>
                  </div>
                </div>

                {/* กล่องคำแนะนำ Window Period */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-slate-600 leading-snug">
                    <strong className="text-slate-800">แนะนำระยะเวลาตรวจที่แม่นยำ:</strong>
                    <p className="text-slate-500 mt-0.5">ตรวจได้ตั้งแต่วันที่ 14 เป็นต้นไป ด้วยวิธี 4th Gen Combo Test</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Grid (4 การ์ดฟีเจอร์หลัก) */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <div className="mb-6">
          <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            ฟังก์ชันการให้บริการหลัก
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <Link
            href="/assessment"
            className="group bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm hover:border-indigo-400 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                ประเมินความเสี่ยง
              </h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                วิเคราะห์ความเสี่ยง 4 โรคหลักตามระยะเวลา อาการ และประวัติการสัมผัส
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 mt-4 inline-flex items-center gap-1">
              เริ่มประเมิน <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Card 2 */}
          <Link
            href="/timeline"
            className="group bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm hover:border-rose-400 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-rose-600 group-hover:text-white transition">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition">
                ปฏิทินนัดตรวจ
              </h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                คำนวณวันตรวจที่แม่นยำตามระยะฟักตัวและวิธีตรวจแต่ละชนิด
              </p>
            </div>
            <span className="text-xs font-bold text-rose-600 mt-4 inline-flex items-center gap-1">
              วางแผนนัด <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Card 3 */}
          <Link
            href="/clinics"
            className="group bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                ค้นหาคลินิก
              </h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                ค้นหาคลินิกนิรนามและศูนย์บริการสาธารณสุขใกล้ตัวพร้อมเส้นทาง
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 mt-4 inline-flex items-center gap-1">
              ค้นหาสถานที่ <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Card 4 */}
          <Link
            href="/tracker"
            className="group bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm hover:border-emerald-400 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition">
                <Pill className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition">
                บันทึกการทานยา
              </h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                ติดตามยา PrEP / PEP คำนวณ Adherence Rate และระบบช่วยเมื่อลืมทาน
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 mt-4 inline-flex items-center gap-1">
              เข้าสู่ระบบบันทึก <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}