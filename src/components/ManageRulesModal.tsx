import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserRuleStore, WhitelistItem, BlacklistItem } from '../engine/UserRuleStore';

interface Props {
  visible: boolean;
  onClose: () => void;
  onRulesChanged: () => void;
}

export const ManageRulesModal: React.FC<Props> = ({ visible, onClose, onRulesChanged }) => {
  const [activeSubTab, setActiveSubTab] = useState<'WHITELIST' | 'BLACKLIST'>('WHITELIST');
  const [whitelist, setWhitelist] = useState<WhitelistItem[]>(UserRuleStore.getWhitelist());
  const [blacklist, setBlacklist] = useState<BlacklistItem[]>(UserRuleStore.getBlacklist());

  // Input states
  const [patternInput, setPatternInput] = useState('');
  const [descInput, setDescInput] = useState('');

  const refreshRules = () => {
    setWhitelist(UserRuleStore.getWhitelist());
    setBlacklist(UserRuleStore.getBlacklist());
    onRulesChanged();
  };

  const handleAdd = () => {
    if (!patternInput.trim()) return;

    if (activeSubTab === 'WHITELIST') {
      UserRuleStore.addWhitelist(patternInput, descInput || patternInput);
    } else {
      UserRuleStore.addBlacklist(patternInput, descInput || 'အသုံးပြုသူ စိတ်ကြိုက်ပိတ်ထားခြင်း');
    }

    setPatternInput('');
    setDescInput('');
    refreshRules();
  };

  const handleDeleteWhitelist = (id: string) => {
    UserRuleStore.removeWhitelist(id);
    refreshRules();
  };

  const handleDeleteBlacklist = (id: string) => {
    UserRuleStore.removeBlacklist(id);
    refreshRules();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>စည်းမျဉ်းများ စီမံခန့်ခွဲရန်</Text>
              <Text style={styles.headerSub}>Custom Whitelist & Blacklist Rules</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#555" />
            </TouchableOpacity>
          </View>

          {/* Sub Tab Switcher */}
          <View style={styles.tabRow}>
            <TouchableOpacity 
              style={[styles.tabBtn, activeSubTab === 'WHITELIST' && styles.activeTabBtn]}
              onPress={() => setActiveSubTab('WHITELIST')}
            >
              <Ionicons name="shield-checkmark" size={16} color={activeSubTab === 'WHITELIST' ? '#2E7D32' : '#78909C'} />
              <Text style={[styles.tabBtnText, activeSubTab === 'WHITELIST' && styles.activeTabBtnText]}>
                စိတ်ချရသော စာရင်း ({whitelist.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tabBtn, activeSubTab === 'BLACKLIST' && styles.activeBlacklistTabBtn]}
              onPress={() => setActiveSubTab('BLACKLIST')}
            >
              <Ionicons name="ban" size={16} color={activeSubTab === 'BLACKLIST' ? '#C62828' : '#78909C'} />
              <Text style={[styles.tabBtnText, activeSubTab === 'BLACKLIST' && { color: '#C62828', fontWeight: '800' }]}>
                ပိတ်ပင်ထားသော စာရင်း ({blacklist.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Add Rule Form */}
          <View style={styles.addForm}>
            <Text style={styles.formTitle}>
              {activeSubTab === 'WHITELIST' ? '➕ စိတ်ချရသော ပေးပို့သူအသစ် ထည့်သွင်းရန်' : '🚫 ပိတ်ပင်လိုသော စကားလုံး/ဖုန်း ထည့်သွင်းရန်'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={activeSubTab === 'WHITELIST' ? 'ဥပမာ- KBZPay, 09...' : 'ဥပမာ- t.me/vip, ပေါက်ဂဏန်း...'}
              placeholderTextColor="#90A4AE"
              value={patternInput}
              onChangeText={setPatternInput}
            />
            <TextInput
              style={styles.input}
              placeholder={activeSubTab === 'WHITELIST' ? 'ဖော်ပြချက် (ဥပမာ- ရုံးဖုန်း/ဘဏ်)' : 'အကြောင်းပြချက်'}
              placeholderTextColor="#90A4AE"
              value={descInput}
              onChangeText={setDescInput}
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
              <Text style={styles.addBtnText}>စာရင်းသို့ ထည့်မည်</Text>
            </TouchableOpacity>
          </View>

          {/* List of Rules */}
          {activeSubTab === 'WHITELIST' ? (
            <FlatList
              data={whitelist}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.ruleItem}>
                  <View style={styles.ruleInfo}>
                    <Text style={styles.rulePattern}>{item.pattern}</Text>
                    <Text style={styles.ruleLabel}>{item.label}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteWhitelist(item.id)}>
                    <Ionicons name="trash-outline" size={18} color="#D32F2F" />
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <FlatList
              data={blacklist}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={[styles.ruleItem, styles.blacklistRuleItem]}>
                  <View style={styles.ruleInfo}>
                    <Text style={[styles.rulePattern, { color: '#C62828' }]}>{item.pattern}</Text>
                    <Text style={styles.ruleLabel}>{item.reason}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteBlacklist(item.id)}>
                    <Ionicons name="trash-outline" size={18} color="#D32F2F" />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
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
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16.5,
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
  tabRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    gap: 6,
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  activeTabBtn: {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
  },
  activeBlacklistTabBtn: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#546E7A',
  },
  activeTabBtnText: {
    color: '#2E7D32',
    fontWeight: '800',
  },
  addForm: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  formTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#37474F',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CFD8DC',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 13,
    marginBottom: 8,
  },
  addBtn: {
    backgroundColor: '#1E88E5',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12.5,
  },
  ruleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  blacklistRuleItem: {
    borderColor: '#FFEBEE',
    backgroundColor: '#FFFDFD',
  },
  ruleInfo: {
    flex: 1,
  },
  rulePattern: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#263238',
  },
  ruleLabel: {
    fontSize: 11.5,
    color: '#78909C',
    marginTop: 2,
  },
});
