import Link from 'next/link';
import { ShieldCheck, Activity, MapPin, Pill, ArrowRight, Lock, Calendar } from 'lucide-react';
import PanicButton from '@/components/panic-button';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <PanicButton />

      {/* Hero Section */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold mb-4">
            <Lock className="w-3.5 h-3.5" /> ไม่เก็บข้อมูลส่วนบุคคล (100% Anonymous)
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            ระบบประเมินความเสี่ยงโรคติดต่อทางเพศสัมพันธ์
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            ประเมินความเสี่ยงเฉพาะบุคคล (HIV, ซิฟิลิส, หนองใน) พร้อมระบบวางแผนระยะเวลาตรวจที่แม่นยำ และค้นหาคลินิกตรวจนิรนามใกล้คุณ
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/assessment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-xl font-semibold shadow-md transition"
            >
              <span>เริ่มทำแบบประเมิน</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/clinics"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-6 py-3.5 rounded-xl font-semibold transition"
            >
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>ค้นหาคลินิก</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Feature Grid (4 การ์ดฟีเจอร์หลัก) */}
      <section className="max-w-4xl mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card 1: ประเมินความเสี่ยง */}
          <Link
            href="/assessment"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition block"
          >
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Multi-Factor Analysis</h2>
            <p className="mt-2 text-sm text-slate-600">
              วิเคราะห์ความเสี่ยงรายโรคด้วยอัลกอริทึมชั่งน้ำหนักตามระยะเวลา อาการ และประวัติการป้องกัน
            </p>
          </Link>

          {/* Card 2: ไทม์ไลน์นัดตรวจ */}
          <Link
            href="/timeline"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-rose-300 hover:shadow-md transition block"
          >
            <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Window Period Planner</h2>
            <p className="mt-2 text-sm text-slate-600">
              ระบบคำนวณและปักหมุดวันนัดตรวจโรคติดต่อทางเพศสัมพันธ์ตามระยะฟักตัวที่แม่นยำ
            </p>
          </Link>

          {/* Card 3: ค้นหาคลินิก */}
          <Link
            href="/clinics"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition block"
          >
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Clinic Directory</h2>
            <p className="mt-2 text-sm text-slate-600">
              ค้นหาคลินิกนิรนามและศูนย์บริการสาธารณสุขใกล้คุณ พร้อมพิกัดและการนำทาง
            </p>
          </Link>

          {/* Card 4: ติดตามการทานยา */}
          <Link
            href="/tracker"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition block"
          >
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <Pill className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Medication Tracker</h2>
            <p className="mt-2 text-sm text-slate-600">
              เครื่องมือช่วยติดตามการรับประทานยา PrEP / PEP เพื่อสร้างวินัยและเพิ่มประสิทธิภาพการป้องกัน
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}