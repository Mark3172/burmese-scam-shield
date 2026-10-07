import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
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
            <Text style={styles.headerTitle}>SMS စစ်ဆေးရန် စမ်းသပ်ချက်ထည့်ပါ</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>ပေးပို့သူ (Sender / Phone):</Text>
          <TextInput
            style={styles.input}
            placeholder="ဥပမာ- KBZ-Pay, WaveMoney, 09..."
            value={sender}
            onChangeText={setSender}
          />

          <Text style={styles.inputLabel}>မက်ဆေ့ခ်ျစာသား (Burmese Message Body):</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="စစ်ဆေးလိုသည့် မြန်မာဘာသာ မက်ဆေ့ခ်ျ ရိုက်ထည့်ပါ..."
            value={body}
            onChangeText={setBody}
            multiline
            numberOfLines={4}
          />

          {/* Quick presets */}
          <Text style={styles.presetTitle}>စမ်းသပ်ရန် ဥပမာများ ရွေးချယ်ပါ -</Text>
          <View style={styles.presetRow}>
            <TouchableOpacity 
              style={styles.presetChip}
              onPress={() => loadPreset('KBZPay-Security', 'သင့်အကောင့် လုံခြုံရေးအရ ပိတ်သိမ်းတော့မည်ဖြစ်၍ http://bit.ly/kpay-unblock တွင် OTP ဖြည့်ပါ')}
            >
              <Text style={styles.presetChipText}>🚨 KPay လိမ်လည်မှု</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.presetChip}
              onPress={() => loadPreset('2D-Master', '၂လုံး ၃လုံး VIP ပေါက်ဂဏန်း ၁၀၀% အပိုင်ရမည် t.me/vip2d')}
            >
              <Text style={styles.presetChipText}>🎰 ၂လုံး/၃လုံး လောင်းကစား</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>မလုပ်တော့ပါ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={handleTest}>
              <Text style={styles.submitBtnText}>စစ်ဆေးမည် (Run Scan)</Text>
            </TouchableOpacity>
          </View>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#263238',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#37474F',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CFD8DC',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  presetTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78909C',
    marginTop: 12,
    marginBottom: 6,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  presetChip: {
    backgroundColor: '#ECEFF1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  presetChipText: {
    fontSize: 12,
    color: '#37474F',
    fontWeight: '500',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ECEFF1',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#455A64',
    fontWeight: '600',
  },
  submitBtn: {
    flex: 2,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1E88E5',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
});
