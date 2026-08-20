import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'ไม่พบ RESEND_API_KEY ในระบบ' }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const body = await request.json();
    const { toEmail, recordData, evaluatedAt } = body;

    if (!toEmail) {
      return NextResponse.json({ error: 'กรุณาระบุอีเมลผู้รับ' }, { status: 400 });
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="text-align: center; color: #0f172a;">ใบสรุปประวัติความเสี่ยงเพื่อประกอบการคัดกรองเบื้องต้น</h2>
        <p style="text-align: center; font-size: 12px; color: #64748b;">STD RiskGuard Clinical Screening Summary</p>
        <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 15px 0;" />
        <p><strong>วันที่ประเมิน:</strong> ${evaluatedAt}</p>
        <p><strong>ระดับความเสี่ยงโดยรวม:</strong> <span style="color: red; font-weight: bold;">${recordData.overall_level}</span></p>
        <p><strong>ระยะเวลาสัมผัสเชื้อ:</strong> ${recordData.days_since_exposure} วัน</p>
        <h3 style="margin-top: 20px;">คะแนนความเสี่ยงจำแนกรายโรค:</h3>
        <ul>
          <li>เชื้อเอชไอวี (HIV): <strong>${recordData.hiv_score}%</strong></li>
          <li>โรคซิฟิลิส (Syphilis): <strong>${recordData.syphilis_score}%</strong></li>
          <li>หนองใน (Gonorrhea): <strong>${recordData.gonorrhea_score}%</strong></li>
          <li>ไวรัสตับอักเสบบี (Hepatitis B): <strong>${recordData.hepatitis_b_score}%</strong></li>
        </ul>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: 'STD RiskGuard <onboarding@resend.dev>',
      to: [toEmail],
      subject: `[STD RiskGuard] ใบสรุปประวัติความเสี่ยง (${evaluatedAt})`,
      html: emailHtml,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server Error' }, { status: 500 });
  }
}