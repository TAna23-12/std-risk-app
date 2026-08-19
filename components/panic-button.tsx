'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function PanicButton() {
  const handlePanic = () => {
    window.location.replace('https://www.google.com');
  };

  return (
    <button
      onClick={handlePanic}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-full shadow-lg text-sm font-medium transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
      title="กดเพื่อสลับหน้าจอไป Google ทันที"
    >
      <ShieldAlert className="w-4 h-4" />
      <span>Panic Exit (ออกทันที)</span>
    </button>
  );
}