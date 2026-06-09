import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GAS_URL, COLORS, CATEGORIES, getCat } from '../config/api';

export default function HomeScreen({ navigation }) {
  const [allData, setAllData]       = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [search, setSearch]         = useState('');
  const [activeFilter, setActive]   = useState('Semua');
  const [loading, setLoading]       = useState(true);

  // ── Fetch data dari GAS ──
  useEffect(() => {
    fetch(`${GAS_URL}?action=getAll`)
      .then(r => r.json())
      .then(j => {
        if (j.status === 'ok') {
          setAllData(j.data);
          setFiltered(j.data);
        } else {
          loadFallback();
        }
      })
      .catch(() => loadFallback())
      .finally(() => setLoading(false));
  }, []);

  function loadFallback() {
    const fallback = [
      { id: 1, nama: 'Sanggar Tari Sekar Tunjung', alamat: 'Jl. Simo Katrungan Kidul No.33, Sawahan, Surabaya', telepon: '0821-4367-5609', latitude: -7.2706115, longitude: 112.7141571, link_maps: 'https://www.google.com/maps?q=-7.2706115,112.7141571' },
      { id: 2, nama: 'Marlupi Dance Academy Ngagel', alamat: 'Jl. Ngagel Jaya Tengah No.2, Gubeng, Surabaya', telepon: '0813-3535-1580', latitude: -7.2914482, longitude: 112.7528804, link_maps: 'https://www.google.com/maps?q=-7.2914482,112.7528804' },
      { id: 3, nama: 'Sanggar Tari Arbaya', alamat: 'Jl. Gubernur Suryo No.11, Genteng, Surabaya', telepon: '0896-9029-4600', latitude: -7.2637474, longitude: 112.7448196, link_maps: 'https://www.google.com/maps?q=-7.2637474,112.7448196' },
      { id: 4, nama: 'Tydif Studio', alamat: 'Jl. Simo Gn. Barat I No.15, Sukomanunggal, Surabaya', telepon: '0813-5716-7857', latitude: -7.2701909, longitude: 112.7103556, link_maps: 'https://www.google.com/maps?q=-7.2701909,112.7103556' },
      { id: 5, nama: 'Sanggar Tari Mulyojoyo Enterprise', alamat: 'Jl. Tambak Medokan Ayu Gg. II No.100, Rungkut, Surabaya', telepon: '0813-5153-1006', latitude: -7.3263975, longitude: 112.7995633, link_maps: 'https://www.google.com/maps?q=-7.3263975,112.7995633' },
      { id: 6, nama: 'Dojo Ngagel Surabaya', alamat: 'Ngagel Madya, Baratajaya, Gubeng, Surabaya', telepon: '0878-5451-7771', latitude: -7.2888427, longitude: 112.7598657, link_maps: 'https://www.google.com/maps?q=-7.2888427,112.7598657' },
    ];
    setAllData(fallback);
    setFiltered(fallback);
  }

  // ── Filter + Search ──
  useEffect(() => {
    const q = search.toLowerCase();
    const result = allData.filter(d => {
      const okS = !q || (d.nama || '').toLowerCase().includes(q) || (d.alamat || '').toLowerCase().includes(q);
      const okC = activeFilter === 'Semua' || getCat(d.nama) === activeFilter;
      return okS && okC;
    });
    setFiltered(result);
  }, [search, activeFilter, allData]);

  // ── Render kartu sanggar ──
  function renderCard({ item }) {
    const cat = getCat(item.nama);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Detail', { sanggar: item })}
        activeOpacity={0.85}
      >
        {/* Placeholder foto */}
        <View style={styles.cardThumb}>
          <Text style={styles.cardThumbEmoji}>🎭</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardCat}>{cat}</Text>
          <Text style={styles.cardName} numberOfLines={1}>{item.nama}</Text>
          <Text style={styles.cardAddr} numberOfLines={2}>📍 {item.alamat || '—'}</Text>
          {item.telepon ? (
            <Text style={styles.cardPhone} numberOfLines={1}>📞 {item.telepon}</Text>
          ) : null}
        </View>
        <View style={styles.cardArrow}>
          <Text style={{ color: COLORS.gold, fontSize: 18 }}>›</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.paper} />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sanggar<Text style={styles.headerTitleItalic}>Tari</Text> Surabaya</Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{filtered.length}</Text>
        </View>
      </View>

      {/* ── HERO ── */}
      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>— Direktori Budaya · Kota Surabaya —</Text>
        <Text style={styles.heroTitle}>Temukan <Text style={styles.heroTitleGold}>Sanggar Tari</Text></Text>
        <Text style={styles.heroSub}>Direktori lengkap sanggar tari, studio seni, dan akademi budaya di Surabaya.</Text>
      </View>

      {/* ── SEARCH ── */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama sanggar atau alamat..."
          placeholderTextColor={COLORS.muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* ── FILTER CHIPS ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, activeFilter === cat && styles.chipActive]}
            onPress={() => setActive(cat)}
          >
            <Text style={[styles.chipText, activeFilter === cat && styles.chipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── STATS ── */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statN}>{allData.length}</Text>
          <Text style={styles.statL}>TOTAL</Text>
        </View>
        <View style={styles.statDiv} />
        <View style={styles.stat}>
          <Text style={styles.statN}>{filtered.length}</Text>
          <Text style={styles.statL}>TAMPIL</Text>
        </View>
        <View style={styles.statDiv} />
        <View style={styles.stat}>
          <Text style={styles.statN}>10+</Text>
          <Text style={styles.statL}>KECAMATAN</Text>
        </View>
      </View>

      {/* ── LIST ── */}
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={COLORS.gold2} />
          <Text style={styles.loadingText}>Memuat data…</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => String(item.id)}
          renderItem={renderCard}
          contentContainerStyle={{ padding: 12 }}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={{ fontSize: 40 }}>🎭</Text>
              <Text style={styles.emptyText}>Tidak ada hasil.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: COLORS.paper },
  header:           { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(184,134,11,0.18)', backgroundColor: COLORS.paper },
  headerTitle:      { fontSize: 18, fontWeight: '700', color: COLORS.ink, flex: 1 },
  headerTitleItalic:{ fontStyle: 'italic', color: COLORS.gold, fontWeight: '400' },
  pill:             { backgroundColor: COLORS.gold, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3 },
  pillText:         { color: '#fff', fontSize: 12, fontWeight: '700' },

  hero:             { padding: 16, paddingBottom: 8, alignItems: 'center', backgroundColor: COLORS.warm },
  heroEyebrow:      { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: COLORS.gold, marginBottom: 4 },
  heroTitle:        { fontSize: 26, fontWeight: '700', color: COLORS.ink, textAlign: 'center' },
  heroTitleGold:    { color: COLORS.gold, fontStyle: 'italic' },
  heroSub:          { fontSize: 13, color: COLORS.muted, textAlign: 'center', marginTop: 4, lineHeight: 18 },

  searchWrap:       { flexDirection: 'row', alignItems: 'center', margin: 12, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1.5, borderColor: 'rgba(184,134,11,0.18)', paddingHorizontal: 12 },
  searchIcon:       { fontSize: 14, marginRight: 6 },
  searchInput:      { flex: 1, paddingVertical: 10, fontSize: 14, color: COLORS.text },

  filterRow:        { maxHeight: 44, marginBottom: 4 },
  chip:             { backgroundColor: '#fff', borderWidth: 1.5, borderColor: 'rgba(184,134,11,0.18)', borderRadius: 99, paddingHorizontal: 14, paddingVertical: 6, alignSelf: 'flex-start' },
  chipActive:       { backgroundColor: COLORS.ink, borderColor: COLORS.ink },
  chipText:         { fontSize: 12, fontWeight: '500', color: COLORS.muted },
  chipTextActive:   { color: '#fff', fontWeight: '700' },

  statsRow:         { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(184,134,11,0.18)', gap: 24 },
  stat:             { alignItems: 'center' },
  statN:            { fontSize: 22, fontWeight: '700', color: COLORS.ink },
  statL:            { fontSize: 9, fontWeight: '500', color: COLORS.muted, letterSpacing: 1 },
  statDiv:          { width: 1, height: 28, backgroundColor: 'rgba(184,134,11,0.18)' },

  card:             { backgroundColor: '#fff', borderRadius: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)', overflow: 'hidden' },
  cardThumb:        { width: 80, height: 90, backgroundColor: COLORS.warm, alignItems: 'center', justifyContent: 'center' },
  cardThumbEmoji:   { fontSize: 28, opacity: 0.5 },
  cardBody:         { flex: 1, padding: 10 },
  cardCat:          { fontSize: 9, fontWeight: '700', letterSpacing: 1, color: COLORS.gold, textTransform: 'uppercase', marginBottom: 2 },
  cardName:         { fontSize: 14, fontWeight: '700', color: COLORS.ink, marginBottom: 3 },
  cardAddr:         { fontSize: 11, color: COLORS.muted, lineHeight: 16 },
  cardPhone:        { fontSize: 11, color: COLORS.muted, marginTop: 3 },
  cardArrow:        { paddingRight: 12 },

  loadingWrap:      { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText:      { color: COLORS.muted, fontSize: 14 },
  emptyWrap:        { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyText:        { color: COLORS.muted, fontSize: 14 },
});