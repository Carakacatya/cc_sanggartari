import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Linking, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, getCat } from '../config/api';

export default function DetailScreen({ route, navigation }) {
  const { sanggar } = route.params;

  function openMaps() {
    if (sanggar.link_maps) {
      Linking.openURL(sanggar.link_maps);
    } else if (sanggar.latitude && sanggar.longitude) {
      Linking.openURL(`https://www.google.com/maps?q=${sanggar.latitude},${sanggar.longitude}`);
    } else {
      Alert.alert('Info', 'Link maps tidak tersedia.');
    }
  }

  function openRoute() {
    if (sanggar.latitude && sanggar.longitude) {
      Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&destination=${sanggar.latitude},${sanggar.longitude}`
      );
    } else {
      Alert.alert('Info', 'Koordinat tidak tersedia.');
    }
  }

  function callPhone() {
    if (sanggar.telepon) {
      Linking.openURL(`tel:${sanggar.telepon}`);
    }
  }

  function parseJam(raw) {
    if (!raw) return [];
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    return days.map(day => {
      const rx = new RegExp(day + '[^|]*?(\\d{2}[.:]\\d{2}[–\\-]\\d{2}[.:]\\d{2}|Buka 24 jam|Tutup)', 'i');
      const m = raw.match(rx);
      return m ? { day, time: m[1].replace('Buka 24 jam', '24 jam') } : null;
    }).filter(Boolean);
  }

  const jamList = parseJam(sanggar.jam_buka);
  const cat = getCat(sanggar.nama);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Kembali</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Foto placeholder */}
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoEmoji}>🎭</Text>
          <Text style={styles.photoText}>Foto belum tersedia</Text>
        </View>

        <View style={styles.body}>
          {/* Kategori + Nama */}
          <Text style={styles.cat}>{cat}</Text>
          <Text style={styles.name}>{sanggar.nama}</Text>

          {/* Info grid */}
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIco}>📍</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoKey}>ALAMAT</Text>
                <Text style={styles.infoVal}>{sanggar.alamat || '—'}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoIco}>📞</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoKey}>TELEPON</Text>
                <Text style={styles.infoVal}>{sanggar.telepon || '—'}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoIco}>🏷️</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoKey}>KATEGORI</Text>
                <Text style={styles.infoVal}>{cat}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoIco}>🌐</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoKey}>KOORDINAT</Text>
                <Text style={styles.infoVal}>{sanggar.latitude}, {sanggar.longitude}</Text>
              </View>
            </View>
          </View>

          {/* Jam Buka */}
          {jamList.length > 0 && (
            <View style={styles.jamBox}>
              <Text style={styles.jamTitle}>⏰ JAM OPERASIONAL</Text>
              {jamList.map(j => (
                <View key={j.day} style={styles.jamRow}>
                  <Text style={styles.jamDay}>{j.day}</Text>
                  <Text style={[
                    styles.jamTime,
                    j.time === 'Tutup' && { color: COLORS.rust },
                    j.time === '24 jam' && { color: COLORS.sage },
                  ]}>{j.time}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Deskripsi */}
          <View style={styles.descBox}>
            <Text style={styles.descText}>
              {sanggar.deskripsi || 'Deskripsi belum tersedia untuk sanggar ini.'}
            </Text>
          </View>

          {/* Tombol aksi */}
          <TouchableOpacity style={styles.btnPrimary} onPress={openMaps}>
            <Text style={styles.btnPrimaryText}>🗺️ Buka Google Maps</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnOutline} onPress={openRoute}>
            <Text style={styles.btnOutlineText}>🧭 Rute ke Sini</Text>
          </TouchableOpacity>

          {sanggar.telepon ? (
            <TouchableOpacity style={styles.btnOutline} onPress={callPhone}>
              <Text style={styles.btnOutlineText}>📞 Hubungi</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: COLORS.paper },
  header:           { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(184,134,11,0.18)', backgroundColor: COLORS.paper },
  backBtn:          { alignSelf: 'flex-start' },
  backText:         { fontSize: 15, color: COLORS.gold, fontWeight: '600' },
  scroll:           { paddingBottom: 40 },
  photoPlaceholder: { height: 200, backgroundColor: COLORS.warm, alignItems: 'center', justifyContent: 'center' },
  photoEmoji:       { fontSize: 56, opacity: 0.3 },
  photoText:        { fontSize: 12, color: COLORS.muted, fontStyle: 'italic', marginTop: 6 },
  body:             { padding: 20 },
  cat:              { fontSize: 10, fontWeight: '700', color: COLORS.gold, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  name:             { fontSize: 26, fontWeight: '700', color: COLORS.ink, lineHeight: 30, marginBottom: 20 },
  infoGrid:         { gap: 12, marginBottom: 20 },
  infoRow:          { flexDirection: 'row', gap: 10 },
  infoIco:          { fontSize: 16, marginTop: 2 },
  infoContent:      { flex: 1 },
  infoKey:          { fontSize: 9, fontWeight: '700', color: COLORS.muted, letterSpacing: 1, marginBottom: 2 },
  infoVal:          { fontSize: 13, color: COLORS.text, lineHeight: 18 },
  jamBox:           { backgroundColor: COLORS.warm, borderRadius: 10, padding: 14, marginBottom: 20 },
  jamTitle:         { fontSize: 9, fontWeight: '700', color: COLORS.muted, letterSpacing: 1, marginBottom: 10 },
  jamRow:           { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  jamDay:           { fontSize: 13, color: COLORS.muted },
  jamTime:          { fontSize: 13, fontWeight: '600', color: COLORS.ink },
  descBox:          { borderTopWidth: 1, borderTopColor: 'rgba(184,134,11,0.18)', paddingTop: 16, marginBottom: 24 },
  descText:         { fontSize: 13, color: COLORS.muted, lineHeight: 20, fontStyle: 'italic' },
  btnPrimary:       { backgroundColor: COLORS.ink, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  btnPrimaryText:   { color: COLORS.paper, fontSize: 14, fontWeight: '700' },
  btnOutline:       { borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.15)', borderRadius: 10, paddingVertical: 13, alignItems: 'center', marginBottom: 10 },
  btnOutlineText:   { color: COLORS.text, fontSize: 14, fontWeight: '600' },
});