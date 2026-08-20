'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Activity, Calendar, MapPin, Pill, 
  History, LogIn, LogOut, User as UserIcon,
  Menu, X, BarChart3, ShieldCheck
} from 'lucide-react';

// รายชื่ออีเมลแอดมินที่มีสิทธิ์เห็นปุ่ม
const ADMIN_EMAILS = ['uthaichuangchu@gmail.com'];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // ตรวจสอบ session ปัจจุบัน
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user ?? null);
    };

    checkAuth();

    // ฟัง event การ login / logout แบบ real-time
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // ปิดเมนูมือถืออัตโนมัติเมื่อเปลี่ยนหน้า
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setMobileMenuOpen(false);
    window.location.href = '/';
  };

  const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email);

  const navLinks = [
    { href: '/assessment', label: 'ประเมินความเสี่ยง', icon: Activity },
    { href: '/timeline', label: 'ปฏิทินนัดตรวจ', icon: Calendar },
    { href: '/clinics', label: 'ค้นหาคลินิก', icon: MapPin },
    { href: '/history', label: 'ประวัติประเมิน', icon: History },
    { href: '/tracker', label: 'บันทึกยา', icon: Pill },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* โลโก้แอป */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md group-hover:bg-indigo-700 transition">
            STD
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900">
            Risk<span className="text-indigo-600">Guard</span>
          </span>
        </Link>

        {/* เมนูตรงกลางสำหรับจอคอม (Desktop View) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* บัญชีผู้ใช้ & ปุ่ม Admin สำหรับจอคอม (Desktop View) */}
        <div className="hidden lg:flex items-center gap-2">
          {/* ปุ่ม Admin (แสดงเฉพาะเมื่อล็อกอินด้วยอีเมลแอดมิน) */}
          {isAdmin && (
            <Link
              href="/admin"
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition shadow-sm ${
                pathname === '/admin'
                  ? 'bg-slate-900 text-white ring-2 ring-indigo-500'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-100'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>แดชบอร์ดแอดมิน</span>
            </Link>
          )}

          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                href="/history"
                title="ดูประวัติการประเมินของคุณ"
                className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition"
              >
                <UserIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="max-w-[120px] truncate">{currentUser.email}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-full transition flex items-center gap-1 cursor-pointer"
                title="ออกจากระบบ"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>ออก</span>
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

        {/* เมนูฝั่งขวาสำหรับจอมือถือ (Mobile Hamburger Button) */}
        <div className="flex items-center gap-2 lg:hidden">
          {isAdmin && (
            <Link
              href="/admin"
              className="text-xs font-bold text-white bg-slate-900 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs"
            >
              <BarChart3 className="w-3 h-3 text-indigo-400" />
              <span>Admin</span>
            </Link>
          )}

          {currentUser && (
            <Link
              href="/history"
              className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full flex items-center gap-1"
            >
              <UserIcon className="w-3 h-3" />
              <span className="max-w-[70px] truncate">{currentUser.email.split('@')[0]}</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* เมนูดรอปดาวน์สำหรับจอมือถือ (Mobile Drawer) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* ลิงก์ Admin ในเมนูมือถือ */}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition ${
                  pathname === '/admin'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span>แดชบอร์ดแอดมิน (Admin Panel)</span>
              </Link>
            )}
          </nav>

          <div className="pt-3 border-t border-slate-100">
            {currentUser ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold text-rose-600 bg-rose-50 border border-rose-200 py-2.5 rounded-xl transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>ออกจากระบบ ({currentUser.email})</span>
              </button>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 py-2.5 rounded-xl transition shadow cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>เข้าสู่ระบบ / สมัครสมาชิก</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}