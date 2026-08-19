'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PanicButton from '@/components/panic-button';
import { Mail, Lock, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          router.push('/tracker');
        } else {
          setMessage('สร้างบัญชีสำเร็จ! หากระบบเปิดยืนยันอีเมล กรุณาตรวจสอบกล่องข้อความ');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        router.push('/tracker');
      }
    } catch (err: any) {
      setMessage(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <PanicButton />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้าแรก</span>
        </Link>

        <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs tracking-wider uppercase">
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy-First Account</span>
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
          {isSignUp ? 'สร้างบัญชีนิรนาม' : 'เข้าสู่ระบบบันทึกข้อมูล'}
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          ใช้เพียงอีเมลและรหัสผ่าน ไม่เก็บชื่อ ไม่เก็บบัตรประชาชน และไม่เก็บเบอร์โทรศัพท์
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                อีเมล (Email)
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                รหัสผ่าน (Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="รหัสผ่านอย่างน้อย 6 ตัวอักษร"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {message && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-xs sm:text-sm shadow transition disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'กำลังประมวลผล...' : isSignUp ? 'ลงทะเบียนสร้างโปรไฟล์' : 'เข้าสู่ระบบ'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage(null);
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
            >
              {isSignUp ? 'มีบัญชีแล้ว? คลิกเพื่อเข้าสู่ระบบ' : 'ยังไม่มีบัญชี? คลิกเพื่อสร้างโปรไฟล์ใหม่'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}