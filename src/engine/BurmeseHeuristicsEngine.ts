import { DetectionCategory } from '../types/detector';

export interface HeuristicRule {
  id: string;
  category: DetectionCategory;
  name: string;
  descriptionMy: string;
  weight: number; // 0.1 to 1.0
  regex: RegExp;
}

export class BurmeseHeuristicsEngine {
  private static readonly RULES: HeuristicRule[] = [
    // 1. Financial & Mobile Wallet Impersonation (KPay, Wave, CB, AYA)
    {
      id: 'kpay_wave_urgent',
      category: 'FINANCIAL_IMPERSONATION',
      name: 'Mobile Banking Account Freeze',
      descriptionMy: 'KBZPay သို့မဟုတ် WavePay အကောင့်ပိတ်သိမ်းမည်ဟု အရေးပေါ်ခြိမ်းခြောက်လိမ်လည်မှု',
      weight: 0.95,
      regex: /(?:kbzpay|kpay|wave\s*pay|kbz\s*bank|cb\s*bank|aya\s*pay).*?(?:ပိတ်သိမ်း|ရပ်ဆိုင်း|လျို့ဝှက်နံပါတ်|otp|လျင်မြန်စွာ|အရေးကြီး|ပြန်လည်ဖွင့်လှစ်)/i,
    },
    {
      id: 'otp_password_theft',
      category: 'FINANCIAL_IMPERSONATION',
      name: 'OTP & Password Solicitation',
      descriptionMy: 'OTP လျှို့ဝှက်ကုဒ် သို့မဟုတ် PIN နံပါတ် တောင်းခံမှု တွေ့ရှိရသည်',
      weight: 0.98,
      regex: /(?:otp|ငွေလွှဲကုဒ်|လျှို့ဝှက်နံပါတ်|pin\s*နံပါတ်).*?(?:ပေးပို့ပါ|မျှဝေပါ|ရိုက်ထည့်ပါ|အတည်ပြုပါ)/i,
    },

    // 2. Online Gambling & Slot & 2D/3D Scams
    {
      id: 'gambling_bonus',
      category: 'GAMBLING_BETTING',
      name: 'Online Casino & Slot Free Bonus',
      descriptionMy: 'အွန်လိုင်းကာစီနို၊ စလော့ဂိမ်း (Slot) နှင့် အခမဲ့ဘောနပ်စ် မက်လုံးပေးလိမ်လည်မှု',
      weight: 0.90,
      regex: /(?:စလော့|slot|ကာစီနို|ရှမ်းကိုးရှမ်း|ငါးပစ်ဂိမ်း|ဘောနပ်|free\s*bonus|အခမဲ့\s*(?:ယူပါ|လက်ဆောင်|ပေးမည်)|သွင်းငွေ\s*\d+%)/i,
    },
    {
      id: 'two_d_three_d',
      category: 'GAMBLING_BETTING',
      name: '2D/3D Guaranteed Numbers',
      descriptionMy: '၂လုံး/၃လုံး ပေါက်ဂဏန်း အပိုင်ပေးမည်ဟု လိမ်လည်ငွေညှစ်မှု',
      weight: 0.92,
      regex: /(?:၂လုံး|3d|2d|၃လုံး|ပေါက်ဂဏန်း|ထွက်ဂဏန်း|ပေါက်မဲ|ဗွီအိုင်ပီ|vip\s*ဂဏန်း|အပိုင်ပေး)/i,
    },

    // 3. Online Job / Like & Share Scams
    {
      id: 'task_job_scam',
      category: 'JOB_TASK_SCAM',
      name: 'Work From Home Easy Task Scam',
      descriptionMy: 'တစ်နေ့ ဝင်ငွေ သိန်းဂဏန်းရမည် / Like & Subscribe လုပ်ရုံဖြင့် ငွေရမည်ဟု လှည့်စားခြင်း',
      weight: 0.88,
      regex: /(?:တစ်နေ့\s*\d+\s*(?:သောင်း|သိန်း)|like\s*လုပ်|youtube\s*ကြည့်|telegram\s*(?:ဆက်သွယ်|group)|part\s*time|အချိန်ပိုင်းအလုပ်|လွယ်ကူစွာ\s*ငွေရှာ)/i,
    },

    // 4. Lottery / Prize Fraud
    {
      id: 'lucky_draw_winner',
      category: 'LOTTERY_PRIZE',
      name: 'Fake Lottery / Prize Winner',
      descriptionMy: 'ကံစမ်းမဲပေါက်သည်၊ ကား/ဖုန်း/ငွေကျပ်ဆု ရရှိသည်ဟု အယောင်ဆောင်ခြင်း',
      weight: 0.92,
      regex: /(?:ကံစမ်းမဲ|ဆုမဲပေါက်|ဆုငွေကျပ်|ဆုလက်ဆောင်|ကံထူးရှင်|ဆုရရှိကြောင်း|ရယူရန်\s*(?:နှိပ်ပါ|ဆက်သွယ်ပါ))/i,
    },

    // 5. Suspicious Links / Domain Spoofing
    {
      id: 'url_phishing_link',
      category: 'PHISHING_LINK',
      name: 'Suspicious Shortener or Spoofed Domain',
      descriptionMy: 'မသင်္ကာဖွယ် Link အတို (bit.ly, t.me, apk တိုက်ရိုက်ဒေါင်းလုဒ်) ပါဝင်နေသည်',
      weight: 0.85,
      regex: /(?:https?:\/\/|www\.)(?:bit\.ly|tinyurl\.com|t\.me\/[a-zA-Z0-9_]+|cutt\.ly|rb\.gy|is\.gd|apk-[a-z0-9]+|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/i,
    },

    // 6. Direct APK installation scam
    {
      id: 'apk_download_threat',
      category: 'PHISHING_LINK',
      name: 'Malicious APK App Download',
      descriptionMy: 'ဖုန်းထဲသို့ မလိုလားအပ်သော APK အန္တရာယ်ရှိဆော့ဖ်ဝဲလ် တိုက်ရိုက်သွင်းခိုင်းခြင်း',
      weight: 0.96,
      regex: /(?:apk\s*(?:ဒေါင်း|install|ဖိုင်|ယူပါ)|application\s*သွင်းပါ|\.apk\b)/i,
    }
  ];

  public static inspect(text: string): {
    matchedRules: HeuristicRule[];
    detectedUrls: string[];
    score: number;
  } {
    const matchedRules: HeuristicRule[] = [];
    const urlMatches: string[] = [];

    // Extract all URLs
    const genericUrlRegex = /https?:\/\/[^\s]+|www\.[^\s]+|t\.me\/[a-zA-Z0-9_+]+/gi;
    let urlMatch;
    while ((urlMatch = genericUrlRegex.exec(text)) !== null) {
      urlMatches.push(urlMatch[0]);
    }

    for (const rule of this.RULES) {
      if (rule.regex.test(text)) {
        matchedRules.push(rule);
      }
    }

    // Calculate heuristic score with exponential decay saturation
    let score = 0;
    if (matchedRules.length > 0) {
      const maxWeight = Math.max(...matchedRules.map(r => r.weight));
      const bonus = (matchedRules.length - 1) * 0.15;
      score = Math.min(1.0, maxWeight + bonus);
    }

    return {
      matchedRules,
      detectedUrls: urlMatches,
      score
    };
  }
}
