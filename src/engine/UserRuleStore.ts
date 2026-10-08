export interface WhitelistItem {
  id: string;
  pattern: string; // Phone number, shortcode or Sender ID
  label: string;
  isRegex: boolean;
  addedAt: number;
}

export interface BlacklistItem {
  id: string;
  pattern: string;
  reason: string;
  isRegex: boolean;
  addedAt: number;
}

export class UserRuleStore {
  // Built-in trusted official senders
  private static whitelist: WhitelistItem[] = [
    { id: 'w-1', pattern: 'KBZPay', label: 'KBZPay တရားဝင် SMS', isRegex: false, addedAt: Date.now() },
    { id: 'w-2', pattern: 'WaveMoney', label: 'WaveMoney တရားဝင် SMS', isRegex: false, addedAt: Date.now() },
    { id: 'w-3', pattern: 'AYA-Bank', label: 'AYA Bank တရားဝင် SMS', isRegex: false, addedAt: Date.now() },
    { id: 'w-4', pattern: 'CB-Bank', label: 'CB Bank တရားဝင် SMS', isRegex: false, addedAt: Date.now() },
    { id: 'w-5', pattern: 'MPT', label: 'MPT ဆက်သွယ်ရေး', isRegex: false, addedAt: Date.now() },
    { id: 'w-6', pattern: 'ATOM', label: 'ATOM Telecom', isRegex: false, addedAt: Date.now() },
    { id: 'w-7', pattern: 'Ooredoo', label: 'Ooredoo Telecom', isRegex: false, addedAt: Date.now() },
  ];

  private static blacklist: BlacklistItem[] = [
    { id: 'b-1', pattern: 't.me/two_d_vip', reason: '၂လုံး/၃လုံး လိမ်လည်ဂိုဏ်း', isRegex: false, addedAt: Date.now() },
    { id: 'b-2', pattern: 'apk-[a-z0-9]+', reason: 'မသင်္ကာဖွယ် APK ဒေါင်းလုဒ်လင့်ခ်', isRegex: true, addedAt: Date.now() },
  ];

  public static getWhitelist(): WhitelistItem[] {
    return [...this.whitelist];
  }

  public static getBlacklist(): BlacklistItem[] {
    return [...this.blacklist];
  }

  public static addWhitelist(pattern: string, label: string): WhitelistItem {
    const item: WhitelistItem = {
      id: `w-${Date.now()}`,
      pattern: pattern.trim(),
      label: label.trim() || pattern.trim(),
      isRegex: false,
      addedAt: Date.now(),
    };
    this.whitelist.unshift(item);
    return item;
  }

  public static removeWhitelist(id: string): void {
    this.whitelist = this.whitelist.filter(i => i.id !== id);
  }

  public static addBlacklist(pattern: string, reason: string): BlacklistItem {
    const item: BlacklistItem = {
      id: `b-${Date.now()}`,
      pattern: pattern.trim(),
      reason: reason.trim() || 'အသုံးပြုသူမှ ပိတ်ပင်ထားသော စာရင်း',
      isRegex: false,
      addedAt: Date.now(),
    };
    this.blacklist.unshift(item);
    return item;
  }

  public static removeBlacklist(id: string): void {
    this.blacklist = this.blacklist.filter(i => i.id !== id);
  }

  public static isWhitelisted(sender: string): WhitelistItem | null {
    const s = sender.toLowerCase().trim();
    for (const item of this.whitelist) {
      if (item.isRegex) {
        try {
          if (new RegExp(item.pattern, 'i').test(sender)) return item;
        } catch {}
      } else {
        if (s === item.pattern.toLowerCase()) return item;
      }
    }
    return null;
  }

  public static isBlacklisted(sender: string, body: string): BlacklistItem | null {
    const s = sender.toLowerCase().trim();
    const b = body.toLowerCase();
    for (const item of this.blacklist) {
      if (item.isRegex) {
        try {
          const reg = new RegExp(item.pattern, 'i');
          if (reg.test(sender) || reg.test(body)) return item;
        } catch {}
      } else {
        const p = item.pattern.toLowerCase();
        if (s.includes(p) || b.includes(p)) return item;
      }
    }
    return null;
  }
}
