import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBanner } from './src/components/StatusBanner';
import { MessageCard } from './src/components/MessageCard';
import { TestMessageModal } from './src/components/TestMessageModal';
import { getInitialMessages } from './src/data/sampleMessages';
import { SmsMessage, ThreatLevel } from './src/types/detector';
import { HybridScamDetector } from './src/engine/HybridScamDetector';

export default function App() {
  const [messages, setMessages] = useState<SmsMessage[]>(getInitialMessages());
  const [activeTab, setActiveTab] = useState<'ALL' | 'QUARANTINE' | 'SAFE'>('ALL');
  const [modalVisible, setModalVisible] = useState(false);

  // Counters
  const quarantinedCount = messages.filter(m => m.analysis.threatLevel === 'CRITICAL_SCAM').length;
  const suspiciousCount = messages.filter(m => m.analysis.threatLevel === 'SUSPICIOUS').length;

  const filteredMessages = messages.filter(m => {
    if (activeTab === 'QUARANTINE') {
      return m.analysis.threatLevel === 'CRITICAL_SCAM' || m.analysis.threatLevel === 'SUSPICIOUS';
    }
    if (activeTab === 'SAFE') {
      return m.analysis.threatLevel === 'SAFE';
    }
    return true;
  });

  const handleNewAnalysis = (sender: string, body: string) => {
    const analysis = HybridScamDetector.analyze(body);
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

  const handleDelete = (id: string) => {
    setMessages(messages.filter(m => m.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6F9" />

      {/* App Header */}
      <View style={styles.topHeader}>
        <View style={styles.appTitleContainer}>
          <Ionicons name="shield-half-sharp" size={26} color="#1E88E5" />
          <View style={styles.titleTextContainer}>
            <Text style={styles.appTitle}>ShieldSMS (မြန်မာ)</Text>
            <Text style={styles.appSubtitle}>On-Device AI Scam & Smishing Filter</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.scanButton} 
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle" size={18} color="#FFF" />
          <Text style={styles.scanButtonText}>စစ်ဆေးရန်</Text>
        </TouchableOpacity>
      </View>

      {/* Status Warning Banner */}
      <StatusBanner 
        quarantinedCount={quarantinedCount} 
        suspiciousCount={suspiciousCount} 
      />

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
          <Text style={[styles.tabText, activeTab === 'QUARANTINE' && styles.activeTabText, { color: activeTab === 'QUARANTINE' ? '#D32F2F' : '#666' }]}>
            🚨 လိမ်လည်မက်ဆေ့ခ်ျ ({quarantinedCount + suspiciousCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'SAFE' && styles.activeTabItem]}
          onPress={() => setActiveTab('SAFE')}
        >
          <Text style={[styles.tabText, activeTab === 'SAFE' && styles.activeTabText]}>
            ✅ လုံခြုံသည် ({messages.length - quarantinedCount - suspiciousCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Message Stream */}
      <FlatList
        data={filteredMessages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MessageCard message={item} onDelete={handleDelete} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="mail-open-outline" size={48} color="#B0BEC5" />
            <Text style={styles.emptyText}>မက်ဆေ့ခ်ျများ မရှိသေးပါ</Text>
          </View>
        }
      />

      {/* Test / Real-time Input Modal */}
      <TestMessageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAnalyze={handleNewAnalysis}
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
    borderBottomColor: '#E0E0E0',
  },
  appTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleTextContainer: {
    marginLeft: 8,
  },
  appTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#102027',
  },
  appSubtitle: {
    fontSize: 11,
    color: '#78909C',
    fontWeight: '500',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E88E5',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 4,
  },
  scanButtonText: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
    gap: 8,
  },
  tabItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#ECEFF1',
  },
  activeTabItem: {
    backgroundColor: '#CFD8DC',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#546E7A',
  },
  activeTabText: {
    color: '#263238',
    fontWeight: '700',
  },
  listContent: {
    paddingVertical: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 14,
    color: '#90A4AE',
    marginTop: 10,
    fontWeight: '500',
  },
});
