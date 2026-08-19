export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ExposureType = 
  | 'ANAL_RECEPTIVE' 
  | 'ANAL_INSERTIVE' 
  | 'VAGINAL_RECEPTIVE' 
  | 'VAGINAL_INSERTIVE' 
  | 'ORAL_GIVING' 
  | 'ORAL_RECEIVING';

export type CondomUsage = 'ALWAYS' | 'BROKEN' | 'INCONSISTENT' | 'NONE';

export type PrepStatus = 'DAILY_PREP' | 'ON_DEMAND_PREP' | 'PEP' | 'NONE';

export type PartnerRisk = 'HIV_UNDETECTABLE' | 'LOW_NEGATIVE' | 'UNKNOWN' | 'HIGH_POSITIVE';

export interface UserAssessmentInput {
  daysSinceExposure: number;
  exposureTypes: ExposureType[];
  condomUsed: CondomUsage;
  prepPepStatus: PrepStatus;
  partnerRisk: PartnerRisk;
  substanceInvolved: boolean;
  previousSTIHistory: boolean;
  symptoms: string[];
}

export interface DiseaseRiskDetail {
  score: number;
  level: RiskLevel;
  windowPeriodDays: {
    min: number;
    ideal: number;
    conclusive: number;
  };
  recommendedActions: string[];
}

export interface AssessmentResult {
  hiv: DiseaseRiskDetail;
  syphilis: DiseaseRiskDetail;
  gonorrhea: DiseaseRiskDetail;
  hepatitisB: DiseaseRiskDetail;
  overallLevel: RiskLevel;
  isEmergencyPEP: boolean;
}

// Alias สำหรับหน้าที่เรียกใช้ชื่อ RiskEvaluationResult
export type RiskEvaluationResult = AssessmentResult;