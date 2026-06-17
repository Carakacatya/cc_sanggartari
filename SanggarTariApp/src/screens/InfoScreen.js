import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Image, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GAS_URL, COLORS } from '../config/api';

const KATEGORI = ['Semua','Pagelaran','Event','Festival','Workshop','Pameran','Berita'];

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

export default function InfoScreen({ navigation }) {
  const [allData, setAllData]   = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCat, setActiveCat] = useState('Semua');
  const [loading, setLoading]   = useState(true);
  const [error, setErrorMsg]    = useState(null);

  useEffect(() => {
    fetch(`${GAS_URL}?action=getInfo`)
      .then(r => r.json())
      .then(j => {
        if (j.status === 'ok') {
          setAllData(j.data || []);
          setFiltered(j.data || []);
        } else {
          setErrorMsg(j.message || 'Gagal memuat data');
        }
      })
      .catch(() => setErrorMsg('Gagal terhubung ke server'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFiltered(activeCat === 'Semua' ? allData : allData.filter(d => d.kategori === activeCat));
  }, [activeCat, allData]);

  function goToDetail(item) {
    navigation.navigate('InfoDetail', { info: item });
  }

  function renderCard({ item }) {
    const color = CAT_COLOR[item.kategori] || CAT_COLOR['Lainnya'];
    const icon  = CAT_ICON[item.kategori]  || CAT_ICON['Lainnya'];
    const photo = fixPhotoUrl(item.foto);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => goToDetail(item)}
      >
        {photo ? (
          <Image source={{ uri: photo }} style={styles.cardImg} resizeMode="cover" onError={()=>{}} />
        ) : (
          <View style={[styles.cardImgPlaceholder, { backgroundColor: color + '12' }]}>
            <Text style={{ fontSize:30 }}>{icon}</Text>
          </View>
        )}
        <View style={styles.cardBody}>
          <View style={[styles.catBadge, { backgroundColor: color + '18', borderColor: color + '40' }]}>
            <Text style={[styles.catBadgeText, { color }]}>{item.kategori || 'Info'}</Text>
          </View>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.judul}</Text>

          {item.tanggal ? <Text style={styles.cardMeta}>📅 {item.tanggal}</Text> : null}
          {item.lokasi  ? <Text style={styles.cardMeta}>📍 {item.lokasi}</Text>  : null}
          {item.kontak  ? <Text style={styles.cardMeta}>☎️ {item.kontak}</Text>  : null}

          {item.deskripsi ? (
            <Text style={styles.cardDesc} numberOfLines={3}>{item.deskripsi}</Text>
          ) : null}

          <View style={styles.cardFooter}>
            {item.penyelenggara ? (
              <Text style={styles.cardOrg} numberOfLines={1}>🏛 {item.penyelenggara}</Text>
            ) : <View />}
            <TouchableOpacity onPress={() => goToDetail(item)}>
              <Text style={styles.cardLink}>Selengkapnya →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // ✅ Hero + filter chip dipindah ke ListHeaderComponent agar ikut scroll
  const ListHeader = () => (
    <>
      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>— Seni & Budaya · Kota Surabaya —</Text>
        <Text style={styles.heroTitle}>Pagelaran & <Text style={styles.heroGold}>Acara Seni</Text></Text>
        <Text style={styles.heroSub}>Info terkini pagelaran tari, festival, dan workshop kesenian di Surabaya.</Text>
      </View>

      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          {KATEGORI.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, activeCat===cat && styles.chipActive]}
              onPress={() => setActiveCat(cat)}
            >
              <Text style={[styles.chipText, activeCat===cat && styles.chipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}>
      {/* HEADER — satu-satunya yang sticky */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎪 Info & Pagelaran</Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{filtered.length}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={COLORS.gold} />
          <Text style={styles.loadingText}>Memuat info…</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyWrap}>
          <Text style={{ fontSize:40 }}>⚠️</Text>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => String(item.id)}
          renderItem={renderCard}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={{ fontSize:40 }}>🎭</Text>
              <Text style={styles.emptyText}>Belum ada info tersedia.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:    { flex:1, backgroundColor:COLORS.paper },
  header:       { flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingVertical:12, borderBottomWidth:1, borderBottomColor:'rgba(184,134,11,0.18)', backgroundColor:COLORS.paper },
  headerTitle:  { fontSize:16, fontWeight:'700', color:COLORS.ink, flex:1 },
  pill:         { backgroundColor:COLORS.gold, borderRadius:99, paddingHorizontal:10, paddingVertical:3 },
  pillText:     { color:'#fff', fontSize:12, fontWeight:'700' },

  hero:         { paddingHorizontal:16, paddingVertical:14, alignItems:'center', backgroundColor:COLORS.warm },
  heroEyebrow:  { fontSize:10, fontWeight:'700', letterSpacing:1.5, color:COLORS.gold, marginBottom:4 },
  heroTitle:    { fontSize:22, fontWeight:'700', color:COLORS.ink, textAlign:'center' },
  heroGold:     { color:COLORS.gold, fontStyle:'italic' },
  heroSub:      { fontSize:12, color:COLORS.muted, textAlign:'center', marginTop:4, lineHeight:17 },

  filterWrapper: { height:42, marginBottom:6 },
  filterContent: { paddingHorizontal:12, alignItems:'center' },
  chip:         { backgroundColor:'#fff', borderWidth:1.5, borderColor:'rgba(184,134,11,0.25)', borderRadius:99, paddingHorizontal:14, paddingVertical:5, marginRight:8, height:32, justifyContent:'center' },
  chipActive:   { backgroundColor:COLORS.ink, borderColor:COLORS.ink },
  chipText:     { fontSize:12, fontWeight:'500', color:COLORS.muted },
  chipTextActive:{ color:'#fff', fontWeight:'700' },

  listContent:  { padding:12, paddingBottom:20 },
  card:         { backgroundColor:'#fff', borderRadius:14, marginBottom:12, overflow:'hidden', borderWidth:1, borderColor:'rgba(0,0,0,0.06)', elevation:2, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.07, shadowRadius:4 },
  cardImg:      { width:'100%', height:160 },
  cardImgPlaceholder: { width:'100%', height:110, alignItems:'center', justifyContent:'center' },
  cardBody:     { padding:14 },
  catBadge:     { alignSelf:'flex-start', borderWidth:1, borderRadius:99, paddingHorizontal:10, paddingVertical:3, marginBottom:8 },
  catBadgeText: { fontSize:9, fontWeight:'700', letterSpacing:1 },
  cardTitle:    { fontSize:15, fontWeight:'700', color:COLORS.ink, marginBottom:8, lineHeight:21 },
  cardMeta:     { fontSize:11, color:COLORS.muted, marginBottom:3 },
  cardDesc:     { fontSize:12, color:COLORS.muted, lineHeight:18, marginTop:6, marginBottom:10 },
  cardFooter:   { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:4 },
  cardOrg:      { fontSize:11, color:COLORS.muted, flex:1, marginRight:8 },
  cardLink:     { fontSize:12, fontWeight:'700', color:COLORS.gold },

  loadingWrap:  { flex:1, alignItems:'center', justifyContent:'center' },
  loadingText:  { color:COLORS.muted, marginTop:12 },
  emptyWrap:    { alignItems:'center', paddingTop:60, paddingHorizontal:24 },
  emptyText:    { color:COLORS.muted, fontSize:14, marginTop:8, textAlign:'center' },
});