import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Linking, Alert, Image, Dimensions, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, getCat } from '../config/api';

const { width: SCREEN_W } = Dimensions.get('window');

function fixPhotoUrl(url) {
  if (!url) return null;
  url = url.trim();
  if (!url.startsWith('http')) return null;
  // Google Drive
  const driveMatch = url.match(/\/d\/([\w-]+)/);
  if (driveMatch) return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  // Semua URL http lainnya langsung pakai
  return url;
}

function getPhotoList(fotoRaw) {
  if (!fotoRaw) return [];
  // Support pemisah: " | " atau "|" atau "\n"
  const parts = fotoRaw.split(/\s*\|\s*|\n/).map(s => s.trim()).filter(Boolean);
  return parts.map(fixPhotoUrl).filter(Boolean);
}

function parseJam(raw) {
  if (!raw) return [];
  const days = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'];
  return days.map(day => {
    const rx = new RegExp(day + '[^|\\n]*?(\\d{2}[.:]\\d{2}[–\\-]\\d{2}[.:]\\d{2}|Buka 24 jam|Tutup)', 'i');
    const m = raw.match(rx);
    return m ? { day, time: m[1].replace('Buka 24 jam','24 jam') } : null;
  }).filter(Boolean);
}

export default function DetailScreen({ route, navigation }) {
  const { sanggar } = route.params;
  const photos  = getPhotoList(sanggar.foto);
  const jamList = parseJam(sanggar.jam_buka);
  const cat     = getCat(sanggar.nama);
  const [activePhoto, setActivePhoto] = useState(0);

  function openMaps() {
    const url = sanggar.link_maps ||
      (sanggar.latitude ? `https://www.google.com/maps?q=${sanggar.latitude},${sanggar.longitude}` : null);
    if (url) Linking.openURL(url);
    else Alert.alert('Info','Link maps tidak tersedia.');
  }

  function openRoute() {
    if (sanggar.latitude && sanggar.longitude) {
      Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${sanggar.latitude},${sanggar.longitude}`);
    } else Alert.alert('Info','Koordinat tidak tersedia.');
  }

  function callPhone() {
    if (sanggar.telepon) Linking.openURL(`tel:${sanggar.telepon}`);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Kembali</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* GALLERY FOTO SLIDE */}
        {photos.length > 0 ? (
          <View>
            <FlatList
              data={photos}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, i) => String(i)}
              onMomentumScrollEnd={e => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
                setActivePhoto(idx);
              }}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={styles.galleryImg}
                  resizeMode="cover"
                  onError={() => {}}
                />
              )}
            />
            {/* Dots */}
            {photos.length > 1 && (
              <View style={styles.dotsRow}>
                {photos.map((_, i) => (
                  <View key={i} style={[styles.dot, i === activePhoto && styles.dotActive]} />
                ))}
              </View>
            )}
            {/* Counter */}
            {photos.length > 1 && (
              <View style={styles.photoCounter}>
                <Text style={styles.photoCounterText}>{activePhoto + 1} / {photos.length}</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoEmoji}>🎭</Text>
            <Text style={styles.photoText}>Foto belum tersedia</Text>
          </View>
        )}

        <View style={styles.body}>
          <Text style={styles.cat}>{cat}</Text>
          <Text style={styles.name}>{sanggar.nama}</Text>

          {/* Info Grid */}
          <View style={styles.infoGrid}>
            {[
              { ico:'📍', key:'ALAMAT',    val: sanggar.alamat || '—' },
              { ico:'📞', key:'TELEPON',   val: sanggar.telepon || '—' },
              { ico:'🏷️', key:'KATEGORI',  val: cat },
              { ico:'🌐', key:'KOORDINAT', val: sanggar.latitude ? `${sanggar.latitude}, ${sanggar.longitude}` : '—' },
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

          {/* Tombol Aksi */}
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
  container:        { flex:1, backgroundColor:COLORS.paper },
  header:           { paddingHorizontal:16, paddingVertical:10, borderBottomWidth:1, borderBottomColor:'rgba(184,134,11,0.18)', backgroundColor:COLORS.paper },
  backBtn:          { alignSelf:'flex-start' },
  backText:         { fontSize:15, color:COLORS.gold, fontWeight:'600' },
  scroll:           { paddingBottom:40 },

  galleryImg:       { width:SCREEN_W, height:260 },
  dotsRow:          { flexDirection:'row', justifyContent:'center', paddingVertical:8 },
  dot:              { width:6, height:6, borderRadius:3, backgroundColor:'rgba(184,134,11,0.25)', marginHorizontal:3 },
  dotActive:        { backgroundColor:COLORS.gold, width:18 },
  photoCounter:     { position:'absolute', top:12, right:12, backgroundColor:'rgba(0,0,0,0.45)', borderRadius:20, paddingHorizontal:10, paddingVertical:4 },
  photoCounterText: { color:'#fff', fontSize:11, fontWeight:'600' },

  photoPlaceholder: { height:200, backgroundColor:COLORS.warm, alignItems:'center', justifyContent:'center' },
  photoEmoji:       { fontSize:56, opacity:0.3 },
  photoText:        { fontSize:12, color:COLORS.muted, fontStyle:'italic', marginTop:6 },

  body:             { padding:20 },
  cat:              { fontSize:10, fontWeight:'700', color:COLORS.gold, letterSpacing:1.5, textTransform:'uppercase', marginBottom:4 },
  name:             { fontSize:26, fontWeight:'700', color:COLORS.ink, lineHeight:30, marginBottom:20 },

  infoGrid:         { marginBottom:20 },
  infoRow:          { flexDirection:'row', gap:10, marginBottom:12 },
  infoIco:          { fontSize:16, marginTop:2 },
  infoContent:      { flex:1 },
  infoKey:          { fontSize:9, fontWeight:'700', color:COLORS.muted, letterSpacing:1, marginBottom:2 },
  infoVal:          { fontSize:13, color:COLORS.text, lineHeight:18 },

  jamBox:           { backgroundColor:COLORS.warm, borderRadius:10, padding:14, marginBottom:20 },
  jamTitle:         { fontSize:9, fontWeight:'700', color:COLORS.muted, letterSpacing:1, marginBottom:10 },
  jamRow:           { flexDirection:'row', justifyContent:'space-between', marginBottom:4 },
  jamDay:           { fontSize:13, color:COLORS.muted },
  jamTime:          { fontSize:13, fontWeight:'600', color:COLORS.ink },

  descBox:          { borderTopWidth:1, borderTopColor:'rgba(184,134,11,0.18)', paddingTop:16, marginBottom:24 },
  descText:         { fontSize:13, color:COLORS.muted, lineHeight:20, fontStyle:'italic' },

  btnPrimary:       { backgroundColor:COLORS.ink, borderRadius:10, paddingVertical:14, alignItems:'center', marginBottom:10 },
  btnPrimaryText:   { color:COLORS.paper, fontSize:14, fontWeight:'700' },
  btnOutline:       { borderWidth:1.5, borderColor:'rgba(0,0,0,0.15)', borderRadius:10, paddingVertical:13, alignItems:'center', marginBottom:10 },
  btnOutlineText:   { color:COLORS.text, fontSize:14, fontWeight:'600' },
});