import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  quarantinedCount: number;
  suspiciousCount: number;
}

export const StatusBanner: React.FC<Props> = ({ quarantinedCount, suspiciousCount }) => {
  const hasThreats = quarantinedCount > 0 || suspiciousCount > 0;

  return (
    <View style={[styles.container, hasThreats ? styles.threatContainer : styles.safeContainer]}>
      <View style={styles.iconContainer}>
        <Ionicons 
          name={hasThreats ? "shield-checkmark" : "checkmark-circle"} 
          size={32} 
          color={hasThreats ? "#D32F2F" : "#2E7D32"} 
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: hasThreats ? "#B71C1C" : "#1B5E20" }]}>
          {hasThreats ? "လုံခြုံရေးအကာအကွယ် စနစ် အလုပ်လုပ်နေသည်" : "လုံခြုံစိတ်ချရပါသည်"}
        </Text>
        <Text style={styles.subtitle}>
          စက်ပစ္စည်းတွင်း (On-Device ML) ဖြင့် စစ်ဆေးထားသည်
        </Text>
        {hasThreats && (
          <Text style={styles.badgeText}>
            🚫 လိမ်လည်မက်ဆေ့ခ်ျ ({quarantinedCount}) စောင် သီးသန့်ခွဲထုတ်ထားသည်
          </Text>
        )}
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
    borderRadius: 14,
    borderWidth: 1,
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
  title: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C62828',
  },
});
