'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Activity, MapPin, Pill, ArrowRight, 
  Lock, Calendar, CheckCircle2, Sparkles, Shield,
  HeartPulse, TestTube, Syringe, AlertTriangle, FileText,
  Microscope, Stethoscope, Dna, Clock, ChevronRight
} from 'lucide-react';
import PanicButton from '@/components/panic-button';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-24 overflow-x-hidden">
      <PanicButton />

      {/* 🔮 Animation Engine สำหรับอนุภาคชีวภาพและการแพทย์ */}
      <style jsx global>{`
        @keyframes dna-spin {
          0% { transform: rotateY(0deg) rotateX(12deg); }
          100% { transform: rotateY(360deg) rotateX(12deg); }
        }
        @keyframes microbe-pulse {
          0%, 100% { transform: scale(1) translateY(0px) rotate(0deg); filter: drop-shadow(0 0 16px rgba(99, 102, 241, 0.45)); }
          50% { transform: scale(1.08) translateY(-14px) rotate(8deg); filter: drop-shadow(0 0 32px rgba(168, 85, 247, 0.8)); }
        }
        @keyframes float-fluid-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes float-fluid-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(18px) rotate(-12deg); }
        }
        @keyframes float-fluid-3 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.06); }
        }

        .dna-perspective { perspective: 900px; }
        .dna-axis { transform-style: preserve-3d; animation: dna-spin 8s linear infinite; }
        .animate-microbe { animation: microbe-pulse 5s ease-in-out infinite; }
        .animate-med-1 { animation: float-fluid-1 7s ease-in-out infinite; }
        .animate-med-2 { animation: float-fluid-2 8.5s ease-in-out infinite; animation-delay: -2s; }
        .animate-med-3 { animation: float-fluid-3 6s ease-in-out infinite; animation-delay: -3.5s; }
      `}</style>

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950/[0.04] via-white to-slate-50 border-b border-slate-200/80 pt-12 pb-20 px-4 sm:px-6">
        
        {/* ================= BACKGROUND MEDICAL PARTICLES (กระจายตัวรอบจอ ไร้กรอบ) ================= */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* แสงฟุ้ง Ambient Lighting */}
          <div className="absolute -top-24 left-[10%] w-[520px] h-[520px] bg-indigo-400/20 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[5%] w-[480px] h-[480px] bg-purple-400/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-[35%] w-[400px] h-[400px] bg-cyan-300/15 rounded-full blur-[100px]" />

          {/* 🧬 1. สายเกลียวคู่ DNA 3D สมจริง (มุมบนขวา) */}
          <div className="absolute top-6 right-6 sm:right-24 dna-perspective opacity-80">
            <div className="dna-axis flex flex-col items-center gap-2 py-2">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                <div
                  key={i}
                  className="w-20 sm:w-24 h-1.5 flex items-center justify-between"
                  style={{ transform: `rotateY(${deg}deg)` }}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-md shadow-indigo-400" />
                  <span className="h-[1px] w-full bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 opacity-70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-md shadow-purple-400" />
                </div>
              ))}
            </div>
          </div>

          {/* 🦠 2. โมเดลเซลล์ไวรัส/จุลชีพ (Viral Microbe Sphere) - มุมบนซ้าย */}
          <div className="absolute top-8 left-6 sm:left-14 animate-microbe opacity-85">
            <div className="relative text-indigo-600">
              <Activity className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_0_20px_rgba(99,102,241,0.7)]" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-indigo-500 animate-ping" />
              <span className="absolute -bottom-2 -left-1 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            </div>
          </div>

          {/* 🧪 3. หลอดตรวจเชื้อคลินิก Lab Test Tube (มุมล่างซ้าย) */}
          <div className="absolute bottom-8 left-8 sm:left-24 animate-med-2 opacity-80">
            <div className="text-cyan-500">
              <TestTube className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_0_20px_rgba(6,182,212,0.7)]" />
            </div>
          </div>

          {/* 💉 4. เข็มฉีดยา / วัคซีน Clinical Vaccine (มุมล่างขวา) */}
          <div className="absolute bottom-10 right-8 sm:right-32 animate-med-1 opacity-80">
            <div className="text-emerald-500">
              <Syringe className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_0_20px_rgba(16,185,129,0.7)]" />
            </div>
          </div>

          {/* 🔬 5. กล้องจุลทรรศน์ตรวจวิเคราะห์ Microscope (กลางขวา) */}
          <div className="absolute top-1/2 right-4 sm:right-10 animate-med-3 opacity-70 hidden sm:block">
            <div className="text-purple-500">
              <Microscope className="w-10 h-10 drop-shadow-[0_0_16px_rgba(168,85,247,0.6)]" />
            </div>
          </div>

          {/* 💊 6. ยาต้านไวรัส PrEP / PEP Capsule (กลางซ้าย) */}
          <div className="absolute top-1/2 left-4 sm:left-10 animate-med-1 opacity-75 hidden sm:block">
            <div className="text-pink-500">
              <Pill className="w-9 h-9 drop-shadow-[0_0_16px_rgba(236,72,153,0.6)]" />
            </div>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* ฝั่งซ้าย: ข้อมูลหัวข้อ & ปุ่ม Action (6 คอลัมน์) */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 bg-emerald-100/90 border border-emerald-300 px-3.5 py-1.5 rounded-full text-emerald-900 text-xs font-extrabold shadow-sm backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <Lock className="w-3.5 h-3.5" />
                <span>100% Anonymous • อ้างอิงแนวทางเวชปฏิบัติ CDC & WHO</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                ระบบประเมินความเสี่ยง <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  โรคติดต่อทางเพศสัมพันธ์
                </span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
                เครื่องมือประเมินความเสี่ยงทางการแพทย์เฉพาะบุคคล (HIV, ซิฟิลิส, หนองในแท้/เทียม, ไวรัสตับอักเสบบี) พร้อมระบบปักหมุดระยะตรวจ Window Period ที่แม่นยำ และค้นหาคลินิกตรวจนิรนามใกล้คุณ
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/assessment"
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-300/60 hover:shadow-indigo-400 transition cursor-pointer"
                >
                  <span>เริ่มทำแบบประเมินความเสี่ยง</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/clinics"
                  className="inline-flex items-center justify-center gap-2 bg-white/90 hover:bg-white text-slate-700 border border-slate-300 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-sm hover:shadow transition cursor-pointer backdrop-blur-sm"
                >
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span>ค้นหาคลินิกใกล้ฉัน</span>
                </Link>
              </div>

              {/* Trust Badges 3 ข้อ */}
              <div className="pt-6 grid grid-cols-3 gap-2 border-t border-slate-200/80 text-[11px] font-bold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>มาตรฐานแนวทาง CDC</span>
                </div>
                <div className="flex items-center gap-1.5 border-x border-slate-200 px-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Clinical Matrix Algorithm</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>ไม่เก็บข้อมูลส่วนบุคคล 100%</span>
                </div>
              </div>

            </div>

            {/* ฝั่งขวา: Clinical Dashboard Preview Card แบบละเอียดทางการ (6 คอลัมน์) */}
            <div className="lg:col-span-6 relative">
              <div className="bg-white/95 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-indigo-200/80 shadow-2xl shadow-indigo-200/60 space-y-4">
                
                {/* Dashboard Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shadow-xs">
                      <HeartPulse className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">ตัวอย่างผลวิเคราะห์ทางคลินิก</h4>
                      <p className="text-[10px] text-slate-400">Clinical Risk Stratification Report</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ระดับ: LOW RISK
                    </span>
                  </div>
                </div>

                {/* 4 Multi-Factor Risk Metric Progress Bars */}
                <div className="space-y-3 pt-1">
                  
                  {/* HIV */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        เชื้อไวรัสเอชไอวี (HIV-1 / HIV-2)
                      </span>
                      <span className="text-indigo-600 font-extrabold">5% (ต่ำ)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full w-[5%]" />
                    </div>
                  </div>

                  {/* ซิฟิลิส */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        โรคซิฟิลิส (Treponema pallidum)
                      </span>
                      <span className="text-emerald-600 font-extrabold">12% (ต่ำ)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[12%]" />
                    </div>
                  </div>

                  {/* หนองใน */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        หนองในแท้และหนองในเทียม (NG / CT)
                      </span>
                      <span className="text-amber-600 font-extrabold">18% (ปานกลาง)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[18%]" />
                    </div>
                  </div>

                  {/* ไวรัสตับอักเสบบี */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-teal-500" />
                        ไวรัสตับอักเสบบี (Hepatitis B - HBsAg)
                      </span>
                      <span className="text-teal-600 font-extrabold">3% (ต่ำ)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-full w-[3%]" />
                    </div>
                  </div>

                </div>

                {/* กล่องสรุปผลการแพทย์ 2 ช่อง (Window Period & PEP Protocol) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  
                  {/* กล่อง Window Period */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>หน้าต่างตรวจ (Window Period)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      เริ่มตรวจได้ตั้งแต่ <strong>วันที่ 14</strong> หลังสัมผัสเชื้อ ด้วยวิธี 4th Gen Ag/Ab Combo
                    </p>
                  </div>

                  {/* กล่อง PEP Status */}
                  <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                      <Clock className="w-3.5 h-3.5" />
                      <span>สถานะการรับยา PEP ฉุกเฉิน</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 leading-snug">
                      เหตุการณ์เกิดไม่เกิน 72 ชม. สามารถปรึกษาแพทย์เพื่อรับยาต้านฉุกเฉินได้ทันที
                    </p>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FEATURE GRID ================= */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <div className="mb-6">
          <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            ฟังก์ชันการให้บริการหลัก
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
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