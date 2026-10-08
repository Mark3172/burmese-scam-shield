import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBanner } from './src/components/StatusBanner';
import { MessageCard } from './src/components/MessageCard';
import { TestMessageModal } from './src/components/TestMessageModal';
import { ManageRulesModal } from './src/components/ManageRulesModal';
import { getInitialMessages } from './src/data/sampleMessages';
import { SmsMessage } from './src/types/detector';
import { HybridScamDetector } from './src/engine/HybridScamDetector';

export default function App() {
  const [messages, setMessages] = useState<SmsMessage[]>(getInitialMessages());
  const [activeTab, setActiveTab] = useState<'ALL' | 'QUARANTINE' | 'SAFE'>('ALL');
  const [testModalVisible, setTestModalVisible] = useState(false);
  const [rulesModalVisible, setRulesModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Counters
  const quarantinedCount = messages.filter(m => m.analysis.threatLevel === 'CRITICAL_SCAM').length;
  const suspiciousCount = messages.filter(m => m.analysis.threatLevel === 'SUSPICIOUS').length;

  const filteredMessages = messages.filter(m => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = m.body.toLowerCase().includes(q) || m.sender.toLowerCase().includes(q);
      if (!matchText) return false;
    }

    if (activeTab === 'QUARANTINE') {
      return m.analysis.threatLevel === 'CRITICAL_SCAM' || m.analysis.threatLevel === 'SUSPICIOUS';
    }
    if (activeTab === 'SAFE') {
      return m.analysis.threatLevel === 'SAFE';
    }
    return true;
  });

  const handleNewAnalysis = (sender: string, body: string) => {
    const analysis = HybridScamDetector.analyze(body, sender);
    const newMessage: SmsMessage = {
      id: `sms-${Date.now()}`,
      sender,
      body,
      timestamp: Date.now(),
      analysis,
      isRead: false
    };

    setMessages([newMessage, ...messages]);
  };

  const reAnalyzeAll = () => {
    const updated = messages.map(m => ({
      ...m,
      analysis: HybridScamDetector.analyze(m.body, m.sender)
    }));
    setMessages(updated);
  };

  const handleDelete = (id: string) => {
    setMessages(messages.filter(m => m.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

      {/* Top App Header */}
      <View style={styles.topHeader}>
        <View style={styles.appTitleContainer}>
          <View style={styles.logoBadge}>
            <Ionicons name="shield-checkmark" size={20} color="#1E88E5" />
          </View>
          <View style={styles.titleTextContainer}>
            <Text style={styles.appTitle}>ShieldSMS မြန်မာ</Text>
            <Text style={styles.appSubtitle}>On-Device AI Scam & Smishing Protection</Text>
          </View>
        </View>

        <View style={styles.topBtnRow}>
          <TouchableOpacity 
            style={styles.rulesButton} 
            onPress={() => setRulesModalVisible(true)}
          >
            <Ionicons name="options-outline" size={16} color="#37474F" />
            <Text style={styles.rulesButtonText}>စည်းမျဉ်းများ</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.scanButton} 
            onPress={() => setTestModalVisible(true)}
          >
            <Ionicons name="add-circle" size={16} color="#FFF" />
            <Text style={styles.scanButtonText}>စစ်ဆေးရန်</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Real-time Status Banner with Live Indicator */}
      <StatusBanner 
        totalCount={messages.length}
        quarantinedCount={quarantinedCount} 
        suspiciousCount={suspiciousCount} 
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={17} color="#90A4AE" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="မက်ဆေ့ခ်ျ သို့မဟုတ် ပေးပို့သူ ရှာဖွေပါ..."
          placeholderTextColor="#90A4AE"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={17} color="#90A4AE" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'ALL' && styles.activeTabItem]}
          onPress={() => setActiveTab('ALL')}
        >
          <Text style={[styles.tabText, activeTab === 'ALL' && styles.activeTabText]}>
            အားလုံး ({messages.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'QUARANTINE' && styles.activeTabItem]}
          onPress={() => setActiveTab('QUARANTINE')}
        >
          <Text style={[
            styles.tabText, 
            activeTab === 'QUARANTINE' && styles.activeTabText,
            { color: activeTab === 'QUARANTINE' ? '#C62828' : '#546E7A' }
          ]}>
            🚨 လိမ်လည်မှု ({quarantinedCount + suspiciousCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'SAFE' && styles.activeTabItem]}
          onPress={() => setActiveTab('SAFE')}
        >
          <Text style={[
            styles.tabText, 
            activeTab === 'SAFE' && styles.activeTabText,
            { color: activeTab === 'SAFE' ? '#2E7D32' : '#546E7A' }
          ]}>
            ✅ လုံခြုံသည် ({messages.length - quarantinedCount - suspiciousCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quarantined Messages List */}
      <FlatList
        data={filteredMessages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MessageCard message={item} onDelete={handleDelete} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="file-tray-outline" size={48} color="#CFD8DC" />
            <Text style={styles.emptyText}>မက်ဆေ့ခ်ျများ မတွေ့ရှိပါ</Text>
          </View>
        }
      />

      {/* Interactive Scan & Test Modal */}
      <TestMessageModal
        visible={testModalVisible}
        onClose={() => setTestModalVisible(false)}
        onAnalyze={handleNewAnalysis}
      />

      {/* Manage Custom Rules Modal */}
      <ManageRulesModal
        visible={rulesModalVisible}
        onClose={() => setRulesModalVisible(false)}
        onRulesChanged={reAnalyzeAll}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
  },
  appTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleTextContainer: {
    marginLeft: 10,
  },
  appTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#102027',
  },
  appSubtitle: {
    fontSize: 10.5,
    color: '#78909C',
    fontWeight: '600',
  },
  topBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  rulesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECEFF1',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 18,
    gap: 4,
  },
  rulesButtonText: {
    color: '#37474F',
    fontSize: 11.5,
    fontWeight: '700',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E88E5',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 18,
    gap: 4,
  },
  scanButtonText: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#263238',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
    gap: 8,
  },
  tabItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  activeTabItem: {
    backgroundColor: '#E2E8F0',
    borderColor: '#CFD8DC',
  },
  tabText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#546E7A',
  },
  activeTabText: {
    color: '#263238',
    fontWeight: '800',
  },
  listContent: {
    paddingVertical: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 13.5,
    color: '#90A4AE',
    marginTop: 8,
    fontWeight: '600',
  },
});
