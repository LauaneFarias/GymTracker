import React,{useEffect,useRef,useState} from 'react';
import {Animated,Modal,Pressable,ScrollView,Text,Vibration,View} from 'react-native';
import Svg,{Circle} from 'react-native-svg';
import {Ionicons} from './Icon';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CatCameo} from './CatCameo';
import {useReducedMotion} from './PopMotion';
import {useTheme} from './ThemeProvider';

export const machines=[{id:'Rowing',icon:'rowing' as const,push:'Pull harder: 10 strong strokes, 10 easy'},{id:'Bike',icon:'bike' as const,push:'Add 2 levels of resistance'},{id:'Ski',icon:'ski' as const,push:'Big arm pulls: 20 fast, 20 easy'},{id:'Treadmill',icon:'treadmill' as const,push:'Raise the incline by 2'},{id:'Stairs',icon:'stairs' as const,push:'Go 2 steps per minute faster'}] as const;
type Machine=typeof machines[number];
// Five 5-minute levels so 25 minutes feels like a game, not a chore.
const levels=(m:Machine)=>[
 {name:'Warm-up',tip:'Easy pace. You should be able to sing along.'},
 {name:'Find your groove',tip:'A little faster. Pick your best song.'},
 {name:'Power-up',tip:`${m.push} for 1 minute, then recover.`},
 {name:'Boss fight',tip:'30 seconds fast, 30 seconds easy. Repeat!'},
 {name:'Victory lap',tip:'Last push, then slow down for the final 2 minutes.'},
];
const cheers=['The cat believes in you','You’re doing it! Keep moving','Every minute counts','Halfway hero vibes','Sweaty = strong','Almost there, don’t stop now','Future you says thank you'];

