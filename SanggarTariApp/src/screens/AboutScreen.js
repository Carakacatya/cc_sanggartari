import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../config/api';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ℹ️ Tentang Aplikasi</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroBox}>
          <Text style={styles.heroEmoji}>🎭</Text>
          <Text style={styles.heroTitle}>Sanggar<Text style={styles.heroTitleGold}>Tari</Text> Surabaya</Text>
          <Text style={styles.heroSub}>Direktori Budaya Kota Surabaya</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 Tentang</Text>
          <Text style={styles.cardText}>
            Aplikasi direktori sanggar tari, studio seni, dan akademi budaya di Surabaya.
            Temukan sanggar terdekat, lihat detail, jam buka, dan buka rute langsung dari HP.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🛠️ Teknologi</Text>
          {[
            ['📱 Mobile App', 'React Native (Expo)'],
            ['🗺️ Peta', 'react-native-maps'],
            ['📡 Backend API', 'Google Apps Script'],
            ['🗄️ Database', 'Google Sheets'],
            ['📍 GPS', 'expo-location'],
          ].map(([k, v]) => (
            <View key={k} style={styles.techRow}>
              <Text style={styles.techKey}>{k}</Text>
              <Text style={styles.techVal}>{v}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎓 Informasi</Text>
          <Text style={styles.cardText}>
            Dibuat untuk memenuhi tugas Mata Kuliah{'\n'}
            <Text style={{ fontWeight: '700', color: COLORS.gold }}>Cloud Computing</Text>
          </Text>
        </View>

        <Text style={styles.footer}>
          Backend: Google Apps Script · DB: Google Sheets
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: COLORS.paper },
  header:       { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(184,134,11,0.18)', backgroundColor: COLORS.paper },
  headerTitle:  { fontSize: 16, fontWeight: '700', color: COLORS.ink },
  scroll:       { padding: 16, paddingBottom: 40 },
  heroBox:      { alignItems: 'center', paddingVertical: 28, backgroundColor: COLORS.warm, borderRadius: 16, marginBottom: 16 },
  heroEmoji:    { fontSize: 48, marginBottom: 8 },
  heroTitle:    { fontSize: 24, fontWeight: '700', color: COLORS.ink },
  heroTitleGold:{ color: COLORS.gold, fontStyle: 'italic', fontWeight: '400' },
  heroSub:      { fontSize: 12, color: COLORS.muted, marginTop: 4, letterSpacing: 1 },
  card:         { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(184,134,11,0.12)' },
  cardTitle:    { fontSize: 14, fontWeight: '700', color: COLORS.ink, marginBottom: 10 },
  cardText:     { fontSize: 13, color: COLORS.muted, lineHeight: 20 },
  techRow:      { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(184,134,11,0.1)' },
  techKey:      { fontSize: 12, color: COLORS.muted },
  techVal:      { fontSize: 12, fontWeight: '600', color: COLORS.text },
  footer:       { textAlign: 'center', fontSize: 11, color: COLORS.muted, marginTop: 8 },
});