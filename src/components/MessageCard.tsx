import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { SmsMessage } from '../types/detector';

interface Props {
  message: SmsMessage;
  onDelete?: (id: string) => void;
}

export const MessageCard: React.FC<Props> = ({ message, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const isScam = message.analysis.threatLevel === 'CRITICAL_SCAM';
  const isSuspicious = message.analysis.threatLevel === 'SUSPICIOUS';

  const formatTime = (time: number) => {
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const copyText = async () => {
    await Clipboard.setStringAsync(message.body);
    Alert.alert('ကူးယူပြီးပါပြီ', 'မက်ဆေ့ခ်ျစာသားကို Clipboard သို့ ကူးယူပြီးပါပြီ။');
  };

  return (
    <View style={[
      styles.card,
      isScam ? styles.scamCard : isSuspicious ? styles.suspiciousCard : styles.safeCard
    ]}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.senderInfo}>
          <Ionicons 
            name={isScam ? "warning" : isSuspicious ? "alert-circle" : "chatbubble-ellipses"} 
            size={20} 
            color={isScam ? "#D32F2F" : isSuspicious ? "#F57F17" : "#388E3C"} 
          />
          <Text style={styles.senderText}>{message.sender}</Text>
        </View>

        <View style={styles.badgeRow}>
          <View style={[
            styles.badge, 
            isScam ? styles.scamBadge : isSuspicious ? styles.suspiciousBadge : styles.safeBadge
          ]}>
            <Text style={[
              styles.badgeText, 
              isScam ? styles.scamBadgeText : isSuspicious ? styles.suspiciousBadgeText : styles.safeBadgeText
            ]}>
              {isScam ? "🚨 လိမ်လည်မက်ဆေ့ခ်ျ" : isSuspicious ? "⚠️ သတိထားရန်" : "✅ လုံခြုံသည်"}
            </Text>
          </View>
          <Text style={styles.timeText}>{formatTime(message.timestamp)}</Text>
        </View>
      </View>

      {/* Category Banner if scam */}
      {(isScam || isSuspicious) && (
        <View style={styles.categoryBanner}>
          <Text style={styles.categoryText}>
            🏷️ အမျိုးအစား: {message.analysis.categoryLabelMy}
          </Text>
          <Text style={styles.scoreText}>
            အန္တရာယ်အဆင့်: {Math.round(message.analysis.scamScore * 100)}%
          </Text>
        </View>
      )}

      {/* Body text with blur/quarantine treatment */}
      <View style={styles.bodyWrapper}>
        <Text style={[styles.bodyText, isScam && !expanded && styles.quarantinedText]}>
          {message.body}
        </Text>
      </View>

      {/* Reasons breakdown */}
      {message.analysis.reasons.length > 0 && (
        <View style={styles.reasonsBox}>
          <Text style={styles.reasonsHeader}>တွေ့ရှိရသော အန္တရာယ်လက္ခဏာများ -</Text>
          {message.analysis.reasons.map((reason, idx) => (
            <Text key={idx} style={styles.reasonItem}>
              • {reason}
            </Text>
          ))}
        </View>
      )}

      {/* Action Footer */}
      <View style={styles.actionFooter}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setExpanded(!expanded)}>
          <Ionicons name={expanded ? "eye-off-outline" : "eye-outline"} size={16} color="#455A64" />
          <Text style={styles.actionBtnText}>
            {expanded ? "စာသားပြန်ဖုံးမည်" : "စာသားအပြည့်အစုံဖတ်မည်"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={copyText}>
          <Ionicons name="copy-outline" size={16} color="#455A64" />
          <Text style={styles.actionBtnText}>ကူးယူမည်</Text>
        </TouchableOpacity>

        {onDelete && (
          <TouchableOpacity style={styles.actionBtn} onPress={() => onDelete(message.id)}>
            <Ionicons name="trash-outline" size={16} color="#C62828" />
            <Text style={[styles.actionBtnText, { color: '#C62828' }]}>ဖျက်မည်</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
  },
  scamCard: {
    borderColor: '#FFCDD2',
    backgroundColor: '#FFFDFD',
  },
  suspiciousCard: {
    borderColor: '#FFE082',
    backgroundColor: '#FFFDF7',
  },
  safeCard: {
    borderColor: '#E0E0E0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  senderText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#263238',
    marginLeft: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
  },
  scamBadge: {
    backgroundColor: '#FFEBEE',
  },
  suspiciousBadge: {
    backgroundColor: '#FFF8E1',
  },
  safeBadge: {
    backgroundColor: '#E8F5E9',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  scamBadgeText: {
    color: '#B71C1C',
  },
  suspiciousBadgeText: {
    color: '#F57F17',
  },
  safeBadgeText: {
    color: '#2E7D32',
  },
  timeText: {
    fontSize: 11,
    color: '#888',
  },
  categoryBanner: {
    backgroundColor: '#FBE9E7',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#BF360C',
    flex: 1,
  },
  scoreText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#D84315',
  },
  bodyWrapper: {
    paddingVertical: 4,
  },
  bodyText: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#37474F',
  },
  quarantinedText: {
    color: '#78909C',
  },
  reasonsBox: {
    backgroundColor: '#FEEBEE',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  reasonsHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 4,
  },
  reasonItem: {
    fontSize: 11.5,
    color: '#B71C1C',
    marginVertical: 1,
    lineHeight: 16,
  },
  actionFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
    marginTop: 10,
    paddingTop: 8,
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtnText: {
    fontSize: 11.5,
    color: '#455A64',
    fontWeight: '500',
  },
});
