'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Props {
  current: { hiv: number; syphilis: number; gonorrhea: number; hepatitisB: number };
  optimized: { hiv: number; syphilis: number; gonorrhea: number; hepatitisB: number };
}

export default function WhatIfGraph({ current, optimized }: Props) {
  const data = [
    { disease: 'HIV', ปัจจุบัน: current.hiv, ป้องกันเต็มรูปแบบ: optimized.hiv },
    { disease: 'ซิฟิลิส', ปัจจุบัน: current.syphilis, ป้องกันเต็มรูปแบบ: optimized.syphilis },
    { disease: 'หนองใน', ปัจจุบัน: current.gonorrhea, ป้องกันเต็มรูปแบบ: optimized.gonorrhea },
    { disease: 'ตับอักเสบบี', ปัจจุบัน: current.hepatitisB, ป้องกันเต็มรูปแบบ: optimized.hepatitisB },
  ];

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm mt-6">
      <h3 className="text-base font-bold text-slate-800 mb-1">
        แบบจำลองผลลัพธ์ What-If Simulation
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        เปรียบเทียบคะแนนความเสี่ยงปัจจุบัน กับคะแนนเมื่อปรับมาใช้ถุงยางทุกครั้งและรับประทาน Daily PrEP
      </p>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="disease" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
            <Bar dataKey="ปัจจุบัน" fill="#ef4444" radius={[6, 6, 0, 0]} />
            <Bar dataKey="ป้องกันเต็มรูปแบบ" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}