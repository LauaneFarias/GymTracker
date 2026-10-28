import React,{useEffect,useRef,useState} from 'react';
import {Animated,Easing,Platform,Pressable,Text,Vibration,View} from 'react-native';
import {CatCameo} from './CatCameo';
import {useReducedMotion} from './PopMotion';
import {useTheme} from './ThemeProvider';
// Two short tones; iPhone web apps can't vibrate, so this is the cue there.
function chime(){try{const ctx=new (window.AudioContext||(window as any).webkitAudioContext)();[0,.22].forEach((t,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=i?1046:784;g.gain.setValueAtTime(.0001,ctx.currentTime+t);g.gain.exponentialRampToValueAtTime(.25,ctx.currentTime+t+.02);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+t+.2);o.connect(g).connect(ctx.destination);o.start(ctx.currentTime+t);o.stop(ctx.currentTime+t+.22);});}catch{}}
// Countdown between sets. `end` is a timestamp so the timer survives re-renders and backgrounding.
export function RestTimer({end,total,next,onDone,onDismiss}:{end:number;total:number;next?:string;onDone?:()=>void;onDismiss:()=>void}){
 const {colors:c}=useTheme();const [now,setNow]=useState(Date.now());
 useEffect(()=>{const id=setInterval(()=>setNow(Date.now()),250);return()=>clearInterval(id);},[]);
 const fg=(d:boolean)=>d?c.popInk:c.white;const remaining=Math.max(0,end-now),left=Math.ceil(remaining/1000),done=left===0;
 const pop=useRef(new Animated.Value(0)).current,reduced=useReducedMotion();
 useEffect(()=>{if(!done)return;Vibration.vibrate([0,300,150,300]);if(Platform.OS==='web')chime();onDone?.();if(reduced){pop.setValue(1);return;}pop.setValue(0);Animated.spring(pop,{toValue:1,useNativeDriver:true,speed:14,bounciness:12}).start();},[done]);
 const clock=`${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}`,progress=Math.min(1,remaining/(total*1000));
 const card=<Pressable accessibilityRole={done?'button':undefined} accessibilityLabel={done?'Rest over. Tap to close':`Rest, ${left} seconds left. ${next??''}`} accessibilityLiveRegion="polite" disabled={!done} onPress={onDismiss} style={({pressed})=>({marginHorizontal:12,marginBottom:6,paddingTop:14,paddingBottom:16,paddingHorizontal:20,borderRadius:24,shadowColor:'#000',shadowOpacity:.18,shadowRadius:16,shadowOffset:{width:0,height:6},elevation:8,backgroundColor:done?c.popYellow:c.popInk,borderWidth:1,borderColor:done?c.popYellow:'#FFFFFF24',gap:8,opacity:pressed?.9:1})}>
  <View style={{flexDirection:'row',alignItems:'center',gap:12,paddingRight:done?96:0}}>
   <Text style={{fontSize:24,lineHeight:28,fontWeight:'800',letterSpacing:-.6,color:fg(done),fontVariant:['tabular-nums']}}>{done?'Go!':clock}</Text>
   <View style={{flex:1,minWidth:0}}><Text style={{fontSize:12,fontWeight:'700',letterSpacing:1.2,color:done?c.popInk:c.popLilac}}>{done?'REST OVER':'REST'}</Text><Text numberOfLines={1} style={{fontSize:13,fontWeight:'600',color:fg(done),opacity:.85}}>{done?(next?.startsWith('Next exercise')?next.replace('Next exercise · ','Time for '):'Next set, let’s lift!'):next??'Next set'}</Text></View>
  </View>
  {!done&&<View style={{height:4,borderRadius:2,backgroundColor:'#FFFFFF22',overflow:'hidden'}}><View style={{width:`${progress*100}%`,height:'100%',borderRadius:2,backgroundColor:c.popLilac}}/></View>}
 </Pressable>;
 if(!done)return card;
 return <Animated.View style={{transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[.92,1]})}]}}>
  {card}
  <Animated.View pointerEvents="none" style={{position:'absolute',right:26,bottom:16,opacity:pop,transform:[{translateY:pop.interpolate({inputRange:[0,1],outputRange:[30,0]})}]}}><CatCameo variant="orange" width={92}/></Animated.View>
 </Animated.View>;
}
