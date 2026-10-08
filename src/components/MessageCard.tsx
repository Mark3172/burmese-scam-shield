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
  const isSafe = message.analysis.threatLevel === 'SAFE';

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
          <View style={[
            styles.avatarCircle,
            isScam ? styles.avatarScam : isSuspicious ? styles.avatarSuspicious : styles.avatarSafe
          ]}>
            <Ionicons 
              name={isScam ? "shield-outline" : isSuspicious ? "alert" : "checkmark"} 
              size={15} 
              color={isScam ? "#D32F2F" : isSuspicious ? "#E65100" : "#2E7D32"} 
            />
          </View>
          <View>
            <Text style={styles.senderText}>{message.sender}</Text>
            <Text style={styles.timeText}>{formatTime(message.timestamp)}</Text>
          </View>
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
              {isScam ? "🚨 လိမ်လည်မှု" : isSuspicious ? "⚠️ သတိထားရန်" : "✅ လုံခြုံသည်"}
            </Text>
          </View>
        </View>
      </View>

      {/* Category Banner if scam/suspicious */}
      {(isScam || isSuspicious) && (
        <View style={[styles.categoryBanner, isSuspicious && styles.suspiciousCategoryBanner]}>
          <Text style={styles.categoryText}>
            🏷️ {message.analysis.categoryLabelMy}
          </Text>
          <Text style={styles.scoreText}>
            အန္တရာယ် {Math.round(message.analysis.scamScore * 100)}%
          </Text>
        </View>
      )}

      {/* Message Body with optional quarantine hide */}
      <View style={styles.bodyWrapper}>
        <Text style={[styles.bodyText, isScam && !expanded && styles.quarantinedText]}>
          {message.body}
        </Text>
      </View>

      {/* Detected URLs highlight */}
      {message.analysis.detectedUrls.length > 0 && (
        <View style={styles.urlBox}>
          <Ionicons name="link-outline" size={14} color="#C62828" />
          <Text style={styles.urlWarningText} numberOfLines={1}>
            မသင်္ကာဖွယ် Link: {message.analysis.detectedUrls.join(', ')}
          </Text>
        </View>
      )}

      {/* Reasons breakdown */}
      {message.analysis.reasons.length > 0 && (
        <View style={styles.reasonsBox}>
          <Text style={styles.reasonsHeader}>🛡️ စစ်ဆေးတွေ့ရှိချက်များ -</Text>
          {message.analysis.reasons.map((reason, idx) => (
            <Text key={idx} style={styles.reasonItem}>
              • {reason}
            </Text>
          ))}
        </View>
      )}

      {/* Action Footer */}
      <View style={styles.actionFooter}>
        {isScam && (
          <TouchableOpacity style={styles.actionBtn} onPress={() => setExpanded(!expanded)}>
            <Ionicons name={expanded ? "eye-off-outline" : "eye-outline"} size={15} color="#455A64" />
            <Text style={styles.actionBtnText}>
              {expanded ? "စာသားဖုံးမည်" : "စာသားဖတ်မည်"}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.actionBtn} onPress={copyText}>
          <Ionicons name="copy-outline" size={15} color="#455A64" />
          <Text style={styles.actionBtnText}>ကူးယူမည်</Text>
        </TouchableOpacity>

        {onDelete && (
          <TouchableOpacity style={styles.actionBtn} onPress={() => onDelete(message.id)}>
            <Ionicons name="trash-outline" size={15} color="#D32F2F" />
            <Text style={[styles.actionBtnText, { color: '#D32F2F' }]}>ဖျက်မည်</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1.2,
  },
  scamCard: {
    borderColor: '#FFCDD2',
    backgroundColor: '#FFFDFD',
  },
  suspiciousCard: {
    borderColor: '#FFE082',
    backgroundColor: '#FFFDF8',
  },
  safeCard: {
    borderColor: '#E8F5E9',
    backgroundColor: '#FFFFFF',
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
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarScam: {
    backgroundColor: '#FFEBEE',
  },
  avatarSuspicious: {
    backgroundColor: '#FFF3E0',
  },
  avatarSafe: {
    backgroundColor: '#E8F5E9',
  },
  senderText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#263238',
  },
  timeText: {
    fontSize: 11,
    color: '#90A4AE',
    marginTop: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
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
    color: '#C62828',
  },
  suspiciousBadgeText: {
    color: '#E65100',
  },
  safeBadgeText: {
    color: '#2E7D32',
  },
  categoryBanner: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suspiciousCategoryBanner: {
    backgroundColor: '#FFF8E1',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B71C1C',
    flex: 1,
  },
  scoreText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C62828',
  },
  bodyWrapper: {
    paddingVertical: 3,
  },
  bodyText: {
    fontSize: 13.5,
    lineHeight: 21,
    color: '#37474F',
  },
  quarantinedText: {
    color: '#78909C',
  },
  urlBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 7,
    borderRadius: 6,
    marginTop: 6,
    gap: 6,
  },
  urlWarningText: {
    fontSize: 11,
    color: '#C62828',
    fontWeight: '600',
    flex: 1,
  },
  reasonsBox: {
    backgroundColor: '#FBE9E7',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  reasonsHeader: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#BF360C',
    marginBottom: 4,
  },
  reasonItem: {
    fontSize: 11.5,
    color: '#D84315',
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
    gap: 14,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtnText: {
    fontSize: 11.5,
    color: '#455A64',
    fontWeight: '600',
  },
});
