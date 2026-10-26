import React, {useMemo,useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Svg,{Path} from 'react-native-svg';
import {Ionicons} from '@expo/vector-icons';
import {completedSets, Session} from './model';
import {GlassSurface} from './GlassSurface';
import {Colors} from './theme';
import {useTheme} from './ThemeProvider';

export function SessionRecord({session}:{session:Session}) {
 const {colors:c}=useTheme();const s=useMemo(()=>createStyles(c),[c]);
 const [expanded,setExpanded]=useState<number|null>(0);
 const recorded=completedSets(session);
 const exerciseCount=session.entries.filter(e=>!e.skipped&&e.sets.some(r=>r.complete)).length;
 if(session.kind==='class')return <View style={s.stack}><View style={s.header}><Text style={s.badgeText}>CLASS COMPLETED</Text><Text style={s.title}>Pilates</Text><Text style={s.muted}>{new Date(session.started).toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</Text></View><Text style={s.sectionTitle}>You showed up.</Text><Text style={s.note}>This class counts toward your training days and calendar attendance. No sets or weights are needed.</Text></View>;
 return <View style={s.stack}>
  <View style={s.header}><View style={s.badge}><Ionicons name="checkmark-circle" size={15} color={c.accent}/><Text style={s.badgeText}>SESSION COMPLETE</Text></View><Text style={s.title}>{session.category}</Text><Text style={s.muted}>{new Date(session.started).toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'})} · {new Date(session.started).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'})}</Text></View>
  <View style={s.summary}><GlassSurface/><View style={s.metric}><Text style={s.number}>{exerciseCount}<Text style={s.total}> / {session.entries.length}</Text></Text><Text style={s.muted}>Exercises recorded</Text></View><View style={s.divider}/><View style={s.metric}><Text style={s.number}>{recorded.length}</Text><Text style={s.muted}>Completed sets</Text></View></View>
  <View style={s.section}><Text style={s.sectionTitle}>Exercise breakdown</Text><Text style={s.muted}>Tap an exercise to view its sets</Text></View>
  <View>{session.entries.map((entry,i)=>{
   const background=[c.popLilac,c.popOrange,c.popYellow,c.popBlue][i%4];
   const foreground=i%4===3?'#FFFFFF':c.popInk;
   const s=createStyles({...c,ink:foreground,muted:foreground,accent:foreground,line:foreground+'30'});
   const done=entry.sets.filter(r=>r.complete&&!entry.skipped);
   const best=done.length?Math.max(...done.map(r=>Number(r.weight))):undefined;
   const open=expanded===i;
   return <View key={`${entry.exerciseId}-${i}`} style={{marginTop:i?-24:0,zIndex:i}}>
    <View pointerEvents="none" style={{position:'absolute',top:0,left:0,right:0}}><Svg width="100%" height={95} viewBox="0 0 360 95" preserveAspectRatio="none"><Path d="M0 95 V25 Q0 0 25 0 H116 C146 0 145 19 180 19 H335 Q360 19 360 44 V95 Z" fill={background}/></Svg></View>
    <Pressable accessibilityRole="button" accessibilityState={{expanded:open}} accessibilityLabel={`${entry.name}, ${entry.skipped?'skipped':`${done.length} of ${entry.sets.length} sets complete`}`} onPress={()=>setExpanded(open?null:i)} style={[s.exerciseHead,{paddingTop:28,minHeight:94}]}>
     <View style={s.index}><Text style={s.indexText}>{String(i+1).padStart(2,'0')}</Text></View><View style={{flex:1,gap:5}}><Text style={s.exerciseName}>{entry.name}</Text><Text style={s.muted}>{entry.skipped?'Skipped':`${done.length}/${entry.sets.length} sets complete${best!==undefined?` · Heaviest ${best} kg`:''}`}</Text></View><Ionicons name={open?'chevron-up':'chevron-down'} size={17} color={c.muted}/>
    </Pressable>
    <View style={{backgroundColor:background,paddingBottom:i===session.entries.length-1?10:24,borderBottomLeftRadius:i===session.entries.length-1?24:0,borderBottomRightRadius:i===session.entries.length-1?24:0}}>{open&&<View style={s.table}>{entry.skipped?<Text style={[s.muted,{paddingVertical:14}]}>This exercise was skipped.</Text>:<><View style={s.tableRow}><Text style={[s.column,s.columnLabel,{flex:.5}]}>SET</Text><Text style={[s.column,s.columnLabel]}>KG</Text><Text style={[s.column,s.columnLabel]}>REPS</Text><Text style={[s.column,s.columnLabel]}>TARGET</Text><Text style={[s.column,s.columnLabel]}>STATUS</Text></View>{entry.sets.map((r,j)=><View key={j} style={s.tableRow}><Text style={[s.column,{flex:.5,color:c.muted}]}>{j+1}</Text><Text style={s.column}>{r.weight||'—'}</Text><Text style={s.column}>{r.reps}</Text><Text style={[s.column,{color:c.muted}]}>{r.targetReps}</Text><View style={[s.column,s.status]}><Ionicons name={r.complete?'checkmark-circle':'ellipse-outline'} size={17} color={r.complete?c.accent:c.muted}/><Text style={{fontSize:9,color:r.complete?c.accent:c.muted}}>{r.complete?'Done':'Not done'}</Text></View></View>)}</>}</View>}</View>
   </View>;
  })}</View>
  <Text style={s.note}>Only completed sets count toward progress. This record keeps the exercise names and targets from the day you trained.</Text>
 </View>;
}
function createStyles(c:Colors){return StyleSheet.create({stack:{gap:12},header:{gap:12,paddingTop:8,paddingBottom:12},badge:{flexDirection:'row',alignItems:'center',gap:7},badgeText:{fontSize:9,letterSpacing:1.4,fontWeight:'700',color:c.accent},title:{fontSize:34,letterSpacing:-1.2,fontWeight:'600',color:c.ink},muted:{fontSize:11,color:c.muted,lineHeight:17},summary:{overflow:'hidden',flexDirection:'row',backgroundColor:c.card,borderRadius:28,borderWidth:1,borderColor:c.frostEdge,paddingVertical:18},metric:{flex:1,paddingHorizontal:18,gap:6},number:{fontSize:29,fontWeight:'500',color:c.ink},total:{fontSize:15,color:c.muted},divider:{width:1,backgroundColor:c.line},section:{gap:5,marginTop:12,marginBottom:6},sectionTitle:{fontSize:17,fontWeight:'600',color:c.ink},card:{borderWidth:1,borderColor:c.frostEdge,borderRadius:26,backgroundColor:c.card,overflow:'hidden'},exerciseHead:{flexDirection:'row',alignItems:'center',gap:12,padding:15,minHeight:82},index:{width:28,height:32,alignItems:'center',justifyContent:'center'},indexText:{fontSize:11,color:c.muted},exerciseName:{fontSize:15,lineHeight:20,fontWeight:'600',color:c.ink},table:{paddingHorizontal:15,paddingBottom:8},tableRow:{flexDirection:'row',alignItems:'center',borderTopWidth:1,borderColor:c.line,minHeight:43,gap:4},column:{flex:1,minWidth:0,fontSize:13,color:c.ink,textAlign:'center'},columnLabel:{fontSize:8,letterSpacing:.6,color:c.muted},status:{alignItems:'center',justifyContent:'center',gap:2},note:{fontSize:11,lineHeight:18,color:c.muted,marginTop:10,marginBottom:8}});}
