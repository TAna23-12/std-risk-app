'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Activity, Calendar, MapPin, Pill, 
  ShieldCheck, LogIn, LogOut, User as UserIcon 
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // เช็กสถานะการล็อกอิน
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };

    checkAuth();

    // ฟัง Event เมื่อผู้ใช้ Login หรือ Logout แบบ Real-time
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    router.push('/');
  };

  const navLinks = [
    { href: '/assessment', label: 'ประเมินความเสี่ยง', icon: Activity },
    { href: '/timeline', label: 'ปฏิทินนัดตรวจ', icon: Calendar },
    { href: '/clinics', label: 'ค้นหาคลินิก', icon: MapPin },
    { href: '/tracker', label: 'บันทึกยา', icon: Pill },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* โลโก้แอป */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md group-hover:bg-indigo-700 transition">
            STD
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900">
            Risk<span className="text-indigo-600">Guard</span>
          </span>
        </Link>

        {/* เมนูหลัก & ปุ่ม Auth */}
        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="h-5 w-px bg-slate-200 mx-1 hidden md:block" />

          {/* แสดงสถานะล็อกอิน */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                href="/tracker"
                className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-slate-200 transition"
              >
                <UserIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="max-w-[120px] truncate">{currentUser.email}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 border border-rose-200 p-1.5 sm:px-3 sm:py-1.5 rounded-full transition flex items-center gap-1 cursor-pointer"
                title="ออกจากระบบ"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ออก</span>
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 rounded-xl transition shadow cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>เข้าสู่ระบบ</span>
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}