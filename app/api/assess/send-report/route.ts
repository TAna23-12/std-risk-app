import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { toEmail, recordData, evaluatedAt } = body;

    if (!toEmail) {
      return NextResponse.json({ error: 'ไม่พบที่อยู่อีเมลผู้รับ' }, { status: 400 });
    }

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 16px; color: #0f172a; background-color: #ffffff;">
        
        <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 14px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #0f172a; font-size: 18px; font-weight: 800;">แบบสรุปข้อมูลประวัติความเสี่ยงเพื่อประกอบการคัดกรองเบื้องต้น</h2>
          <p style="font-size: 12px; color: #64748b; margin-top: 4px; margin-bottom: 0;">(STD RiskGuard Clinical Screening Handover Summary)</p>
          <div style="font-size: 11px; color: #475569; margin-top: 12px; display: flex; justify-content: space-between;">
            <span><strong>วันที่ประเมิน:</strong> ${evaluatedAt}</span>
            <span><strong>สถานะ:</strong> ข้อมูลส่วนบุคคล (Confidential)</span>
          </div>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; border-radius: 8px; font-size: 12px; line-height: 1.6; margin-bottom: 20px; color: #334155;">
          <strong>หมายเหตุถึงบุคลากรทางการแพทย์:</strong> ผู้รับบริการได้บันทึกข้อมูลประวัติความเสี่ยงล่วงหน้าผ่านระบบ STD RiskGuard เพื่อความสะดวกรวดเร็วและลดความกังวลในการซักประวัติ สามารถใช้ข้อมูลนี้ประกอบการพิจารณาส่งตรวจได้ทันที
        </div>

        <h3 style="font-size: 13px; font-weight: 700; margin-bottom: 8px; color: #0f172a;">1. ข้อมูลการสัมผัสเชื้อและประวัติเสี่ยง</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px; border: 1px solid #0f172a;">
          <tr style="border-bottom: 1px solid #0f172a;">
            <td style="padding: 8px; font-weight: bold; width: 35%; background: #f1f5f9; border-right: 1px solid #0f172a;">ระยะเวลาสัมผัสเชื้อ</td>
            <td style="padding: 8px;">${recordData.days_since_exposure} วันที่ผ่านมา (${recordData.days_since_exposure * 24} ชั่วโมง)</td>
          </tr>
          <tr style="border-bottom: 1px solid #0f172a;">
            <td style="padding: 8px; font-weight: bold; background: #f1f5f9; border-right: 1px solid #0f172a;">ระดับความเสี่ยงรวม</td>
            <td style="padding: 8px; font-weight: bold; color: #dc2626;">${recordData.overall_level}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background: #f1f5f9; border-right: 1px solid #0f172a;">อาการที่ระบุ</td>
            <td style="padding: 8px;">${recordData.symptoms && recordData.symptoms.length > 0 ? recordData.symptoms.join(', ') : 'ไม่มีอาการผิดปกติในขณะนี้'}</td>
          </tr>
        </table>

        <h3 style="font-size: 13px; font-weight: 700; margin-bottom: 8px; color: #0f172a;">2. ผลการวิเคราะห์ระดับความเสี่ยงจำแนกรายโรค</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px; border: 1px solid #0f172a;">
          <tr style="background: #f1f5f9; border-bottom: 1px solid #0f172a; text-align: left;">
            <th style="padding: 8px; border-right: 1px solid #0f172a;">เชื้อก่อโรค / สภาวะ</th>
            <th style="padding: 8px; text-align: center; border-right: 1px solid #0f172a; width: 25%;">คะแนนความเสี่ยง</th>
            <th style="padding: 8px;">แนวทางตรวจแนะนำ</th>
          </tr>
          <tr style="border-bottom: 1px solid #0f172a;">
            <td style="padding: 8px; border-right: 1px solid #0f172a; font-weight: 600;">เชื้อเอชไอวี (HIV)</td>
            <td style="padding: 8px; text-align: center; font-weight: bold; border-right: 1px solid #0f172a;">${recordData.hiv_score}%</td>
            <td style="padding: 8px; font-size: 11px;">ตรวจด้วย 4th Gen Ag/Ab Combo Test หรือ NAT</td>
          </tr>
          <tr style="border-bottom: 1px solid #0f172a;">
            <td style="padding: 8px; border-right: 1px solid #0f172a; font-weight: 600;">โรคซิฟิลิส (Syphilis)</td>
            <td style="padding: 8px; text-align: center; font-weight: bold; border-right: 1px solid #0f172a;">${recordData.syphilis_score}%</td>
            <td style="padding: 8px; font-size: 11px;">ตรวจหาแอนติบอดีด้วย RPR / VDRL / TPPA</td>
          </tr>
          <tr style="border-bottom: 1px solid #0f172a;">
            <td style="padding: 8px; border-right: 1px solid #0f172a; font-weight: 600;">หนองในแท้ / เทียม (Gonorrhea)</td>
            <td style="padding: 8px; text-align: center; font-weight: bold; border-right: 1px solid #0f172a;">${recordData.gonorrhea_score}%</td>
            <td style="padding: 8px; font-size: 11px;">ตรวจปัสสาวะหรือป้ายสิ่งส่งตรวจด้วย NAATs / PCR</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-right: 1px solid #0f172a; font-weight: 600;">ไวรัสตับอักเสบบี (Hepatitis B)</td>
            <td style="padding: 8px; text-align: center; font-weight: bold; border-right: 1px solid #0f172a;">${recordData.hepatitis_b_score}%</td>
            <td style="padding: 8px; font-size: 11px;">ตรวจคัดกรอง HBsAg และ Anti-HBs</td>
          </tr>
        </table>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 10px; color: #94a3b8; text-align: center;">
          * เอกสารนี้สร้างขึ้นโดยระบบอัตโนมัติจาก STD RiskGuard เพื่อใช้ประกอบการเข้าตรวจเท่านั้น
        </div>
      </div>
    `;

    const data = await resend.emails.send({
      from: 'STD RiskGuard <onboarding@resend.dev>',
      to: [toEmail],
      subject: `[STD RiskGuard] ใบสรุปประวัติความเสี่ยงเพื่อยื่นตรวจ (${evaluatedAt})`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาดในการส่งอีเมล' }, { status: 500 });
  }
}