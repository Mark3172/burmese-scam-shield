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
    // 1. Financial & Mobile Wallet Impersonation (KPay, Wave, CB, AYA, UAB)
    {
      id: 'kpay_wave_urgent',
      category: 'FINANCIAL_IMPERSONATION',
      name: 'Mobile Banking Account Freeze & Suspension',
      descriptionMy: 'KBZPay သို့မဟုတ် WavePay အကောင့်ပိတ်သိမ်း/ရပ်ဆိုင်းမည်ဟု အရေးပေါ်ခြိမ်းခြောက်လိမ်လည်မှု',
      weight: 0.96,
      regex: /(?:kbzpay|kpay|wave\s*pay|kbz\s*bank|cb\s*bank|aya\s*pay|uabpay|k-pay).*?(?:ပိတ်သိမ်း|ရပ်ဆိုင်း|လျို့ဝှက်နံပါတ်|otp|လျင်မြန်စွာ|အရေးကြီး|ပြန်လည်ဖွင့်လှစ်|freeze|locked|suspended)/i,
    },
    {
      id: 'otp_password_theft',
      category: 'FINANCIAL_IMPERSONATION',
      name: 'OTP & Password Solicitation',
      descriptionMy: 'OTP လျှို့ဝှက်ကုဒ် သို့မဟုတ် PIN နံပါတ် တောင်းခံမှု တွေ့ရှိရသည် (ဘဏ်များ မည်သည့်အခါမျှ မတောင်းပါ)',
      weight: 0.99,
      regex: /(?:otp|ငွေလွှဲကုဒ်|လျှို့ဝှက်နံပါတ်|pin\s*နံပါတ်|verification\s*code).*?(?:ပေးပို့ပါ|မျှဝေပါ|ရိုက်ထည့်ပါ|အတည်ပြုပါ|ပို့ပေးပါ|send\s*back)/i,
    },
    {
      id: 'kyc_account_update',
      category: 'FINANCIAL_IMPERSONATION',
      name: 'Fake KYC / Level 2 Verification Update',
      descriptionMy: 'Level 2 မြှင့်တင်ရန် သို့မဟုတ် KYC အချက်အလက်မပြည့်စုံဟုဆိုကာ အချက်အလက်ခိုးယူရန် ကြိုးပမ်းမှု',
      weight: 0.94,
      regex: /(?:kyc|level\s*2|အဆင့်\s*၂|မှတ်ပုံတင်|အချက်အလက်).*?(?:မပြည့်စုံ|update\s*လုပ်|အတည်ပြုရန်|ပိတ်ပါမည်|လင့်ခ်တွင်\s*ဖြည့်)/i,
    },

    // 2. Loan Shark & Fast Loan Scams
    {
      id: 'instant_loan_scam',
      category: 'FINANCIAL_IMPERSONATION',
      name: 'Illegal Online Fast Loan / Collateral-Free Scam',
      descriptionMy: 'အပေါင်ပစ္စည်းမလို ချက်ချင်းချေးငွေ သိန်း (၁၀၀) အထိ (၁၀) မိနစ်အတွင်း ရမည်ဟု လှည့်စားခြင်း',
      weight: 0.92,
      regex: /(?:အပေါင်မလို|ချက်ချင်း\s*ချေးငွေ|အတိုးသက်သာ|အမြန်ချေးငွေ|လွယ်ကူစွာ\s*ချေးယူ|ချေးငွေရယူရန်|loan|သိန်း\s*\d+\s*(?:အထိ)?\s*(?:ချေး|ထုတ်))/i,
    },

    // 3. Online Gambling & Slot & 2D/3D Scams
    {
      id: 'gambling_bonus',
      category: 'GAMBLING_BETTING',
      name: 'Online Casino & Slot Free Bonus',
      descriptionMy: 'အွန်လိုင်းကာစီနို၊ စလော့ဂိမ်း (Slot) နှင့် အခမဲ့ဘောနပ်စ် မက်လုံးပေးလိမ်လည်မှု',
      weight: 0.92,
      regex: /(?:စလော့|slot|ကာစီနို|ရှမ်းကိုးရှမ်း|ငါးပစ်ဂိမ်း|ဘောနပ်|free\s*bonus|အခမဲ့\s*(?:ယူပါ|လက်ဆောင်|ပေးမည်)|သွင်းငွေ\s*\d+%|free\s*spin|အနိုင်လွယ်)/i,
    },
    {
      id: 'two_d_three_d',
      category: 'GAMBLING_BETTING',
      name: '2D/3D Guaranteed Numbers',
      descriptionMy: '၂လုံး/၃လုံး ပေါက်ဂဏန်း အပိုင်ပေးမည်ဟု လိမ်လည်ငွေညှစ်မှု',
      weight: 0.93,
      regex: /(?:၂လုံး|3d|2d|၃လုံး|ပေါက်ဂဏန်း|ထွက်ဂဏန်း|ပေါက်မဲ|ဗွီအိုင်ပီ|vip\s*ဂဏန်း|အပိုင်ပေး|ပေါက်သီး|မနက်ပိုင်း\s*ထွက်)/i,
    },

    // 4. Online Job / Like & Share / Task Scams
    {
      id: 'task_job_scam',
      category: 'JOB_TASK_SCAM',
      name: 'Work From Home Easy Task Scam',
      descriptionMy: 'တစ်နေ့ ဝင်ငွေ သိန်းဂဏန်းရမည် / Like & Subscribe လုပ်ရုံဖြင့် ငွေရမည်ဟု လှည့်စားခြင်း',
      weight: 0.91,
      regex: /(?:တစ်နေ့\s*\d+\s*(?:သောင်း|သိန်း)|like\s*လုပ်|youtube\s*(?:ကြည့်|like)|telegram\s*(?:ဆက်သွယ်|group)|part\s*time|အချိန်ပိုင်းအလုပ်|လွယ်ကူစွာ\s*ငွေရှာ|အိမ်မှာနေရင်း\s*အလုပ်|task\s*လုပ်)/i,
    },

    // 5. Lottery / Prize Fraud
    {
      id: 'lucky_draw_winner',
      category: 'LOTTERY_PRIZE',
      name: 'Fake Lottery / Prize Winner',
      descriptionMy: 'ကံစမ်းမဲပေါက်သည်၊ ကား/ဖုန်း/ငွေကျပ်ဆု ရရှိသည်ဟု အယောင်ဆောင်ခြင်း',
      weight: 0.93,
      regex: /(?:ကံစမ်းမဲ|ဆုမဲပေါက်|ဆုငွေကျပ်|ဆုလက်ဆောင်|ကံထူးရှင်|ဆုရရှိကြောင်း|ဆုငွေသိန်း|ရယူရန်\s*(?:နှိပ်ပါ|ဆက်သွယ်ပါ)|congratulations.*?(?:winner|prize))/i,
    },

    // 6. Suspicious Links / Domain Spoofing / IP URLs
    {
      id: 'url_phishing_link',
      category: 'PHISHING_LINK',
      name: 'Suspicious Shortener or Spoofed Domain',
      descriptionMy: 'မသင်္ကာဖွယ် Link အတို (bit.ly, t.me, cutt.ly, ip address) ပါဝင်နေသည်',
      weight: 0.88,
      regex: /(?:https?:\/\/|www\.)(?:bit\.ly|tinyurl\.com|t\.me\/[a-zA-Z0-9_+]+|cutt\.ly|rb\.gy|is\.gd|apk-[a-z0-9]+|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|s\.id|shorturl\.at)/i,
    },

    // 7. Direct APK installation scam
    {
      id: 'apk_download_threat',
      category: 'PHISHING_LINK',
      name: 'Malicious APK App Download',
      descriptionMy: 'ဖုန်းထဲသို့ မလိုလားအပ်သော APK အန္တရာယ်ရှိဆော့ဖ်ဝဲလ် တိုက်ရိုက်သွင်းခိုင်းခြင်း',
      weight: 0.97,
      regex: /(?:apk\s*(?:ဒေါင်း|install|ဖိုင်|ယူပါ)|application\s*သွင်းပါ|\.apk\b|download\s*apk)/i,
    },

    // 8. Courier & Package Delivery Delivery Fee Scams
    {
      id: 'parcel_delivery_scam',
      category: 'PHISHING_LINK',
      name: 'Fake Courier / Undelivered Parcel Scam',
      descriptionMy: 'ပို့ဆောင်မည့် ပါဆယ်ထုပ်လိပ်စာ မပြည့်စုံဟုဆိုကာ အခကြေးငွေ တောင်းခံသည့် လိမ်လည်မှု',
      weight: 0.89,
      regex: /(?:ပါဆယ်|parcel|delivery|ပို့ဆောင်ရေး|ပစ္စည်းရောက်ရှိ).*?(?:လိပ်စာမပြည့်စုံ|အခကြေးငွေ|ဝန်ဆောင်ခ|link\s*တွင်\s*ပြင်ဆင်|click\s*here)/i,
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
