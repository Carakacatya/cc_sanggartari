import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
  TouchableOpacity, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../config/api';

const CAT_COLOR = {
  'Pagelaran': '#7c3aed',
  'Event':     '#0369a1',
  'Festival':  '#b45309',
  'Workshop':  '#0369a1',
  'Pameran':   '#be123c',
  'Berita':    '#065f46',
  'Lainnya':   COLORS.muted,
};

const CAT_ICON = {
  'Pagelaran': '🎭',
  'Event':     '📌',
  'Festival':  '🎪',
  'Workshop':  '📚',
  'Pameran':   '🖼️',
  'Berita':    '📰',
  'Lainnya':   'ℹ️',
};

function fixPhotoUrl(url) {
  if (!url) return null;
  url = url.trim();
  if (!url.startsWith('http')) return null;
  const driveMatch = url.match(/\/d\/([\w-]+)/);
  if (driveMatch) return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  return url;
}

export default function InfoDetailScreen({ route, navigation }) {
  const { info } = route.params;
  const color = CAT_COLOR[info.kategori] || CAT_COLOR['Lainnya'];
  const icon  = CAT_ICON[info.kategori]  || CAT_ICON['Lainnya'];
  const photo = fixPhotoUrl(info.foto);

  function openWebsite() {
    if (info.link) Linking.openURL(info.link);
  }

  function callContact() {
    if (info.kontak) Linking.openURL(`tel:${info.kontak}`);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Kembali</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* FOTO */}
        {photo ? (
          <Image source={{ uri: photo }} style={styles.heroImg} resizeMode="cover" onError={() => {}} />
        ) : (
          <View style={[styles.heroPlaceholder, { backgroundColor: color + '12' }]}>
            <Text style={{ fontSize: 56 }}>{icon}</Text>
          </View>
        )}

        <View style={styles.body}>
          {/* KATEGORI BADGE */}
          <View style={[styles.catBadge, { backgroundColor: color + '18', borderColor: color + '40' }]}>
            <Text style={[styles.catBadgeText, { color }]}>{info.kategori || 'Info'}</Text>
          </View>

          {/* JUDUL */}
          <Text style={styles.title}>{info.judul}</Text>

          {/* INFO GRID */}
          <View style={styles.infoGrid}>
            {[
              { ico:'📅', key:'TANGGAL', val: info.tanggal || '—' },
              { ico:'📍', key:'LOKASI',  val: info.lokasi  || '—' },
              { ico:'🏛', key:'PENYELENGGARA', val: info.penyelenggara || '—' },
              { ico:'☎️', key:'KONTAK', val: info.kontak || '—' },
            ].map(r => (
              <View key={r.key} style={styles.infoRow}>
                <Text style={styles.infoIco}>{r.ico}</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoKey}>{r.key}</Text>
                  <Text style={styles.infoVal}>{r.val}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* DESKRIPSI */}
          <View style={styles.descBox}>
            <Text style={styles.descTitle}>TENTANG ACARA</Text>
            <Text style={styles.descText}>
              {info.deskripsi || 'Deskripsi belum tersedia untuk info ini.'}
            </Text>
          </View>

          {/* TOMBOL AKSI */}
          {info.link ? (
            <TouchableOpacity style={styles.btnPrimary} onPress={openWebsite}>
              <Text style={styles.btnPrimaryText}>🌐 Buka Website Selengkapnya</Text>
            </TouchableOpacity>
          ) : null}

          {info.kontak ? (
            <TouchableOpacity style={styles.btnOutline} onPress={callContact}>
              <Text style={styles.btnOutlineText}>📞 Hubungi {info.penyelenggara || 'Penyelenggara'}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:        { flex:1, backgroundColor:COLORS.paper },
  header:           { paddingHorizontal:16, paddingVertical:10, borderBottomWidth:1, borderBottomColor:'rgba(184,134,11,0.18)', backgroundColor:COLORS.paper },
  backBtn:          { alignSelf:'flex-start' },
  backText:         { fontSize:15, color:COLORS.gold, fontWeight:'600' },
  scroll:           { paddingBottom:40 },

  heroImg:          { width:'100%', height:240 },
  heroPlaceholder:  { width:'100%', height:200, alignItems:'center', justifyContent:'center' },

  body:             { padding:20 },
  catBadge:         { alignSelf:'flex-start', borderWidth:1, borderRadius:99, paddingHorizontal:12, paddingVertical:5, marginBottom:12 },
  catBadgeText:     { fontSize:11, fontWeight:'700', letterSpacing:1 },
  title:            { fontSize:22, fontWeight:'700', color:COLORS.ink, lineHeight:28, marginBottom:20 },

  infoGrid:         { marginBottom:20 },
  infoRow:          { flexDirection:'row', gap:10, marginBottom:14 },
  infoIco:          { fontSize:16, marginTop:2 },
  infoContent:      { flex:1 },
  infoKey:          { fontSize:9, fontWeight:'700', color:COLORS.muted, letterSpacing:1, marginBottom:2 },
  infoVal:          { fontSize:14, color:COLORS.text, lineHeight:19 },

  descBox:          { borderTopWidth:1, borderTopColor:'rgba(184,134,11,0.18)', paddingTop:16, marginBottom:24 },
  descTitle:        { fontSize:9, fontWeight:'700', color:COLORS.muted, letterSpacing:1, marginBottom:10 },
  descText:         { fontSize:14, color:COLORS.text, lineHeight:22 },

  btnPrimary:       { backgroundColor:COLORS.ink, borderRadius:10, paddingVertical:14, alignItems:'center', marginBottom:10 },
  btnPrimaryText:   { color:COLORS.paper, fontSize:14, fontWeight:'700' },
  btnOutline:       { borderWidth:1.5, borderColor:'rgba(0,0,0,0.15)', borderRadius:10, paddingVertical:13, alignItems:'center', marginBottom:10 },
  btnOutlineText:   { color:COLORS.text, fontSize:14, fontWeight:'600' },
});