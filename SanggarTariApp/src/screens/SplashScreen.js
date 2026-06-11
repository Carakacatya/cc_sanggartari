import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { COLORS } from '../config/api';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const scaleAnim  = useRef(new Animated.Value(0.8)).current;
  const fadeOut    = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade + scale in
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue:1, duration:700, useNativeDriver:true }),
      Animated.spring(scaleAnim, { toValue:1, friction:5, tension:80, useNativeDriver:true }),
    ]).start();

    // Fade out setelah 2.5 detik
    const timer = setTimeout(() => {
      Animated.timing(fadeOut, { toValue:0, duration:500, useNativeDriver:true })
        .start(() => onFinish());
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform:[{ scale: scaleAnim }] }]}>
        {/* LOGO */}
        <View style={styles.logoWrap}>
          <View style={styles.logoOuter}>
            <View style={styles.logoInner}>
              {/* Siluet penari - SVG-like dengan View */}
              <Text style={styles.logoEmoji}>🎭</Text>
            </View>
            {/* Lingkaran dekorasi */}
            <View style={styles.deco1} />
            <View style={styles.deco2} />
            <View style={styles.deco3} />
          </View>
        </View>

        {/* JUDUL */}
        <Text style={styles.title}>
          Sanggar<Text style={styles.titleGold}>Tari</Text>
        </Text>
        <Text style={styles.subtitle}>S U R A B A Y A</Text>

        {/* TAGLINE */}
        <View style={styles.divider} />
        <Text style={styles.tagline}>Direktori Budaya Kota Surabaya</Text>
      </Animated.View>

      {/* FOOTER */}
      <Animated.Text style={[styles.footer, { opacity: fadeAnim }]}>
        Mata Kuliah Cloud Computing
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: COLORS.paper,
    alignItems:'center',
    justifyContent:'center',
  },
  content:      { alignItems:'center' },

  logoWrap:     { marginBottom:28, position:'relative' },
  logoOuter:    {
    width:120, height:120, borderRadius:60,
    backgroundColor: COLORS.warm,
    alignItems:'center', justifyContent:'center',
    borderWidth:2, borderColor:'rgba(184,134,11,0.25)',
    elevation:8, shadowColor:COLORS.gold,
    shadowOffset:{width:0,height:4}, shadowOpacity:0.2, shadowRadius:12,
  },
  logoInner:    {
    width:84, height:84, borderRadius:42,
    backgroundColor:'#fff',
    alignItems:'center', justifyContent:'center',
    borderWidth:1.5, borderColor:'rgba(184,134,11,0.15)',
  },
  logoEmoji:    { fontSize:42 },
  deco1:        { position:'absolute', top:-6, right:-6, width:20, height:20, borderRadius:10, backgroundColor:COLORS.gold, opacity:0.7 },
  deco2:        { position:'absolute', bottom:-4, left:-4, width:14, height:14, borderRadius:7, backgroundColor:COLORS.gold, opacity:0.4 },
  deco3:        { position:'absolute', top:10, left:-10, width:10, height:10, borderRadius:5, backgroundColor:COLORS.gold, opacity:0.3 },

  title:        { fontSize:38, fontWeight:'700', color:COLORS.ink, letterSpacing:-1 },
  titleGold:    { color:COLORS.gold, fontStyle:'italic', fontWeight:'400' },
  subtitle:     { fontSize:14, fontWeight:'700', color:COLORS.ink, letterSpacing:6, marginTop:2 },

  divider:      { width:48, height:2, backgroundColor:COLORS.gold, borderRadius:1, marginVertical:16, opacity:0.6 },
  tagline:      { fontSize:12, color:COLORS.muted, letterSpacing:0.5 },

  footer:       { position:'absolute', bottom:48, fontSize:11, color:COLORS.muted, letterSpacing:0.3 },
});