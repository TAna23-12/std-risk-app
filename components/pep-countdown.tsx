'use client';

import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

interface Props {
  daysSinceExposure: number;
}

export default function PepCountdown({ daysSinceExposure }: Props) {
  const hoursPassed = daysSinceExposure * 24;
  const hoursLeft = Math.max(0, 72 - hoursPassed);

  if (daysSinceExposure > 3) return null;

  return (
    <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 mb-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-rose-500 text-white rounded-xl">
          <AlertTriangle className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h3 className="text-base font-bold text-rose-900">
            กรอบเวลาฉุกเฉินยาต้านไวรัส PEP (72 ชั่วโมง)
          </h3>
          <p className="text-xs text-rose-700 mt-0.5">
            ยา PEP ต้องเริ่มรับประทานภายใน 72 ชม. หลังสัมผัสเชื้อเพื่อประสิทธิผลสูงสุด
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between bg-white rounded-xl p-3.5 border border-rose-200">
        <div className="flex items-center gap-2 text-rose-800 font-semibold text-sm">
          <Clock className="w-4 h-4" />
          <span>เวลาที่เหลือโดยประมาณ:</span>
        </div>
        <span className="text-lg sm:text-xl font-extrabold text-rose-600 bg-rose-100 px-3 py-1 rounded-lg">
          ~ {hoursLeft} ชั่วโมง
        </span>
      </div>
    </div>
  );
}