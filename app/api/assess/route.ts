export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { calculateSTDRisk } from '@/lib/risk-calculator';
import { supabase } from '@/lib/supabase';
import { UserAssessmentInput } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, ...inputData }: { userId?: string } & UserAssessmentInput = body;

    // คำนวณความเสี่ยง
    const result = calculateSTDRisk(inputData);

    // ถ้ามี userId ส่งมา (ผู้ใช้ล็อกอิน) จึงจะบันทึกลง Database Supabase
    if (userId) {
      const insertPayload = {
        user_id: userId,
        overall_level: result.overallLevel,
        hiv_score: result.hiv.score,
        syphilis_score: result.syphilis.score,
        gonorrhea_score: result.gonorrhea.score,
        hepatitis_b_score: result.hepatitisB.score,
        days_since_exposure: inputData.daysSinceExposure,
        exposure_types: inputData.exposureTypes,
        condom_used: inputData.condomUsed,
        prep_status: inputData.prepPepStatus,
        symptoms: inputData.symptoms,
        is_emergency_pep: result.isEmergencyPEP,
      };

      const { error: dbError } = await supabase
        .from('assessment_logs')
        .insert([insertPayload]);

      if (dbError) {
        console.error('Database Insert Error:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}