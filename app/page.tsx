'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Activity, MapPin, Pill, ArrowRight, 
  Lock, Calendar, CheckCircle2, Sparkles, Shield
} from 'lucide-react';
import PanicButton from '@/components/panic-button';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <PanicButton />

      {/* Hero Section with Ambient Glow & Subtle Texture */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-16 pb-20 px-4 sm:px-6">
        {/* Background Decorative Glow Layer */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="w-[620px] h-[360px] bg-gradient-to-tr from-indigo-300/30 via-purple-200/30 to-blue-200/30 blur-[110px] rounded-full" />
          <div 
            className="absolute inset-0 opacity-[0.035]" 
            style={{
              backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }} 
          />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Top Anonymous Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-4 py-1.5 rounded-full text-emerald-800 text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Lock className="w-3.5 h-3.5" />
            <span>ไม่เก็บข้อมูลส่วนบุคคล (100% Anonymous & Secure)</span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            ระบบประเมินความเสี่ยง <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 bg-clip-text text-transparent">
              โรคติดต่อทางเพศสัมพันธ์
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            ประเมินความเสี่ยงเฉพาะบุคคล (HIV, ซิฟิลิส, หนองใน, ไวรัสตับอักเสบบี) พร้อมระบบวางแผนระยะเวลาตรวจที่แม่นยำ 
            และค้นหาคลินิกตรวจนิรนามใกล้คุณ
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/assessment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3.5 rounded-2xl font-bold text-sm shadow-md hover:shadow-indigo-200 transition cursor-pointer"
            >
              <span>เริ่มทำแบบประเมิน</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/clinics"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xs transition cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>ค้นหาคลินิก</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 max-w-xl mx-auto border-t border-slate-100 gap-3 text-xs text-slate-500 font-semibold">
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>มาตรฐานแนวทาง CDC</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Clinical Algorithm</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>ใช้งานฟรี ไม่ต้องระบุตัวตน</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid (4 การ์ดฟีเจอร์หลัก) */}
      <section className="max-w-4xl mx-auto px-4 mt-12">
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            ฟังก์ชันการให้บริการหลัก
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Card 1: ประเมินความเสี่ยง */}
          <Link
            href="/assessment"
            className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-md transition block"
          >
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">
              Multi-Factor Analysis
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              วิเคราะห์ความเสี่ยงรายโรคด้วยอัลกอริทึมชั่งน้ำหนักตามระยะเวลา อาการผิดปกติ และประวัติการป้องกัน
            </p>
          </Link>

          {/* Card 2: ไทม์ไลน์นัดตรวจ */}
          <Link
            href="/timeline"
            className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-rose-400 hover:shadow-md transition block"
          >
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition">
              Window Period Planner
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              ระบบคำนวณและปักหมุดวันนัดตรวจโรคติดต่อทางเพศสัมพันธ์ตามระยะฟักตัวและวิธีตรวจที่แม่นยำ
            </p>
          </Link>

          {/* Card 3: ค้นหาคลินิก */}
          <Link
            href="/clinics"
            className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition block"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
              Clinic Directory
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              ค้นหาคลินิกนิรนามและศูนย์บริการสาธารณสุขใกล้คุณ พร้อมพิกัดและการนำทางแบบเรียลไทม์
            </p>
          </Link>

          {/* Card 4: ติดตามการทานยา */}
          <Link
            href="/tracker"
            className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition block"
          >
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition">
              <Pill className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition">
              Medication Tracker
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              เครื่องมือช่วยติดตามการรับประทานยา PrEP / PEP เพื่อสร้างวินัยและประเมินกรณีลืมทานยา
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}