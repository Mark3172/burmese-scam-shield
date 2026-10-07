import { SmsMessage } from '../types/detector';
import { HybridScamDetector } from '../engine/HybridScamDetector';

export const SAMPLE_MESSAGES: Omit<SmsMessage, 'id' | 'analysis' | 'isRead'>[] = [
  {
    sender: 'KBZ-Alert',
    body: 'လူကြီးမင်း၏ KBZPay အကောင့်သည် လုံခြုံရေးအရ ပိတ်သိမ်းတော့မည်ဖြစ်၍ ပြန်လည်ဖွင့်လှစ်ရန် အရေးကြီးပါသည် http://bit.ly/kpay-restore တွင် OTP ဖြည့်သွင်းပေးပါ',
    timestamp: Date.now() - 1000 * 60 * 15 // 15 mins ago
  },
  {
    sender: '09798123456',
    body: '၂လုံး ၃လုံး VIP ပေါက်ဂဏန်း ၁၀၀% အပိုင်ပေးမည်။ ထွက်ဂဏန်း အတိအကျသိလိုပါက Telegram t.me/two_d_vip သို့ ဆက်သွယ်ပါ',
    timestamp: Date.now() - 1000 * 60 * 60 * 2 // 2 hours ago
  },
  {
    sender: 'Lucky-Draw',
    body: 'ဂုဏ်ယူပါသည်! သင်သည် ကံစမ်းမဲ သိန်း (၅၀) ကျပ် ဆုမဲပေါက်ပါပြီ။ ဆုငွေ ထုတ်ယူရန် https://claim-prize-mm.top တွင် အကောင့်အတည်ပြုပါ',
    timestamp: Date.now() - 1000 * 60 * 60 * 5 // 5 hours ago
  },
  {
    sender: 'Slot-Official',
    body: 'စလော့ဂိမ်း အသစ်ရောက်ပါပြီ! အကောင့်ဖွင့်တာနဲ့ Free Bonus 20,000 ကျပ် အခမဲ့ရယူပါ။ သွင်းငွေ 100% လက်ဆောင်ပေးမည်။',
    timestamp: Date.now() - 1000 * 60 * 60 * 8 // 8 hours ago
  },
  {
    sender: 'Online-Work',
    body: 'အိမ်မှာနေရင်း တစ်နေ့ (၃) သောင်းမှ (၁) သိန်းအထိ ရှာနိုင်မည့် အချိန်ပိုင်းအလုပ်။ YouTube video like လုပ်ရုံဖြင့် ငွေရမည်။ ဆက်သွယ်ရန် Telegram @online_job_mm',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 // 1 day ago
  },
  {
    sender: 'WaveMoney',
    body: 'သင့်၏ WavePay အကောင့်မှ ငွေလွှဲခြင်းအတွက် OTP ကုဒ်မှာ 847291 ဖြစ်ပါသည်။ ဤကုဒ်အား မည်သူ့ကိုမျှ မျှဝေခြင်းမပြုပါနှင့်။',
    timestamp: Date.now() - 1000 * 60 * 60 * 28 // 1.2 days ago
  },
  {
    sender: '09420011223',
    body: 'မင်္ဂလာပါ အမရေ၊ ညနေကျရင် ဆိုင်ကို လာခဲ့ပါဦးနော်။ စာအုပ်တွေ ရောက်နေပါပြီ ကျေးဇူးတင်ပါတယ်။',
    timestamp: Date.now() - 1000 * 60 * 60 * 48 // 2 days ago
  }
];

export function getInitialMessages(): SmsMessage[] {
  return SAMPLE_MESSAGES.map((msg, index) => {
    const analysis = HybridScamDetector.analyze(msg.body);
    return {
      id: `sms-${index + 1}`,
      sender: msg.sender,
      body: msg.body,
      timestamp: msg.timestamp,
      analysis,
      isRead: false
    };
  });
}
