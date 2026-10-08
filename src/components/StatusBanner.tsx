import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  totalCount: number;
  quarantinedCount: number;
  suspiciousCount: number;
}

export const StatusBanner: React.FC<Props> = ({ totalCount, quarantinedCount, suspiciousCount }) => {
  const threatCount = quarantinedCount + suspiciousCount;
  const hasThreats = threatCount > 0;

  return (
    <View style={[styles.container, hasThreats ? styles.threatContainer : styles.safeContainer]}>
      <View style={styles.iconContainer}>
        <Ionicons 
          name={hasThreats ? "shield-checkmark" : "checkmark-circle"} 
          size={34} 
          color={hasThreats ? "#D32F2F" : "#2E7D32"} 
        />
      </View>
      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: hasThreats ? "#B71C1C" : "#1B5E20" }]}>
            {hasThreats ? "လုံခြုံရေးအကာအကွယ် စနစ် ဖွင့်ထားသည်" : "စက်ပစ္စည်း လုံခြုံစိတ်ချရပါသည်"}
          </Text>
          <View style={[styles.livePill, { backgroundColor: hasThreats ? "#FFCDD2" : "#C8E6C9" }]}>
            <Text style={[styles.livePillText, { color: hasThreats ? "#B71C1C" : "#1B5E20" }]}>
              ● LIVE
            </Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          On-Device AI Engine ဖြင့် စစ်ဆေးထားပါသည် (ကိုယ်ရေးအချက်အလက် မပေါက်ကြားပါ)
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Text style={styles.statLabel}>စုစုပေါင်း:</Text>
            <Text style={styles.statValue}>{totalCount}</Text>
          </View>

          <View style={[styles.statChip, styles.scamStatChip]}>
            <Text style={[styles.statLabel, { color: '#B71C1C' }]}>လိမ်လည်မှု:</Text>
            <Text style={[styles.statValue, { color: '#B71C1C' }]}>{quarantinedCount}</Text>
          </View>

          {suspiciousCount > 0 && (
            <View style={[styles.statChip, styles.suspiciousStatChip]}>
              <Text style={[styles.statLabel, { color: '#E65100' }]}>သတိထားရန်:</Text>
              <Text style={[styles.statValue, { color: '#E65100' }]}>{suspiciousCount}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 16,
    borderWidth: 1.2,
  },
  threatContainer: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
  },
  safeContainer: {
    backgroundColor: '#E8F5E9',
    borderColor: '#C8E6C9',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  livePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  livePillText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 11,
    color: '#607D8B',
    marginBottom: 8,
    lineHeight: 15,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statChip: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignItems: 'center',
    gap: 4,
  },
  scamStatChip: {
    backgroundColor: '#FFEBEE',
  },
  suspiciousStatChip: {
    backgroundColor: '#FFF3E0',
  },
  statLabel: {
    fontSize: 10.5,
    color: '#546E7A',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#263238',
  },
});
