import React, {useMemo,useRef} from 'react';
import {Animated, Platform, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Session} from './model';
import {SessionRecord} from './SessionRecord';
import {Colors} from './theme';
import {useTheme} from './ThemeProvider';

export function SessionDetail({session,onClose}:{session:Session;onClose:()=>void}) {
 const {colors:c}=useTheme();const s=useMemo(()=>createStyles(c),[c]);
 const offset=useRef(new Animated.Value(0)).current;
 return <View style={s.screen}>
  <View style={s.header}>
   <Animated.View pointerEvents="none" style={[s.glass,{opacity:offset.interpolate({inputRange:[0,64],outputRange:[0,1],extrapolate:'clamp'})}]}/>
   <Pressable accessibilityRole="button" accessibilityLabel="Back to workout history" onPress={onClose} style={({pressed})=>[s.back,{opacity:pressed?.7:1}]}><Ionicons name="close" size={20} color={c.accent}/></Pressable>
   <Text style={s.title}>Session record</Text><View style={s.balance}/>
  </View>
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content} scrollEventThrottle={16} onScroll={event=>offset.setValue(Math.max(0,event.nativeEvent.contentOffset.y))}>
   <SessionRecord session={session}/>{!!session.note&&<View style={{marginTop:20,padding:20,borderRadius:20,borderWidth:1,borderColor:c.line,backgroundColor:c.card,gap:8}}><Text style={{color:c.ink,fontWeight:'700',fontSize:16}}>How you felt</Text><Text style={{color:c.ink,fontSize:14,lineHeight:22}}>{session.note}</Text></View>}
  </ScrollView>
  <View style={s.footer}><Pressable accessibilityRole="button" onPress={onClose} style={({pressed})=>[s.close,{opacity:pressed?.8:1}]}><Text style={s.closeLabel}>Close session</Text></Pressable></View>
 </View>;
}
function createStyles(c:Colors){return StyleSheet.create({screen:{flex:1},header:{position:'absolute',top:10,left:20,right:20,zIndex:20,borderRadius:36,overflow:'hidden',padding:12,flexDirection:'row',alignItems:'center',gap:12},glass:{...StyleSheet.absoluteFillObject,borderWidth:1,borderColor:c.dockEdge,borderRadius:36,backgroundColor:c.headerGlass,...(Platform.OS==='web'?{backdropFilter:'blur(24px) saturate(145%)'}:{})},back:{height:44,width:44,borderRadius:22,borderWidth:1,borderColor:c.line,backgroundColor:c.card,alignItems:'center',justifyContent:'center'},title:{flex:1,textAlign:'center',fontSize:13,fontWeight:'600',color:c.ink},balance:{width:44},content:{paddingHorizontal:20,paddingTop:96,paddingBottom:24},footer:{paddingHorizontal:20,paddingVertical:14,borderTopWidth:1,borderColor:c.line,backgroundColor:c.glass,...(Platform.OS==='web'?{backdropFilter:'blur(24px)'}:{})},close:{minHeight:50,borderRadius:25,alignItems:'center',justifyContent:'center',backgroundColor:c.accent},closeLabel:{fontSize:14,fontWeight:'600',color:c.onAccent}});}
