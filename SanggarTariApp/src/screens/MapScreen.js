import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { GAS_URL, COLORS, getCat } from '../config/api';

export default function MapScreen({ navigation }) {
  const [sanggarList, setSanggarList] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  // Fetch data dari GAS
  useEffect(() => {
    fetch(`${GAS_URL}?action=getAll`)
      .then(r => r.json())
      .then(j => {
        if (j.status === 'ok') setSanggarList(j.data);
        else loadFallback();
      })
      .catch(() => loadFallback())
      .finally(() => setLoading(false));
  }, []);

  function loadFallback() {
    setSanggarList([
      { id: 1, nama: 'Sanggar Tari Sekar Tunjung', alamat: 'Jl. Simo Katrungan Kidul No.33, Sawahan, Surabaya', latitude: -7.2706115, longitude: 112.7141571 },
      { id: 2, nama: 'Marlupi Dance Academy Ngagel', alamat: 'Jl. Ngagel Jaya Tengah No.2, Gubeng, Surabaya', latitude: -7.2914482, longitude: 112.7528804 },
      { id: 3, nama: 'Sanggar Tari Arbaya', alamat: 'Jl. Gubernur Suryo No.11, Genteng, Surabaya', latitude: -7.2637474, longitude: 112.7448196 },
      { id: 4, nama: 'Tydif Studio', alamat: 'Jl. Simo Gn. Barat I No.15, Sukomanunggal, Surabaya', latitude: -7.2701909, longitude: 112.7103556 },
      { id: 5, nama: 'Sanggar Tari Mulyojoyo Enterprise', alamat: 'Jl. Tambak Medokan Ayu Gg. II, Rungkut, Surabaya', latitude: -7.3263975, longitude: 112.7995633 },
      { id: 6, nama: 'Dojo Ngagel Surabaya', alamat: 'Ngagel Madya, Baratajaya, Gubeng, Surabaya', latitude: -7.2888427, longitude: 112.7598657 },
    ]);
  }

  // Tombol lokasi saya
  async function locateUser() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin GPS', 'Izin lokasi diperlukan untuk fitur ini.');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };
    setUserLocation(coords);
    mapRef.current?.animateToRegion({
      ...coords,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }, 1000);
  }

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={COLORS.gold2} />
        <Text style={{ color: COLORS.muted, marginTop: 12 }}>Memuat peta…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🗺️ Peta Sanggar Tari</Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{sanggarList.length}</Text>
        </View>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: -7.2906,
          longitude: 112.7369,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {/* Marker tiap sanggar */}
        {sanggarList.map(item => {
          if (!item.latitude || !item.longitude) return null;
          return (
            <Marker
              key={String(item.id)}
              coordinate={{
                latitude: parseFloat(item.latitude),
                longitude: parseFloat(item.longitude),
              }}
              pinColor={COLORS.gold}
            >
              <Callout onPress={() => navigation.navigate('Detail', { sanggar: item })}>
                <View style={styles.callout}>
                  <Text style={styles.calloutCat}>{getCat(item.nama)}</Text>
                  <Text style={styles.calloutName}>{item.nama}</Text>
                  <Text style={styles.calloutAddr} numberOfLines={2}>
                    📍 {item.alamat || '—'}
                  </Text>
                  <Text style={styles.calloutBtn}>Lihat Detail →</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}

        {/* Marker lokasi user */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            pinColor="#2563eb"
            title="📍 Lokasi Kamu"
          />
        )}
      </MapView>

      {/* Tombol lokasi saya */}
      <TouchableOpacity style={styles.locateBtn} onPress={locateUser}>
        <Text style={styles.locateBtnText}>📍 Lokasi Saya</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: COLORS.paper },
  loadingWrap:  { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.paper },
  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(184,134,11,0.18)', backgroundColor: COLORS.paper },
  headerTitle:  { fontSize: 16, fontWeight: '700', color: COLORS.ink, flex: 1 },
  pill:         { backgroundColor: COLORS.gold, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3 },
  pillText:     { color: '#fff', fontSize: 12, fontWeight: '700' },
  map:          { flex: 1 },
  callout:      { width: 220, padding: 8 },
  calloutCat:   { fontSize: 9, fontWeight: '700', color: COLORS.gold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  calloutName:  { fontSize: 13, fontWeight: '700', color: COLORS.ink, marginBottom: 4 },
  calloutAddr:  { fontSize: 11, color: COLORS.muted, lineHeight: 15, marginBottom: 6 },
  calloutBtn:   { fontSize: 12, fontWeight: '700', color: COLORS.gold },
  locateBtn:    { position: 'absolute', bottom: 24, right: 16, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1.5, borderColor: 'rgba(184,134,11,0.18)', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 },
  locateBtnText:{ fontSize: 13, fontWeight: '700', color: COLORS.text },
});