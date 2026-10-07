import { BurmeseTextProcessor } from './BurmeseTextProcessor';
import { DetectionCategory } from '../types/detector';

interface ModelVocabulary {
  [token: string]: {
    scamCount: number;
    hamCount: number;
    category?: DetectionCategory;
  };
}

/**
 * On-Device Burmese NLP Bayesian & Intent Classifier.
 * This runs 100% locally on the device without network requests,
 * utilizing Burmese syllable-level N-gram feature representation.
 */
export class BurmeseNLPClassifier {
  private static totalScamDocs = 420;
  private static totalHamDocs = 380;
  private static vocabSize = 0;

  // Pre-compiled Burmese scam semantic feature weights
  private static readonly MODEL_WEIGHTS: ModelVocabulary = {
    // Banking / Mobile Wallet Threats
    'အကောင့်': { scamCount: 190, hamCount: 50, category: 'FINANCIAL_IMPERSONATION' },
    'ပိတ်သိမ်း': { scamCount: 160, hamCount: 2, category: 'FINANCIAL_IMPERSONATION' },
    'ရပ်ဆိုင်း': { scamCount: 140, hamCount: 5, category: 'FINANCIAL_IMPERSONATION' },
    'လျှို့ဝှက်နံပါတ်': { scamCount: 130, hamCount: 1, category: 'FINANCIAL_IMPERSONATION' },
    'ငွေလွှဲ': { scamCount: 150, hamCount: 80, category: 'FINANCIAL_IMPERSONATION' },
    'ပြန်လည်': { scamCount: 120, hamCount: 40, category: 'FINANCIAL_IMPERSONATION' },
    'အရေးပေါ်': { scamCount: 145, hamCount: 10, category: 'FINANCIAL_IMPERSONATION' },
    'သတိပေး': { scamCount: 110, hamCount: 20, category: 'FINANCIAL_IMPERSONATION' },

    // Gambling / Slot / 2D / 3D
    'စလော့': { scamCount: 210, hamCount: 0, category: 'GAMBLING_BETTING' },
    'ဘောနပ်စ်': { scamCount: 185, hamCount: 2, category: 'GAMBLING_BETTING' },
    'အခမဲ့': { scamCount: 195, hamCount: 12, category: 'GAMBLING_BETTING' },
    'သွင်းငွေ': { scamCount: 175, hamCount: 4, category: 'GAMBLING_BETTING' },
    'ပေါက်ဂဏန်း': { scamCount: 190, hamCount: 0, category: 'GAMBLING_BETTING' },
    'အပိုင်': { scamCount: 160, hamCount: 1, category: 'GAMBLING_BETTING' },
    'ထွက်ဂဏန်း': { scamCount: 150, hamCount: 2, category: 'GAMBLING_BETTING' },
    'ကာစီနို': { scamCount: 180, hamCount: 0, category: 'GAMBLING_BETTING' },

    // Work From Home / Task Scam
    'ဝင်ငွေ': { scamCount: 140, hamCount: 15, category: 'JOB_TASK_SCAM' },
    'အချိန်ပိုင်း': { scamCount: 130, hamCount: 5, category: 'JOB_TASK_SCAM' },
    'လွယ်ကူ': { scamCount: 120, hamCount: 20, category: 'JOB_TASK_SCAM' },
    'အလုပ်': { scamCount: 110, hamCount: 65, category: 'JOB_TASK_SCAM' },
    'ဆက်သွယ်': { scamCount: 180, hamCount: 70, category: 'JOB_TASK_SCAM' },

    // Prize / Lottery
    'ကံစမ်းမဲ': { scamCount: 170, hamCount: 3, category: 'LOTTERY_PRIZE' },
    'ဆုမဲ': { scamCount: 165, hamCount: 4, category: 'LOTTERY_PRIZE' },
    'ကံထူးရှင်': { scamCount: 155, hamCount: 1, category: 'LOTTERY_PRIZE' },
    'ဆုရရှိ': { scamCount: 150, hamCount: 2, category: 'LOTTERY_PRIZE' },

    // Phishing / Links
    'လင့်ခ်': { scamCount: 140, hamCount: 12, category: 'PHISHING_LINK' },
    'နှိပ်ပါ': { scamCount: 170, hamCount: 18, category: 'PHISHING_LINK' },
    'ဒေါင်းလုဒ်': { scamCount: 135, hamCount: 15, category: 'PHISHING_LINK' },

    // Safe / Common Ham Burmese words
    'မင်္ဂလာပါ': { scamCount: 20, hamCount: 190, category: 'SAFE' },
    'နေကောင်းလား': { scamCount: 0, hamCount: 120, category: 'SAFE' },
    'ရောက်ပြီ': { scamCount: 2, hamCount: 150, category: 'SAFE' },
    'အိမ်': { scamCount: 5, hamCount: 160, category: 'SAFE' },
    'ကျေးဇူးတင်ပါတယ်': { scamCount: 8, hamCount: 210, category: 'SAFE' },
    'လာခဲ့ပါ': { scamCount: 4, hamCount: 140, category: 'SAFE' }
  };

  static {
    this.vocabSize = Object.keys(this.MODEL_WEIGHTS).length;
  }

  /**
   * Evaluates text using Laplace smoothed Log-Likelihood Ratio
   */
  public static predict(text: string): {
    scamProbability: number;
    predictedCategory: DetectionCategory;
    matchedTokens: string[];
  } {
    const syllables = BurmeseTextProcessor.tokenizeSyllables(text);
    const bigrams = BurmeseTextProcessor.extractNgrams(syllables, 2);
    const allFeatures = [...syllables, ...bigrams];

    let logProbScam = Math.log(this.totalScamDocs / (this.totalScamDocs + this.totalHamDocs));
    let logProbHam = Math.log(this.totalHamDocs / (this.totalScamDocs + this.totalHamDocs));

    const matchedTokens: string[] = [];
    const categoryHits: Record<string, number> = {};

    for (const token of allFeatures) {
      const entry = this.MODEL_WEIGHTS[token];
      if (entry) {
        matchedTokens.push(token);

        // Laplace smoothing (alpha = 1)
        const pWordGivenScam = (entry.scamCount + 1) / (this.totalScamDocs + this.vocabSize);
        const pWordGivenHam = (entry.hamCount + 1) / (this.totalHamDocs + this.vocabSize);

        logProbScam += Math.log(pWordGivenScam);
        logProbHam += Math.log(pWordGivenHam);

        if (entry.category && entry.category !== 'SAFE') {
          categoryHits[entry.category] = (categoryHits[entry.category] || 0) + 1;
        }
      }
    }

    // Softmax normalization between Scam and Ham
    const maxLog = Math.max(logProbScam, logProbHam);
    const expScam = Math.exp(logProbScam - maxLog);
    const expHam = Math.exp(logProbHam - maxLog);
    const scamProbability = expScam / (expScam + expHam);

    // Resolve most frequent category
    let topCategory: DetectionCategory = 'GENERAL_SPAM';
    let topCategoryCount = 0;
    for (const [cat, count] of Object.entries(categoryHits)) {
      if (count > topCategoryCount) {
        topCategoryCount = count;
        topCategory = cat as DetectionCategory;
      }
    }

    if (scamProbability < 0.5) {
      topCategory = 'SAFE';
    }

    return {
      scamProbability: Number(scamProbability.toFixed(3)),
      predictedCategory: topCategory,
      matchedTokens: Array.from(new Set(matchedTokens))
    };
  }
}
