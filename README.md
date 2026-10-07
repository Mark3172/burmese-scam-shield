# ShieldSMS (မြန်မာ) - On-Device Scam & Phishing Detector

A privacy-first, on-device mobile application engineered with React Native and TypeScript to detect, classify, and quarantine scam messages (smishing) in the **Burmese language (မြန်မာဘာသာ)**.

---

## 🌟 Key Features

1. **100% On-Device Privacy Architecture:**
   - Zero network requests for SMS analysis. Message bodies never leave the user's phone, complying with Google Play Data Safety and Apple App Store privacy policies.
2. **Burmese NLP & Unicode Processing:**
   - **Unicode Normalization:** Standardizes decomposed characters and cleans Zawgyi-Unicode confusion.
   - **Syllable Tokenizer:** Segments unspaced Burmese sentences into individual syllables (`\u1000-\u1021` regex rules) and extracts N-grams.
3. **Dual-Tier Hybrid Detection Engine:**
   - **Tier 1 (Heuristics & Regex):** Flags known high-velocity threats:
     - 🏦 **KBZPay / WavePay Impersonation:** Fake account suspension & OTP solicitation.
     - 🎰 **Online Casino / 2D / 3D Gambling:** "ပေါက်ဂဏန်း အပိုင်ပေးမည်", Slot free bonus lures.
     - 💼 **Job Task Scams:** "တစ်နေ့ (၃) သောင်းမှ (၁) သိန်း", Like & Subscribe fraud.
     - 🎁 **Prize & Lottery:** "ကံစမ်းမဲပေါက်သည်", fake winner claim pages.
     - 🔗 **Phishing Links & APK Drops:** URL shorteners (`bit.ly`, `tinyurl`, `t.me`), IP-based URLs, direct `.apk` downloads.
   - **Tier 2 (On-Device Semantic NLP Classifier):** Evaluates semantic context, urgency markers, and malicious intent using Bayesian log-likelihood scoring.
   - **Safe OTP Whitelist:** Whitelists legitimate bank OTP verification codes when no malicious links or solicitation patterns are present.
4. **Quarantine Inbox & Burmese UI:**
   - Automatic categorization with detailed Burmese explanations.
   - Concealed message body protection with one-tap toggle.
   - Filter tabs: **All Messages**, **🚨 Quarantined (လိမ်လည်မက်ဆေ့ခ်ျ)**, and **✅ Safe (လုံခြုံသည်)**.
   - Interactive testing modal with one-tap presets.

---

## 🚀 How to Run the App

1. Open your terminal in the project directory:
   ```bash
   cd "e:\Coding Project\burmese-scam-shield"
   ```
2. Start the Expo development server:
   ```bash
   npx expo start
   ```
3. Run on your desired target:
   - Press **`w`** to open in web browser.
   - Press **`a`** to launch on Android emulator/device.
   - Scan the QR code using the **Expo Go** app on your phone.

---

## 📂 Project Structure

```
burmese-scam-shield/
├── src/
│   ├── types/
│   │   └── detector.ts               # ThreatLevel, Category & Message interfaces
│   ├── engine/
│   │   ├── BurmeseTextProcessor.ts   # Unicode normalization & syllable segmenter
│   │   ├── BurmeseHeuristicsEngine.ts# Tier 1 regex patterns & threat rules
│   │   ├── BurmeseNLPClassifier.ts   # Tier 2 Bayesian intent classification
│   │   └── HybridScamDetector.ts     # Orchestrator combining Tier 1 & Tier 2
│   ├── native/
│   │   └── NativeSmsIntegration.ts   # Android runtime permissions & broadcast hook
│   ├── data/
│   │   └── sampleMessages.ts         # Pre-loaded authentic Burmese test SMS dataset
│   └── components/
│       ├── StatusBanner.tsx          # Real-time shield status banner
│       ├── MessageCard.tsx           # Quarantined card with threat breakdown
│       └── TestMessageModal.tsx      # Custom SMS tester & quick presets
└── App.tsx                           # Root React Native UI & filter state
```
