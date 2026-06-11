import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { GAS_URL, COLORS, getCat } from '../config/api';

// ✅ GANTI DENGAN API KEY ORS KAMU
const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjZmNDg4NDE1Yjg1NTRmYzg5N2Y3MjQ3MzUxNWJlYmNkIiwiaCI6Im11cm11cjY0In0=';

// Decode polyline encoding dari ORS
function decodePolyline(encoded) {
  const points = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : result >> 1;
    shift = 0; result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : result >> 1;
    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
}

function formatDuration(seconds) {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m} menit`;
  const h = Math.floor(m / 60), rm = m % 60;
  return rm > 0 ? `${h} jam ${rm} menit` : `${h} jam`;
}

function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export default function MapScreen({ navigation }) {
  const [sanggarList, setSanggarList]   = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [routeCoords, setRouteCoords]   = useState([]);   // ✅ array titik rute jalan
  const [routeInfo, setRouteInfo]       = useState(null); // ✅ { duration, distance }
  const [routeLoading, setRouteLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading]           = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    fetch(`${GAS_URL}?action=getAll`)
      .then(r => r.json())
      .then(j => {
        if (j.status === 'ok') setSanggarList(j.data);
        else loadFallback();
      })
      .catch(() => loadFallback())
      .finally(() => setLoading(false));

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      }
    })();
  }, []);

  function loadFallback() {
    setSanggarList([
      { id:1, nama:'Sanggar Tari Sekar Tunjung', alamat:'Jl. Simo Katrungan Kidul No.33, Sawahan, Surabaya', latitude:-7.2706115, longitude:112.7141571 },
      { id:2, nama:'Marlupi Dance Academy Ngagel', alamat:'Jl. Ngagel Jaya Tengah No.2, Gubeng, Surabaya', latitude:-7.2914482, longitude:112.7528804 },
      { id:3, nama:'Sanggar Tari Arbaya', alamat:'Jl. Gubernur Suryo No.11, Genteng, Surabaya', latitude:-7.2637474, longitude:112.7448196 },
      { id:4, nama:'Tydif Studio', alamat:'Jl. Simo Gn. Barat I No.15, Sukomanunggal, Surabaya', latitude:-7.2701909, longitude:112.7103556 },
      { id:5, nama:'Sanggar Tari Mulyojoyo', alamat:'Jl. Tambak Medokan Ayu, Rungkut, Surabaya', latitude:-7.3263975, longitude:112.7995633 },
      { id:6, nama:'Dojo Ngagel Surabaya', alamat:'Ngagel Madya, Gubeng, Surabaya', latitude:-7.2888427, longitude:112.7598657 },
    ]);
  }

  // ✅ Fetch rute dari ORS
  async function fetchRoute(from, to) {
    setRouteLoading(true);
    setRouteCoords([]);
    setRouteInfo(null);
    try {
      const res = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?` +
        `api_key=${ORS_API_KEY}` +
        `&start=${from.longitude},${from.latitude}` +
        `&end=${to.longitude},${to.latitude}`
      );
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const feature  = data.features[0];
        const coords   = feature.geometry.coordinates; // [lng, lat]
        const summary  = feature.properties.summary;
        setRouteCoords(coords.map(([lng, lat]) => ({ latitude: lat, longitude: lng })));
        setRouteInfo({
          duration: formatDuration(summary.duration),
          distance: formatDistance(summary.distance),
        });
      } else {
        // Fallback: garis lurus jika ORS gagal
        setRouteCoords([from, to]);
      }
    } catch (e) {
      // Fallback: garis lurus jika tidak ada internet / quota habis
      setRouteCoords([from, to]);
    } finally {
      setRouteLoading(false);
    }
  }

  async function locateUser() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin GPS', 'Izin lokasi diperlukan untuk fitur ini.');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
    setUserLocation(coords);
    mapRef.current?.animateToRegion({ ...coords, latitudeDelta:0.05, longitudeDelta:0.05 }, 1000);
  }

  function handleMarkerPress(item) {
    const lat = parseFloat(item.latitude);
    const lng = parseFloat(item.longitude);
    if (isNaN(lat) || isNaN(lng)) return;

    const target = { latitude: lat, longitude: lng };
    setSelectedItem(item);

    // Fetch rute jalan jika ada lokasi user
    if (userLocation) {
      fetchRoute(userLocation, target);
      mapRef.current?.fitToCoordinates(
        [userLocation, target],
        { edgePadding: { top:120, right:60, bottom:300, left:60 }, animated: true }
      );
    } else {
      setRouteCoords([]);
      setRouteInfo(null);
      mapRef.current?.animateToRegion({
        latitude: lat, longitude: lng,
        latitudeDelta: 0.04, longitudeDelta: 0.04,
      }, 800);
    }
  }

  function closePopup() {
    setSelectedItem(null);
    setRouteCoords([]);
    setRouteInfo(null);
  }

  function goToDetail() {
    const item = selectedItem;
    closePopup();
    navigation.navigate('Detail', { sanggar: item });
  }

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={COLORS.gold} />
        <Text style={{ color:COLORS.muted, marginTop:12 }}>Memuat peta…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right']}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🗺️ Peta Sanggar Tari</Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{sanggarList.length}</Text>
        </View>
      </View>

      {/* MAP */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude:-7.2906, longitude:112.7369,
            latitudeDelta:0.15, longitudeDelta:0.15,
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
          onPress={closePopup}
        >
          {sanggarList.map(item => {
            const lat = parseFloat(item.latitude);
            const lng = parseFloat(item.longitude);
            if (isNaN(lat) || isNaN(lng)) return null;
            const isSelected = selectedItem && String(selectedItem.id) === String(item.id);
            return (
              <Marker
                key={String(item.id)}
                coordinate={{ latitude:lat, longitude:lng }}
                pinColor={isSelected ? '#2563eb' : COLORS.gold}
                onPress={e => { e.stopPropagation(); handleMarkerPress(item); }}
              />
            );
          })}

          {/* ✅ Rute mengikuti jalan */}
          {routeCoords.length > 1 && (
            <Polyline
              coordinates={routeCoords}
              strokeColor="#2563eb"
              strokeWidth={5}
              lineDashPattern={undefined} // solid line mengikuti jalan
            />
          )}
        </MapView>

        {/* Loading rute */}
        {routeLoading && (
          <View style={styles.routeLoadingBadge}>
            <ActivityIndicator size="small" color="#2563eb" />
            <Text style={styles.routeLoadingText}>Menghitung rute…</Text>
          </View>
        )}

        <TouchableOpacity style={styles.locateBtn} onPress={locateUser}>
          <Text style={styles.locateBtnText}>📍 Lokasi Saya</Text>
        </TouchableOpacity>
      </View>

      {/* POPUP — di luar mapContainer agar tidak diblok MapView */}
      {selectedItem && (
        <View style={styles.popup}>
          <View style={styles.popupHandle} />
          <TouchableOpacity activeOpacity={1} onPress={() => {}} style={styles.popupContent}>
            <Text style={styles.popupCat}>{getCat(selectedItem.nama)}</Text>
            <Text style={styles.popupName} numberOfLines={2}>{selectedItem.nama}</Text>
            <Text style={styles.popupAddr} numberOfLines={2}>
              📍 {selectedItem.alamat || '—'}
            </Text>

            {/* ✅ Info durasi & jarak */}
            {routeLoading ? (
              <View style={styles.routeInfoRow}>
                <ActivityIndicator size="small" color="#2563eb" style={{ marginRight:6 }} />
                <Text style={styles.routeInfoText}>Menghitung rute…</Text>
              </View>
            ) : routeInfo ? (
              <View style={styles.routeInfoRow}>
                <View style={styles.routeInfoBadge}>
                  <Text style={styles.routeInfoIcon}>🕐</Text>
                  <Text style={styles.routeInfoVal}>{routeInfo.duration}</Text>
                </View>
                <View style={[styles.routeInfoBadge, { marginLeft:8 }]}>
                  <Text style={styles.routeInfoIcon}>📏</Text>
                  <Text style={styles.routeInfoVal}>{routeInfo.distance}</Text>
                </View>
              </View>
            ) : userLocation ? (
              <Text style={styles.popupRouteFallback}>🔵 Garis biru menunjukkan arah ke sanggar ini</Text>
            ) : null}

            <View style={styles.popupBtns}>
              <TouchableOpacity style={styles.btnClose} onPress={closePopup}>
                <Text style={styles.btnCloseText}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnDetail} onPress={goToDetail} activeOpacity={0.75}>
                <Text style={styles.btnDetailText}>Lihat Detail →</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:          { flex:1, backgroundColor:COLORS.paper },
  loadingWrap:        { flex:1, alignItems:'center', justifyContent:'center', backgroundColor:COLORS.paper },
  header:             { flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingVertical:12, borderBottomWidth:1, borderBottomColor:'rgba(184,134,11,0.18)', backgroundColor:COLORS.paper },
  headerTitle:        { fontSize:16, fontWeight:'700', color:COLORS.ink, flex:1 },
  pill:               { backgroundColor:COLORS.gold, borderRadius:99, paddingHorizontal:10, paddingVertical:3 },
  pillText:           { color:'#fff', fontSize:12, fontWeight:'700' },

  mapContainer:       { flex:1, position:'relative' },

  routeLoadingBadge:  { position:'absolute', top:12, alignSelf:'center', left:'25%', right:'25%', backgroundColor:'#fff', borderRadius:20, paddingHorizontal:14, paddingVertical:7, flexDirection:'row', alignItems:'center', elevation:4, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.15, shadowRadius:4 },
  routeLoadingText:   { fontSize:12, color:'#2563eb', fontWeight:'600', marginLeft:6 },

  locateBtn:          { position:'absolute', bottom:16, right:16, backgroundColor:'#fff', borderRadius:10, paddingHorizontal:16, paddingVertical:10, borderWidth:1.5, borderColor:'rgba(184,134,11,0.25)', elevation:4, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.15, shadowRadius:4 },
  locateBtnText:      { fontSize:13, fontWeight:'700', color:COLORS.text },

  popup:              { backgroundColor:'#fff', borderTopLeftRadius:20, borderTopRightRadius:20, paddingBottom:20, elevation:16, shadowColor:'#000', shadowOffset:{width:0,height:-4}, shadowOpacity:0.15, shadowRadius:12 },
  popupHandle:        { width:40, height:4, backgroundColor:'rgba(0,0,0,0.15)', borderRadius:2, alignSelf:'center', marginVertical:10 },
  popupContent:       { paddingHorizontal:20, paddingBottom:4 },
  popupCat:           { fontSize:9, fontWeight:'700', color:COLORS.gold, textTransform:'uppercase', letterSpacing:1.5, marginBottom:4 },
  popupName:          { fontSize:17, fontWeight:'700', color:COLORS.ink, marginBottom:6, lineHeight:23 },
  popupAddr:          { fontSize:12, color:COLORS.muted, lineHeight:17, marginBottom:10 },
  popupRouteFallback: { fontSize:11, color:'#2563eb', fontWeight:'600', marginBottom:14 },

  // ✅ Badge durasi & jarak
  routeInfoRow:       { flexDirection:'row', alignItems:'center', marginBottom:14 },
  routeInfoBadge:     { flexDirection:'row', alignItems:'center', backgroundColor:'#eff6ff', borderRadius:8, paddingHorizontal:10, paddingVertical:5 },
  routeInfoIcon:      { fontSize:12, marginRight:4 },
  routeInfoVal:       { fontSize:13, fontWeight:'700', color:'#2563eb' },

  popupBtns:          { flexDirection:'row', gap:10 },
  btnClose:           { width:46, backgroundColor:'rgba(0,0,0,0.06)', borderRadius:10, alignItems:'center', justifyContent:'center' },
  btnCloseText:       { fontSize:16, color:COLORS.muted },
  btnDetail:          { flex:1, backgroundColor:COLORS.ink, borderRadius:10, paddingVertical:13, alignItems:'center' },
  btnDetailText:      { color:'#fff', fontSize:14, fontWeight:'700' },
});