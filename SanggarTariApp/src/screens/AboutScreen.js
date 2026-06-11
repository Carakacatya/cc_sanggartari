import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../config/api';

const FEATURES = [
  { icon: '🗺️', title: 'Peta Interaktif', desc: 'Lihat semua sanggar tari langsung di peta Surabaya dengan marker yang jelas.' },
  { icon: '📍', title: 'GPS & Navigasi', desc: 'Deteksi lokasi kamu dan buka rute menuju sanggar pilihan secara langsung.' },
  { icon: '🔍', title: 'Cari & Filter', desc: 'Cari berdasarkan nama, alamat, atau filter berdasarkan kategori sanggar.' },
  { icon: '📋', title: 'Info Lengkap', desc: 'Jam buka, alamat, nomor telepon, dan koordinat tiap sanggar tersedia.' },
  { icon: '🧭', title: 'Navigasi Langsung', desc: 'Tombol rute membuka Google Maps dengan tujuan otomatis ke sanggar.' },
];

const STATS = [
  { n: '98+', label: 'Sanggar Terdaftar' },
  { n: '10+', label: 'Kecamatan' },
  { n: '5',   label: 'Kategori' },
];

const TECH = [
  ['📱 Mobile App',   'React Native (Expo)'],
  ['🗺️ Peta',         'react-native-maps'],
  ['📡 Backend API',  'Google Apps Script'],
  ['🗄️ Database',     'Google Sheets'],
  ['📍 GPS',          'expo-location'],
  ['🌐 Platform',     'Android & iOS'],
];

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ℹ️ Tentang Aplikasi</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* HERO LOGO */}
        <View style={styles.heroBox}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🎭</Text>
          </View>
          <Text style={styles.heroTitle}>
            Sanggar<Text style={styles.heroGold}>Tari</Text>
          </Text>
          <Text style={styles.heroSub}>Surabaya</Text>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>DIREKTORI BUDAYA KOTA SURABAYA</Text>
          </View>
        </View>

        {/* DESKRIPSI */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📖 Tentang Direktori</Text>
          <Text style={styles.cardText}>
            Aplikasi direktori resmi sanggar tari, studio seni, dan akademi budaya di Kota Surabaya.
            Dirancang untuk memudahkan masyarakat menemukan sanggar tari terdekat, melihat
            informasi lengkap, dan mendapatkan rute navigasi langsung dari lokasi.
          </Text>
        </View>

        {/* STATISTIK */}
        <View style={styles.statsCard}>
          {STATS.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <View style={styles.statsDivider} />}
              <View style={styles.statItem}>
                <Text style={styles.statN}>{s.n}</Text>
                <Text style={styles.statL}>{s.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* FITUR */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>✨ Fitur Unggulan</Text>
          {FEATURES.map(f => (
            <View key={f.title} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Text style={{ fontSize: 18 }}>{f.icon}</Text>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* TEKNOLOGI */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🛠️ Teknologi</Text>
          {TECH.map(([k, v]) => (
            <View key={k} style={styles.techRow}>
              <Text style={styles.techKey}>{k}</Text>
              <Text style={styles.techVal}>{v}</Text>
            </View>
          ))}
        </View>

        {/* FOOTER */}
        <View style={styles.footerBox}>
          <Text style={styles.footerLine}>Mata Kuliah Cloud Computing</Text>
          <Text style={styles.footerLine2}>
            Backend: Google Apps Script  ·  DB: Google Sheets
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex:1, backgroundColor:COLORS.paper },
  header:         { paddingHorizontal:16, paddingVertical:12, borderBottomWidth:1, borderBottomColor:'rgba(184,134,11,0.18)', backgroundColor:COLORS.paper },
  headerTitle:    { fontSize:16, fontWeight:'700', color:COLORS.ink },
  scroll:         { padding:16, paddingBottom:40 },

  heroBox:        { alignItems:'center', paddingVertical:28, backgroundColor:COLORS.warm, borderRadius:16, marginBottom:16, borderWidth:1, borderColor:'rgba(184,134,11,0.15)' },
  logoCircle:     { width:80, height:80, borderRadius:40, backgroundColor:'#fff', alignItems:'center', justifyContent:'center', marginBottom:12, borderWidth:2, borderColor:'rgba(184,134,11,0.2)', elevation:3, shadowColor:COLORS.gold, shadowOffset:{width:0,height:2}, shadowOpacity:0.15, shadowRadius:6 },
  logoEmoji:      { fontSize:38 },
  heroTitle:      { fontSize:28, fontWeight:'700', color:COLORS.ink, letterSpacing:-0.5 },
  heroGold:       { color:COLORS.gold, fontStyle:'italic', fontWeight:'400' },
  heroSub:        { fontSize:20, fontWeight:'700', color:COLORS.ink, letterSpacing:2, marginTop:-2 },
  heroBadge:      { marginTop:12, backgroundColor:COLORS.gold, borderRadius:99, paddingHorizontal:14, paddingVertical:5 },
  heroBadgeText:  { color:'#fff', fontSize:9, fontWeight:'700', letterSpacing:1.5 },

  statsCard:      { flexDirection:'row', backgroundColor:'#fff', borderRadius:14, padding:16, marginBottom:16, borderWidth:1, borderColor:'rgba(184,134,11,0.12)', elevation:1 },
  statItem:       { flex:1, alignItems:'center' },
  statN:          { fontSize:26, fontWeight:'700', color:COLORS.gold },
  statL:          { fontSize:10, fontWeight:'600', color:COLORS.muted, textAlign:'center', marginTop:2 },
  statsDivider:   { width:1, backgroundColor:'rgba(184,134,11,0.15)', marginVertical:4 },

  card:           { backgroundColor:'#fff', borderRadius:14, padding:16, marginBottom:14, borderWidth:1, borderColor:'rgba(184,134,11,0.12)', elevation:1 },
  cardTitle:      { fontSize:14, fontWeight:'700', color:COLORS.ink, marginBottom:12 },
  cardText:       { fontSize:13, color:COLORS.muted, lineHeight:20 },

  featureRow:     { flexDirection:'row', marginBottom:12, alignItems:'flex-start' },
  featureIcon:    { width:38, height:38, borderRadius:10, backgroundColor:COLORS.warm, alignItems:'center', justifyContent:'center', marginRight:12, flexShrink:0 },
  featureContent: { flex:1 },
  featureTitle:   { fontSize:13, fontWeight:'700', color:COLORS.ink, marginBottom:2 },
  featureDesc:    { fontSize:12, color:COLORS.muted, lineHeight:17 },

  techRow:        { flexDirection:'row', justifyContent:'space-between', paddingVertical:8, borderBottomWidth:1, borderBottomColor:'rgba(184,134,11,0.08)' },
  techKey:        { fontSize:12, color:COLORS.muted },
  techVal:        { fontSize:12, fontWeight:'600', color:COLORS.text },

  footerBox:      { alignItems:'center', paddingTop:8 },
  footerLine:     { fontSize:12, fontWeight:'600', color:COLORS.gold },
  footerLine2:    { fontSize:11, color:COLORS.muted, marginTop:4 },
});