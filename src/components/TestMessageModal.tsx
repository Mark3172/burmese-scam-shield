import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAnalyze: (sender: string, body: string) => void;
}

export const TestMessageModal: React.FC<Props> = ({ visible, onClose, onAnalyze }) => {
  const [sender, setSender] = useState('');
  const [body, setBody] = useState('');

  const handleTest = () => {
    if (!body.trim()) return;
    onAnalyze(sender.trim() || 'Unknown-Sender', body.trim());
    setBody('');
    setSender('');
    onClose();
  };

  const loadPreset = (presetSender: string, presetBody: string) => {
    setSender(presetSender);
    setBody(presetBody);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>SMS စစ်ဆေးရန် စမ်းသပ်ချက်ထည့်ပါ</Text>
              <Text style={styles.headerSub}>Live On-Device Scam Testing</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#555" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.inputLabel}>ပေးပို့သူ (Sender Name / Phone Number):</Text>
            <TextInput
              style={styles.input}
              placeholder="ဥပမာ- KBZPay-Security, WaveMoney, 09..."
              placeholderTextColor="#90A4AE"
              value={sender}
              onChangeText={setSender}
            />

            <Text style={styles.inputLabel}>မက်ဆေ့ခ်ျစာသား (Burmese Message Body):</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="စစ်ဆေးလိုသည့် မြန်မာဘာသာ မက်ဆေ့ခ်ျ ရိုက်ထည့်ပါ..."
              placeholderTextColor="#90A4AE"
              value={body}
              onChangeText={setBody}
              multiline
              numberOfLines={4}
            />

            {/* Quick presets */}
            <Text style={styles.presetTitle}>စမ်းသပ်ရန် ဥပမာအမျိုးအစားများ (Quick Presets) -</Text>
            <View style={styles.presetGrid}>
              <TouchableOpacity 
                style={styles.presetChip}
                onPress={() => loadPreset('KBZPay-Security', 'သင့်အကောင့် လုံခြုံရေးအရ ပိတ်သိမ်းတော့မည်ဖြစ်၍ http://bit.ly/kpay-unblock တွင် OTP ဖြည့်ပါ')}
              >
                <Text style={styles.presetChipText}>🚨 KPay/Wave အကောင့်ပိတ်လိမ်လည်မှု</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.presetChip}
                onPress={() => loadPreset('2D-Master', '၂လုံး ၃လုံး VIP ပေါက်ဂဏန်း ၁၀၀% အပိုင်ရမည် မနက်ပိုင်းထွက်ဂဏန်း t.me/vip2d')}
              >
                <Text style={styles.presetChipText}>🎰 ၂လုံး/၃လုံး VIP ပေါက်ဂဏန်း</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.presetChip}
                onPress={() => loadPreset('Quick-Loan', 'အပေါင်ပစ္စည်းမလို ချက်ချင်းချေးငွေ သိန်း ၅၀ အတိုးနည်းနည်းဖြင့် ၁၀ မိနစ်အတွင်း ရယူပါ')}
              >
                <Text style={styles.presetChipText}>💸 အပေါင်မလို အွန်လိုင်းချေးငွေအတု</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.presetChip}
                onPress={() => loadPreset('Delivery-Express', 'လူကြီးမင်း၏ ပါဆယ်ပစ္စည်း လိပ်စာမပြည့်စုံသဖြင့် ဝန်ဆောင်ခပေးပြီး bit.ly/delivery-mm တွင် ပြင်ဆင်ပါ')}
              >
                <Text style={styles.presetChipText}>📦 ပါဆယ်ထုပ် လိပ်စာပြင်လိမ်လည်မှု</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.presetChip}
                onPress={() => loadPreset('KBZ-Bank', 'သင့်၏ OTP ကုဒ်မှာ 391048 ဖြစ်ပါသည်။ မည်သူ့ကိုမျှ မပြောပါနှင့်။')}
              >
                <Text style={[styles.presetChipText, { color: '#2E7D32' }]}>✅ စိတ်ချရသော OTP ကုဒ် (Safe)</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>မလုပ်တော့ပါ</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitBtn} onPress={handleTest}>
                <Ionicons name="scan-circle-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.submitBtnText}>ချက်ချင်းစစ်ဆေးမည်</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#263238',
  },
  headerSub: {
    fontSize: 11,
    color: '#78909C',
    fontWeight: '500',
  },
  closeBtn: {
    padding: 4,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#37474F',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CFD8DC',
    borderRadius: 10,
    padding: 12,
    fontSize: 13.5,
    backgroundColor: '#FAFAFA',
    color: '#263238',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  presetTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#546E7A',
    marginTop: 14,
    marginBottom: 8,
  },
  presetGrid: {
    gap: 8,
    marginBottom: 16,
  },
  presetChip: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#ECEFF1',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
  },
  presetChipText: {
    fontSize: 12,
    color: '#37474F',
    fontWeight: '600',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    marginBottom: 10,
  },
  cancelBtn: {
    flex: 1,
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#ECEFF1',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#546E7A',
    fontWeight: '700',
    fontSize: 13,
  },
  submitBtn: {
    flex: 2,
    flexDirection: 'row',
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#1E88E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
  },
});