export function CardioMode({visible,lastMachine,onClose,onFinish}:{visible:boolean;lastMachine?:string;onClose:()=>void;onFinish:(machine:string,minutes:number,started:Date)=>void}){
 const [length,setLength]=useState(25);const TOTAL=length*60*1000,LEVEL=TOTAL/5;
 const {colors:c}=useTheme();const reduced=useReducedMotion();
 const [machine,setMachine]=useState<Machine>();const [started,setStarted]=useState<Date>();
 const [banked,setBanked]=useState(0);const [since,setSince]=useState<number>();const [now,setNow]=useState(Date.now());const [done,setDone]=useState(false);
 const pop=useRef(new Animated.Value(1)).current;
 const elapsed=Math.min(TOTAL,banked+(since?now-since:0)),level=Math.min(4,Math.floor(elapsed/LEVEL)),left=Math.ceil((TOTAL-elapsed)/1000);
 useEffect(()=>{if(!since)return;const id=setInterval(()=>setNow(Date.now()),500);return()=>clearInterval(id);},[since]);
 const lastLevel=useRef(0);
 useEffect(()=>{if(!started)return;if(elapsed>=TOTAL&&!done){setDone(true);setBanked(TOTAL);setSince(undefined);Vibration.vibrate([0,400,200,400,200,600]);return;}if(level!==lastLevel.current){lastLevel.current=level;Vibration.vibrate(250);if(!reduced){pop.setValue(.85);Animated.spring(pop,{toValue:1,useNativeDriver:true,bounciness:14,speed:12}).start();}}},[elapsed]);
 function reset(){setMachine(undefined);setStarted(undefined);setBanked(0);setSince(undefined);setDone(false);lastLevel.current=0;}
 function start(m:Machine){setMachine(m);setStarted(new Date());setBanked(0);setSince(Date.now());setNow(Date.now());}
 function togglePause(){if(since){setBanked(elapsed);setSince(undefined);}else{setSince(Date.now());setNow(Date.now());}}
 function finish(){if(machine&&started&&elapsed>=60000)onFinish(machine.id,elapsed/60000,started);reset();onClose();}
 const clock=`${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}`;
 const size=230,stroke=14,radius=(size-stroke)/2,circ=2*Math.PI*radius;
 const ink=c.popInk;
 return <Modal visible={visible} animationType="slide" onRequestClose={()=>{if(!started){onClose();}}}>
  <SafeAreaView style={{flex:1,backgroundColor:done?c.popYellow:started?c.popBlue:c.popLilac}}>
   <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:16}}>
    <Pressable accessibilityRole="button" accessibilityLabel={started&&!done?'End cardio early':'Close cardio'} onPress={()=>started&&!done?finish():(reset(),onClose())} style={{width:44,height:44,borderRadius:22,alignItems:'center',justifyContent:'center',backgroundColor:'#FFFFFF33'}}><Ionicons name="close" size={22} color={started&&!done?c.white:ink}/></Pressable>
    <Text style={{fontSize:12,fontWeight:'700',letterSpacing:1.4,color:started&&!done?c.white:ink}}>{done?'MISSION COMPLETE':started?machine!.id.toUpperCase():`${length}-MIN CARDIO`}</Text>
    <View style={{width:44}}/>
   </View>
   {!started?<ScrollView contentContainerStyle={{padding:20,gap:14}}>
    <Text style={{fontSize:36,lineHeight:38,fontWeight:'800',letterSpacing:-1.2,color:ink}}>Pick your{'\n'}cardio quest</Text>
    <Text style={{fontSize:15,lineHeight:22,color:ink,opacity:.8}}>{length} minutes, 5 levels, one proud cat. Each level is only {length/5} minutes.</Text>
    <View accessibilityRole="radiogroup" style={{flexDirection:'row',gap:8}}>{[15,25].map(n=><Pressable key={n} accessibilityRole="radio" accessibilityState={{checked:length===n}} onPress={()=>setLength(n)} style={{flex:1,minHeight:44,borderRadius:22,alignItems:'center',justifyContent:'center',backgroundColor:length===n?ink:'#FFFFFF8C'}}><Text style={{fontSize:15,fontWeight:'700',color:length===n?c.white:ink}}>{n} min{n===15?' · low energy':''}</Text></Pressable>)}</View>
    {[...machines].sort((a,b)=>Number(b.id===lastMachine)-Number(a.id===lastMachine)).map(m=><Pressable key={m.id} accessibilityRole="button" accessibilityLabel={`Start ${m.id}`} onPress={()=>start(m)} style={({pressed})=>({flexDirection:'row',alignItems:'center',gap:14,padding:16,borderRadius:24,backgroundColor:'#FFFFFF8C',opacity:pressed?.8:1})}><View style={{width:52,height:52,borderRadius:26,alignItems:'center',justifyContent:'center',backgroundColor:c.white}}><Ionicons name={m.icon} size={26} color={ink}/></View><View style={{flex:1}}><Text style={{fontSize:18,fontWeight:'700',color:ink}}>{m.id}</Text>{m.id===lastMachine&&<Text style={{fontSize:12,fontWeight:'600',color:ink,opacity:.7}}>Last time · go again?</Text>}</View><Ionicons name="play" size={20} color={ink}/></Pressable>)}
    <Pressable accessibilityRole="button" onPress={()=>start(machines[Math.floor(Math.random()*machines.length)])} style={({pressed})=>({marginTop:4,minHeight:56,borderRadius:28,flexDirection:'row',gap:10,alignItems:'center',justifyContent:'center',backgroundColor:ink,opacity:pressed?.85:1})}><Ionicons name="shuffle" size={20} color={c.white}/><Text style={{fontSize:16,fontWeight:'700',color:c.white}}>Surprise me</Text></Pressable>
   </ScrollView>
   :done?<View style={{flex:1,alignItems:'center',justifyContent:'center',padding:24,gap:16}}>
    <CatCameo variant="orange" width={180}/>
    <Text style={{fontSize:40,fontWeight:'800',letterSpacing:-1.4,color:ink,textAlign:'center'}}>You did it!</Text>
    <Text style={{fontSize:16,lineHeight:24,color:ink,textAlign:'center'}}>{length} minutes of {machine!.id.toLowerCase()} done.{'\n'}All 5 levels cleared. The cat is very proud.</Text>
    <Pressable accessibilityRole="button" onPress={finish} style={({pressed})=>({marginTop:8,minHeight:56,paddingHorizontal:32,borderRadius:28,alignItems:'center',justifyContent:'center',backgroundColor:ink,opacity:pressed?.85:1})}><Text style={{fontSize:16,fontWeight:'700',color:c.white}}>Save and finish</Text></Pressable>
   </View>
   :<View style={{flex:1,alignItems:'center',padding:20,gap:18}}>
    <Animated.View style={{transform:[{scale:pop}],alignItems:'center',gap:4}}>
     <Text style={{fontSize:12,fontWeight:'700',letterSpacing:1.4,color:c.popYellow}}>LEVEL {level+1} OF 5</Text>
     <Text style={{fontSize:28,fontWeight:'800',letterSpacing:-.8,color:c.white}}>{levels(machine!)[level].name}</Text>
    </Animated.View>
    <View style={{width:size,height:size,alignItems:'center',justifyContent:'center'}}>
     <Svg width={size} height={size} style={{position:'absolute',transform:[{rotate:'-90deg'}]}}><Circle cx={size/2} cy={size/2} r={radius} stroke="#FFFFFF2E" strokeWidth={stroke} fill="none"/><Circle cx={size/2} cy={size/2} r={radius} stroke={c.popYellow} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={`${circ} ${circ}`} strokeDashoffset={circ*(1-elapsed/TOTAL)}/></Svg>
     <Text accessibilityLabel={`${Math.ceil(left/60)} minutes left`} style={{fontSize:56,fontWeight:'800',letterSpacing:-2,color:c.white,fontVariant:['tabular-nums']}}>{clock}</Text>
     <Text style={{fontSize:13,color:c.white,opacity:.8}}>{since?'left to go':'paused'}</Text>
    </View>
    <View accessibilityLabel={`${level} of 5 levels cleared`} style={{flexDirection:'row',gap:10}}>{[0,1,2,3,4].map(i=><View key={i} style={{width:40,height:40,borderRadius:20,alignItems:'center',justifyContent:'center',backgroundColor:i<level?c.popYellow:i===level?'#FFFFFF40':'#FFFFFF1A'}}>{i<level?<Ionicons name="paw" size={20} color={ink}/>:<Text style={{fontSize:13,color:c.white,fontWeight:'700'}}>{i+1}</Text>}</View>)}</View>
    <View style={{alignSelf:'stretch',padding:16,borderRadius:22,backgroundColor:'#FFFFFF1F',gap:6}}>
     <Text style={{fontSize:12,fontWeight:'700',letterSpacing:1.2,color:c.popYellow}}>YOUR MISSION</Text>
     <Text style={{fontSize:16,lineHeight:23,fontWeight:'600',color:c.white}}>{levels(machine!)[level].tip}</Text>
     <Text style={{fontSize:13,color:c.white,opacity:.75}}>{cheers[Math.floor(elapsed/60000)%cheers.length]}</Text>
    </View>
    <Pressable accessibilityRole="button" accessibilityLabel={since?'Pause cardio':'Resume cardio'} onPress={togglePause} style={({pressed})=>({marginTop:'auto',minHeight:56,alignSelf:'stretch',borderRadius:28,flexDirection:'row',gap:8,alignItems:'center',justifyContent:'center',backgroundColor:c.white,opacity:pressed?.85:1})}><Ionicons name={since?'pause':'play'} size={20} color={ink}/><Text style={{fontSize:16,fontWeight:'700',color:ink}}>{since?'Pause':'Resume'}</Text></Pressable>
   </View>}
  </SafeAreaView>
 </Modal>;
}
