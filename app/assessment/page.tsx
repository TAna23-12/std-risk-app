'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserAssessmentInput, ExposureType } from '@/types';
import { supabase } from '@/lib/supabase';
import PanicButton from '@/components/panic-button';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert, Sparkles, Activity } from 'lucide-react';

export default function AssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<UserAssessmentInput>({
    daysSinceExposure: 1,
    exposureTypes: ['VAGINAL_RECEPTIVE'],
    condomUsed: 'NONE',
    prepPepStatus: 'NONE',
    partnerRisk: 'UNKNOWN',
    substanceInvolved: false,
    previousSTIHistory: false,
    symptoms: [],
  });

  const toggleExposure = (type: ExposureType) => {
    setFormData((prev) => {
      const exists = prev.exposureTypes.includes(type);
      if (exists) {
        if (prev.exposureTypes.length === 1) return prev;
        return { ...prev, exposureTypes: prev.exposureTypes.filter((t) => t !== type) };
      }
      return { ...prev, exposureTypes: [...prev.exposureTypes, type] };
    });
  };

  const toggleSymptom = (key: string) => {
    setFormData((prev) => {
      const exists = prev.symptoms.includes(key);
      return {
        ...prev,
        symptoms: exists ? prev.symptoms.filter((s) => s !== key) : [...prev.symptoms, key],
      };
    });
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 1. ดึง session ผู้ใช้ปัจจุบัน (ถ้ามี)
      const { data: { user } } = await supabase.auth.getUser();

      // 2. ส่งข้อมูลพร้อม userId ไปยัง Backend API Route
      const response = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user ? user.id : null,
        }),
      });

      const resData = await response.json();

      if (resData.success) {
        localStorage.setItem('latest_assessment_input', JSON.stringify(formData));
        localStorage.setItem('latest_assessment_result', JSON.stringify(resData.data));
        router.push('/results');
      } else {
        alert('เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Submit Error:', err);
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 pb-20">
      <PanicButton />

      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
            <span className="flex items-center gap-1.5 text-indigo-600">
              <Activity className="w-4 h-4" /> ขั้นตอนที่ {step} จาก 5
            </span>
            <span>{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: ระยะเวลา */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">เหตุการณ์เสี่ยงเกิดขึ้นเมื่อกี่วันที่แล้ว?</h2>
              <p className="text-sm text-slate-500 mt-1">
                การนับวันมีความสำคัญต่อการพิจารณายาต้านไวรัสฉุกเฉิน PEP (ภายใน 72 ชม.) และการตรวจ Window Period
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-4">
              <div className="text-4xl font-extrabold text-indigo-600">
                {formData.daysSinceExposure} <span className="text-lg font-normal text-slate-500">วัน</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                value={formData.daysSinceExposure}
                onChange={(e) => setFormData({ ...formData, daysSinceExposure: parseInt(e.target.value) || 0 })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>0 วัน (วันนี้)</span>
                <span>30 วัน</span>
                <span>90+ วัน</span>
              </div>
            </div>

            {formData.daysSinceExposure <= 3 && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-800 leading-relaxed">
                  <strong>อยู่ในกรอบ 72 ชั่วโมง:</strong> หากมีความเสี่ยงสูง สามารถรับยาต้านฉุกเฉิน (PEP) ได้ทันทีที่คลินิกหรือ รพ. ใกล้บ้าน
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: ลักษณะกิจกรรมทางเพศ */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">ลักษณะกิจกรรมทางเพศ (เลือกได้หลายข้อ)</h2>
              <p className="text-sm text-slate-500 mt-1">ลักษณะทางกายวิภาคและการสัมผัสเยื่อบุส่งผลต่ออัตราการแพร่เชื้อที่ต่างกัน</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { type: 'ANAL_RECEPTIVE', label: 'ทวารหนัก - ฝ่ายรับ (Bottom)', desc: 'เยื่อบุมีโอกาสเกิดรอยถลอกและรับเชื้อสูง' },
                { type: 'ANAL_INSERTIVE', label: 'ทวารหนัก - ฝ่ายรุก (Top)', desc: 'สอดใส่ทางทวารหนัก' },
                { type: 'VAGINAL_RECEPTIVE', label: 'ช่องคลอด - ฝ่ายรับ', desc: 'การมีเพศสัมพันธ์ทางช่องคลอด' },
                { type: 'VAGINAL_INSERTIVE', label: 'ช่องคลอด - ฝ่ายรุก', desc: 'การสอดใส่ทางช่องคลอด' },
                { type: 'ORAL_GIVING', label: 'ออรัลเซ็กส์ - ผู้ใช้ปากให้คู่นอน', desc: 'เสี่ยงต่อหนองในและซิฟิลิสในลำคอ' },
                { type: 'ORAL_RECEIVING', label: 'ออรัลเซ็กส์ - ผู้ถูกทำออรัล', desc: 'ความเสี่ยง HIV ต่ำมาก' },
              ].map((item) => {
                const checked = formData.exposureTypes.includes(item.type as ExposureType);
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => toggleExposure(item.type as ExposureType)}
                    className={`p-4 rounded-2xl border text-left transition ${
                      checked
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">{item.label}</span>
                      <CheckCircle2 className={`w-4 h-4 ${checked ? 'text-indigo-600' : 'text-slate-300'}`} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: ประวัติการป้องกัน & ยา */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">การป้องกันระหว่างกิจกรรม</h2>
              <p className="text-sm text-slate-500 mt-1">ข้อมูลความต่อเนื่องของการใช้ถุงยางและการรับประทานยา</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">การใช้ถุงยางอนามัย</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'ALWAYS', label: 'ใช้ตลอด/ไม่หลุด' },
                  { key: 'BROKEN', label: 'ถุงแตก / หลุด' },
                  { key: 'INCONSISTENT', label: 'ใส่แค่บางช่วง' },
                  { key: 'NONE', label: 'ไม่ได้ใช้' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, condomUsed: item.key as any })}
                    className={`p-3 rounded-xl border text-xs font-semibold transition text-center ${
                      formData.condomUsed === item.key
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">สถานะการทานยา PrEP / PEP</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { key: 'DAILY_PREP', label: 'Daily PrEP (ทานต่อเนื่องทุกวัน)', desc: 'ป้องกัน HIV ได้ >99%' },
                  { key: 'ON_DEMAND_PREP', label: 'PrEP on Demand (สูตร 2-1-1)', desc: 'ทานยาครบตามเวลาที่กำหนด' },
                  { key: 'PEP', label: 'กำลังทานยา PEP ครบตามแพทย์สั่ง', desc: 'ยาต้านฉุกเฉินหลังสัมผัสเชื้อ' },
                  { key: 'NONE', label: 'ไม่ได้ทานยาป้องกันใดๆ', desc: 'ไม่มีการป้องกันด้วยยาต้านไวรัส' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, prepPepStatus: item.key as any })}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      formData.prepPepStatus === item.key
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <p className="text-xs font-bold">{item.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: ข้อมูลคู่นอน & ปัจจัยแวดล้อม */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">ข้อมูลคู่นอนและปัจจัยเสริม</h2>
              <p className="text-sm text-slate-500 mt-1">ประเมินจากข้อมูลที่คุณทราบ ไม่จำเป็นต้องระบุตัวตน</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">สถานะผลตรวจของคู่นอน</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { key: 'HIV_UNDETECTABLE', label: 'มีเชื้อแต่ตรวจไม่พบ (U=U)', desc: 'Undetectable = Untransmittable (ไม่ส่งต่อ)' },
                  { key: 'LOW_NEGATIVE', label: 'ผลเป็นลบแน่นอน (Negative)', desc: 'มีผลตรวจเลือดชัดเจนล่าสุด' },
                  { key: 'UNKNOWN', label: 'ไม่ทราบสถานะผลเลือด', desc: 'คู่นอนนิรนาม หรือไม่ได้ตรวจล่าสุด' },
                  { key: 'HIGH_POSITIVE', label: 'ผลเป็นบวกและไม่ได้รักษา', desc: 'มีเชื้อ HIV หรือมีความเสี่ยงสูงมาก' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, partnerRisk: item.key as any })}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      formData.partnerRisk === item.key
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <p className="text-xs font-bold">{item.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">ปัจจัยพฤติกรรมเสริม</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, substanceInvolved: !formData.substanceInvolved })}
                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between text-xs sm:text-sm font-semibold transition ${
                  formData.substanceInvolved ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>มีการใช้แอลกอฮอล์หนัก หรือสารเสพติด/ChemSex ร่วมด้วย</span>
                <CheckCircle2 className={`w-4 h-4 ${formData.substanceInvolved ? 'text-amber-600' : 'text-slate-300'}`} />
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, previousSTIHistory: !formData.previousSTIHistory })}
                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between text-xs sm:text-sm font-semibold transition ${
                  formData.previousSTIHistory ? 'border-indigo-500 bg-indigo-50 text-indigo-900' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>เคยมีประวัติเป็นโรคติดต่อทางเพศสัมพันธ์ในรอบ 12 เดือนที่ผ่านมา</span>
                <CheckCircle2 className={`w-4 h-4 ${formData.previousSTIHistory ? 'text-indigo-600' : 'text-slate-300'}`} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: อาการทางกายภาพ */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">มีอาการทางกายภาพเหล่านี้หรือไม่?</h2>
              <p className="text-sm text-slate-500 mt-1">เลือกได้หลายข้อ (หากไม่มีอาการใดๆ ให้กดปุ่ม "ประมวลผลลัพธ์" ได้เลย)</p>
            </div>

            <div className="space-y-2.5">
              {[
                { key: 'discharge', label: 'มีหนองหรือของเหลวผิดปกติไหลจากท่อปัสสาวะ/ช่องคลอด', tag: 'เสี่ยงหนองใน' },
                { key: 'burning_urination', label: 'รู้สึกแสบขัดเวลาปัสสาวะ หรือปัสสาวะบ่อยผิดปกติ', tag: 'เสี่ยงหนองใน' },
                { key: 'painless_sore', label: 'มีแผลริมแข็ง ไม่เจ็บ บริเวณอวัยวะเพศ ปาก หรือรอบทวาร', tag: 'เสี่ยงซิฟิลิส' },
                { key: 'rash_palms_soles', label: 'มีผื่นแดงคล้ายดอกกุหลาบขึ้นตามฝ่ามือ ฝ่าเท้า หรือลำตัว', tag: 'เสี่ยงซิฟิลิสระยะที่ 2' },
                { key: 'fever_flu', label: 'มีไข้สูง หนาวสั่น ต่อมน้ำเหลืองโต เจ็บคอ ผื่นคัน (เหมือนไข้หวัดใหญ่)', tag: 'เสี่ยง HIV เฉียบพลัน' },
                { key: 'jaundice', label: 'ตาเหลือง ตัวเหลือง ปัสสาวะสีเข้ม หรืออ่อนเพลียผิดปกติ', tag: 'เสี่ยงตับอักเสบ' },
              ].map((symptom) => {
                const checked = formData.symptoms.includes(symptom.key);
                return (
                  <button
                    key={symptom.key}
                    type="button"
                    onClick={() => toggleSymptom(symptom.key)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition ${
                      checked
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="text-xs sm:text-sm font-semibold">{symptom.label}</p>
                      <span className="text-[10px] text-slate-400 font-medium">{symptom.tag}</span>
                    </div>
                    <CheckCircle2 className={`w-5 h-5 ${checked ? 'text-indigo-600' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ย้อนกลับ</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow transition cursor-pointer"
            >
              <span>ถัดไป</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3 rounded-xl text-sm font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'กำลังประมวลผล...' : 'ประมวลผลลัพธ์ระดับคลินิก'}</span>
            </button>
          )}
        </div>
      </div>
    </main>
  );
}