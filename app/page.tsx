'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Activity, MapPin, Pill, ArrowRight, 
  Lock, Calendar, CheckCircle2, Sparkles, Shield,
  HeartPulse, TestTube, Syringe
} from 'lucide-react';
import PanicButton from '@/components/panic-button';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20 overflow-x-hidden">
      <PanicButton />

      {/* 🔮 CSS 3D DNA & Organic Soft Glow Animations */}
      <style jsx global>{`
        @keyframes dna-rotate {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes float-smooth {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(6deg); }
        }
        @keyframes float-smooth-rev {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(14px) rotate(-6deg); }
        }
        @keyframes soft-pulse {
          0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 15px rgba(99, 102, 241, 0.4)); }
          50% { opacity: 0.95; filter: drop-shadow(0 0 30px rgba(168, 85, 247, 0.8)); }
        }

        .dna-container {
          perspective: 800px;
        }
        .dna-strand {
          transform-style: preserve-3d;
          animation: dna-rotate 7s linear infinite;
        }
        .animate-float-soft1 {
          animation: float-smooth 6s ease-in-out infinite, soft-pulse 4s ease-in-out infinite;
        }
        .animate-float-soft2 {
          animation: float-smooth-rev 7.5s ease-in-out infinite, soft-pulse 5s ease-in-out infinite;
          animation-delay: -2s;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 border-b border-slate-200/80 pt-12 pb-20 px-4 sm:px-6">
        
        {/* ================= BACKGROUND GLOW & 3D DNA (ไร้กรอบ นุ่มนวล) ================= */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          
          {/* แสงฟุ้งพื้นหลัง */}
          <div className="absolute top-[-60px] left-[15%] w-[460px] h-[460px] bg-indigo-300/25 rounded-full blur-[110px]" />
          <div className="absolute top-[15%] right-[10%] w-[420px] h-[420px] bg-purple-300/20 rounded-full blur-[110px]" />

          {/* 🧬 1. เกลียวคู่ DNA 3 มิติ หมุนควงสว่าน (มุมบนขวา) */}
          <div className="absolute top-8 right-6 sm:right-24 dna-container">
            <div className="dna-strand flex flex-col items-center gap-2 py-2">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240].map((deg, i) => (
                <div
                  key={i}
                  className="w-16 sm:w-20 h-1.5 flex items-center justify-between"
                  style={{
                    transform: `rotateY(${deg}deg)`,
                  }}
                >
                  <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-md shadow-indigo-400" />
                  <span className="h-[1px] w-full bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 opacity-60" />
                  <span className="w-3 h-3 rounded-full bg-purple-500 shadow-md shadow-purple-400" />
                </div>
              ))}
            </div>
          </div>

          {/* 🦠 2. เซลล์เชื้อจุลชีพ/ไวรัส ลอยไร้กรอบ (มุมบนซ้าย) */}
          <div className="absolute top-8 left-6 sm:left-14 animate-float-soft1">
            <div className="relative text-indigo-600/80">
              <Activity className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_0_16px_rgba(99,102,241,0.6)]" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
            </div>
          </div>

          {/* 🧪 3. หลอดทดลอง Lab Screening ไร้กรอบ (มุมล่างซ้าย) */}
          <div className="absolute bottom-10 left-8 sm:left-24 animate-float-soft2">
            <div className="text-cyan-500/80 flex items-center gap-2">
              <TestTube className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-[0_0_18px_rgba(6,182,212,0.6)]" />
            </div>
          </div>

          {/* 💉 4. เข็มฉีดยา / วัคซีน ไร้กรอบ (มุมล่างขวา) */}
          <div className="absolute bottom-12 right-8 sm:right-32 animate-float-soft1">
            <div className="text-emerald-500/80">
              <Syringe className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-[0_0_18px_rgba(16,185,129,0.6)]" />
            </div>
          </div>

          {/* 💊 5. เม็ดยาป้องกันลอยเรืองแสง (กลางซ้าย) */}
          <div className="absolute top-1/2 left-4 sm:left-10 animate-float-soft2 hidden sm:block">
            <div className="text-purple-500/70">
              <Pill className="w-8 h-8 drop-shadow-[0_0_14px_rgba(168,85,247,0.6)]" />
            </div>
          </div>

        </div>
        {/* ================= END BACKGROUND ================= */}

        {/* เนื้อหาหลักด้านหน้า */}
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* ฝั่งซ้าย: Headline & Actions */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-100/90 border border-emerald-300 px-3.5 py-1.5 rounded-full text-emerald-900 text-xs font-extrabold shadow-sm backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <Lock className="w-3.5 h-3.5" />
                <span>100% Anonymous • ไม่ระบุตัวตน • มาตรฐาน CDC</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                ระบบประเมินความเสี่ยง <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  โรคติดต่อทางเพศสัมพันธ์
                </span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
                วิเคราะห์ความเสี่ยงเฉพาะบุคคล (HIV, ซิฟิลิส, หนองใน, ไวรัสตับอักเสบ) ด้วยอัลกอริทึมการแพทย์ พร้อมปักหมุดระยะตรวจ Window Period และค้นหาคลินิกตรวจนิรนามใกล้คุณ
              </p>

              {/* ปุ่ม Action */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/assessment"
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-300/60 hover:shadow-indigo-400 transition cursor-pointer"
                >
                  <span>เริ่มทำแบบประเมินฟรี</span>
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

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-2 border-t border-slate-200/80 text-[11px] font-bold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>เกณฑ์การแพทย์ CDC</span>
                </div>
                <div className="flex items-center gap-1.5 border-x border-slate-200 px-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>วิเคราะห์เฉพาะบุคคล</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>เข้ารหัสปลอดภัย 100%</span>
                </div>
              </div>
            </div>

            {/* ฝั่งขวา: Card จำลองการวิเคราะห์ (ครบทั้ง 4 โรค) */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl border border-indigo-200/70 shadow-2xl shadow-indigo-200/50 space-y-4">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">ตัวอย่างผลวิเคราะห์ส่วนบุคคล</h4>
                      <p className="text-[10px] text-slate-400">Clinical Risk Matrix (4 โรคหลัก)</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ความเสี่ยงต่ำ
                  </span>
                </div>

                <div className="space-y-2.5">
                  {/* HIV */}
                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-1">
                      <span className="text-slate-600">HIV (ความเสี่ยง)</span>
                      <span className="text-indigo-600">5%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full w-[5%]" />
                    </div>
                  </div>

                  {/* ซิฟิลิส */}
                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-1">
                      <span className="text-slate-600">ซิฟิลิส (Syphilis)</span>
                      <span className="text-emerald-600">12%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[12%]" />
                    </div>
                  </div>

                  {/* หนองใน */}
                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-1">
                      <span className="text-slate-600">หนองใน (Gonorrhea)</span>
                      <span className="text-amber-600">18%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[18%]" />
                    </div>
                  </div>

                  {/* ไวรัสตับอักเสบบี (เพิ่มเข้ามาให้ครบ 4 โรค) */}
                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-1">
                      <span className="text-slate-600">ไวรัสตับอักเสบบี (Hepatitis B)</span>
                      <span className="text-teal-600">3%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-full w-[3%]" />
                    </div>
                  </div>
                </div>

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