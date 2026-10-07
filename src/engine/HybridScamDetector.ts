import { BurmeseHeuristicsEngine } from './BurmeseHeuristicsEngine';
import { BurmeseNLPClassifier } from './BurmeseNLPClassifier';
import { BurmeseTextProcessor } from './BurmeseTextProcessor';
import { DetectionCategory, DetectionResult, ThreatLevel } from '../types/detector';

export class HybridScamDetector {
  private static readonly CATEGORY_LABELS_MY: Record<DetectionCategory, string> = {
    GAMBLING_BETTING: 'လောင်းကစား / ၂လုံး / ၃လုံး / စလော့လိမ်လည်မှု',
    FINANCIAL_IMPERSONATION: 'KBZPay / WavePay ဘဏ်အယောင်ဆောင် လိမ်လည်မှု',
    PHISHING_LINK: 'အန္တရာယ်ရှိသော Link / OTP ခိုးယူမှု',
    JOB_TASK_SCAM: 'အွန်လိုင်း အလုပ်ကြော်ငြာအတု / Like & Share လိမ်လည်မှု',
    LOTTERY_PRIZE: 'ကံစမ်းမဲပေါက်သည်ဟု လှည့်စားခြင်း',
    GENERAL_SPAM: 'အထွေထွေ မသင်္ကာဖွယ် မက်ဆေ့ခ်ျ',
    SAFE: 'စိတ်ချရသော မက်ဆေ့ခ်ျ'
  };

  /**
   * Evaluates text using Tier 1 (Heuristics) + Tier 2 (ML/NLP Model)
   */
  public static analyze(text: string): DetectionResult {
    const normalized = BurmeseTextProcessor.normalize(text);

    // 1. Tier 1: Regex & Heuristics
    const heuristicsResult = BurmeseHeuristicsEngine.inspect(normalized);

    // 2. Tier 2: On-device NLP Semantic Inference
    const nlpResult = BurmeseNLPClassifier.predict(normalized);

    // Combine signals
    const reasons: string[] = [];
    heuristicsResult.matchedRules.forEach(rule => {
      reasons.push(rule.descriptionMy);
    });

    // Whitelist / Safe check override (e.g. Official OTP notification without links)
    const isAuthenticOtpNotification = 
      /သင့်၏.*?otp.*?ကုဒ်မှာ\s*\d{4,6}/i.test(normalized) && 
      heuristicsResult.detectedUrls.length === 0 &&
      !/(?:ပေးပို့ပါ|မျှဝေပါ)/.test(normalized);

    if (isAuthenticOtpNotification) {
      return {
        threatLevel: 'SAFE',
        scamScore: 0.05,
        category: 'SAFE',
        categoryLabelMy: this.CATEGORY_LABELS_MY['SAFE'],
        reasons: ['တရားဝင် ပေးပို့သော OTP အသိပေးချက် (မည်သည့်ပြင်ပ Link မျှ မပါရှိပါ)'],
        detectedUrls: [],
        matchedKeywords: [],
        mlConfidence: 0.05,
        heuristicsConfidence: 0.0
      };
    }

    // Weighted fusion score: 60% Heuristics + 40% ML Semantics
    let fusedScore = (heuristicsResult.score * 0.6) + (nlpResult.scamProbability * 0.4);

    // If multiple high-risk heuristics match, elevate score directly
    if (heuristicsResult.matchedRules.length >= 2) {
      fusedScore = Math.max(fusedScore, 0.95);
    }

    // Determine category
    let finalCategory: DetectionCategory = 'SAFE';
    if (heuristicsResult.matchedRules.length > 0) {
      finalCategory = heuristicsResult.matchedRules[0].category;
    } else if (nlpResult.predictedCategory !== 'SAFE') {
      finalCategory = nlpResult.predictedCategory;
    }

    // Threat level categorization
    let threatLevel: ThreatLevel = 'SAFE';
    if (fusedScore >= 0.70) {
      threatLevel = 'CRITICAL_SCAM';
    } else if (fusedScore >= 0.40) {
      threatLevel = 'SUSPICIOUS';
      if (reasons.length === 0) {
        reasons.push('မသင်္ကာဖွယ် အသုံးအနှုန်းများ ပါဝင်နေသောကြောင့် သတိထားရန် လိုအပ်သည်');
      }
    }

    return {
      threatLevel,
      scamScore: Number(fusedScore.toFixed(2)),
      category: finalCategory,
      categoryLabelMy: this.CATEGORY_LABELS_MY[finalCategory],
      reasons,
      detectedUrls: heuristicsResult.detectedUrls,
      matchedKeywords: nlpResult.matchedTokens,
      mlConfidence: nlpResult.scamProbability,
      heuristicsConfidence: heuristicsResult.score
    };
  }
}
