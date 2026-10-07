export type ThreatLevel = 'SAFE' | 'SUSPICIOUS' | 'CRITICAL_SCAM';

export type DetectionCategory = 
  | 'GAMBLING_BETTING'     // လောင်းကစား / 2D / 3D / Slot
  | 'FINANCIAL_IMPERSONATION' // WavePay / KBZPay / AYA / CB အကောင့်အတု
  | 'PHISHING_LINK'        // လင့်ခ်အတု / OTP ခိုးယူမှု
  | 'JOB_TASK_SCAM'        // Like & Share လုပ်ပြီး ငွေရမည် / အလုပ်ကြော်ငြာအတု
  | 'LOTTERY_PRIZE'        // ကံစမ်းမဲပေါက်သည် / ဆုငွေလိမ်လည်မှု
  | 'GENERAL_SPAM'
  | 'SAFE';

export interface DetectionResult {
  threatLevel: ThreatLevel;
  scamScore: number; // 0.0 - 1.0
  category: DetectionCategory;
  categoryLabelMy: string; // မြန်မာဘာသာ အညွှန်း
  reasons: string[]; // မြန်မာလို အသေးစိတ် ရှင်းလင်းချက်များ
  detectedUrls: string[];
  matchedKeywords: string[];
  mlConfidence: number;
  heuristicsConfidence: number;
}

export interface SmsMessage {
  id: string;
  sender: string;
  body: string;
  timestamp: number;
  analysis: DetectionResult;
  isRead: boolean;
}
