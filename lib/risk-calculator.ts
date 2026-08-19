import { UserAssessmentInput, AssessmentResult, RiskLevel, DiseaseRiskDetail } from '@/types';

export function calculateSTDRisk(input: UserAssessmentInput): AssessmentResult {
  // ตรวจสอบเงื่อนไขยาฉุกเฉิน PEP (ภายใน 72 ชม. + ไม่ได้ใช้ PrEP + มีความเสี่ยงต่อ HIV)
  const isEmergencyPEP = 
    input.daysSinceExposure <= 3 && 
    input.prepPepStatus === 'NONE' && 
    (input.condomUsed === 'NONE' || input.condomUsed === 'BROKEN') &&
    input.partnerRisk !== 'HIV_UNDETECTABLE' &&
    input.partnerRisk !== 'LOW_NEGATIVE';

  // 1. Base Score ตามลักษณะกิจกรรมทางเพศ (Acts Weighting)
  let baseScore = 10;
  if (input.exposureTypes.includes('ANAL_RECEPTIVE')) baseScore += 40; // ฝ่ายรับความเสี่ยงเยื่อบุสูงสุด
  else if (input.exposureTypes.includes('VAGINAL_RECEPTIVE')) baseScore += 25;
  else if (input.exposureTypes.includes('ANAL_INSERTIVE')) baseScore += 20;
  else if (input.exposureTypes.includes('VAGINAL_INSERTIVE')) baseScore += 15;
  else if (input.exposureTypes.includes('ORAL_GIVING')) baseScore += 5;

  // 2. ปัจจัยถุงยางอนามัย
  if (input.condomUsed === 'NONE') baseScore += 30;
  else if (input.condomUsed === 'BROKEN') baseScore += 25;
  else if (input.condomUsed === 'INCONSISTENT') baseScore += 15;
  else if (input.condomUsed === 'ALWAYS') baseScore = Math.max(5, baseScore - 35);

  // 3. ปัจจัยสถานะคู่นอน & U=U (Undetectable = Untransmittable)
  if (input.partnerRisk === 'HIGH_POSITIVE') baseScore += 35;
  else if (input.partnerRisk === 'UNKNOWN') baseScore += 15;
  else if (input.partnerRisk === 'HIV_UNDETECTABLE') baseScore = Math.min(baseScore, 10); // U=U ความเสี่ยง HIV ส่งต่อเป็นศูนย์

  // 4. ปัจจัยร่วม: แอลกอฮอล์/สารเคมี & ประวัติ STI เดิม
  if (input.substanceInvolved) baseScore += 10;
  if (input.previousSTIHistory) baseScore += 10;

  // 5. คำนวณรายโรค (Individual Disease Weighting)
  // --- HIV ---
  let hivScore = baseScore;
  if (input.partnerRisk === 'HIV_UNDETECTABLE') {
    hivScore = 0; // U=U
  } else if (input.prepPepStatus === 'DAILY_PREP') {
    hivScore = Math.round(hivScore * 0.05); // ประสิทธิภาพ PrEP ~99%
  } else if (input.prepPepStatus === 'ON_DEMAND_PREP') {
    hivScore = Math.round(hivScore * 0.1);
  } else if (input.prepPepStatus === 'PEP') {
    hivScore = Math.round(hivScore * 0.2);
  }
  if (input.symptoms.includes('fever_flu') && input.daysSinceExposure >= 14) {
    hivScore += 25;
  }

  // --- Syphilis (ซิฟิลิส) ---
  let syphilisScore = baseScore;
  if (input.symptoms.includes('painless_sore')) syphilisScore += 45;
  if (input.symptoms.includes('rash_palms_soles')) syphilisScore += 35;

  // --- Gonorrhea & Chlamydia (หนองในแท้/เทียม) ---
  let gonorrheaScore = baseScore;
  if (input.exposureTypes.includes('ORAL_GIVING') || input.exposureTypes.includes('ORAL_RECEIVING')) gonorrheaScore += 15;
  if (input.symptoms.includes('discharge')) gonorrheaScore += 45;
  if (input.symptoms.includes('burning_urination')) gonorrheaScore += 35;

  // --- Hepatitis B (ไวรัสตับอักเสบบี) ---
  let hepBScore = Math.round(baseScore * 0.8);
  if (input.symptoms.includes('jaundice')) hepBScore += 50;

  const getLevel = (score: number): RiskLevel => {
    if (score >= 70) return 'CRITICAL';
    if (score >= 45) return 'HIGH';
    if (score >= 25) return 'MEDIUM';
    return 'LOW';
  };

  const createDetail = (
    score: number,
    diseaseName: string,
    windowPeriod: { min: number; ideal: number; conclusive: number }
  ): DiseaseRiskDetail => {
    const finalScore = Math.min(100, Math.max(0, score));
    const level = getLevel(finalScore);
    const actions: string[] = [];

    if (level === 'CRITICAL' || level === 'HIGH') {
      actions.push(`พบแพทย์หรือคลินิกเฉพาะทางเพื่อตรวจ ${diseaseName} ทันที`);
      actions.push('งดการมีเพศสัมพันธ์จนกว่าจะได้รับการยืนยันผลตรวจ');
    } else if (level === 'MEDIUM') {
      actions.push(`วางแผนตรวจคัดกรอง ${diseaseName} ในช่วงวันที่แนะนำ (${windowPeriod.ideal} วันขึ้นไป)`);
      actions.push('ใช้ถุงยางอนามัยทุกครั้ง');
    } else {
      actions.push(`ความเสี่ยงต่ำ แนะนำตรวจคัดกรองสุขภาพทางเพศประจำปี`);
    }

    return {
      score: finalScore,
      level,
      windowPeriodDays: windowPeriod,
      recommendedActions: actions,
    };
  };

  const hivDetail = createDetail(hivScore, 'HIV', { min: 7, ideal: 28, conclusive: 90 });
  const syphilisDetail = createDetail(syphilisScore, 'ซิฟิลิส', { min: 28, ideal: 30, conclusive: 90 });
  const gonorrheaDetail = createDetail(gonorrheaScore, 'หนองใน', { min: 2, ideal: 7, conclusive: 14 });
  const hepBDetail = createDetail(hepBScore, 'ไวรัสตับอักเสบบี', { min: 30, ideal: 60, conclusive: 180 });

  const maxScore = Math.max(hivDetail.score, syphilisDetail.score, gonorrheaDetail.score, hepBDetail.score);

  return {
    hiv: hivDetail,
    syphilis: syphilisDetail,
    gonorrhea: gonorrheaDetail,
    hepatitisB: hepBDetail,
    overallLevel: getLevel(maxScore),
    isEmergencyPEP,
  };
}

export function simulateRiskReduction(currentInput: UserAssessmentInput) {
  const currentResult = calculateSTDRisk(currentInput);

  const optimizedInput: UserAssessmentInput = {
    ...currentInput,
    condomUsed: 'ALWAYS',
    prepPepStatus: 'DAILY_PREP',
    substanceInvolved: false,
  };

  const optimizedResult = calculateSTDRisk(optimizedInput);

  return {
    current: {
      hiv: currentResult.hiv.score,
      syphilis: currentResult.syphilis.score,
      gonorrhea: currentResult.gonorrhea.score,
      hepatitisB: currentResult.hepatitisB.score,
    },
    optimized: {
      hiv: optimizedResult.hiv.score,
      syphilis: optimizedResult.syphilis.score,
      gonorrhea: optimizedResult.gonorrhea.score,
      hepatitisB: optimizedResult.hepatitisB.score,
    },
  };
}