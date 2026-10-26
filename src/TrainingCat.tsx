import React,{useEffect,useRef} from 'react';
import {Animated,AppState,Image,View} from 'react-native';
import {useReducedMotion} from './PopMotion';

export function TrainingCat({width=120}:{width?:number}){
 const blink=useRef(new Animated.Value(0)).current;
 const reduced=useReducedMotion();
 useEffect(()=>{
  let animation:Animated.CompositeAnimation|undefined;
  const sync=(state:string)=>{
   animation?.stop();blink.setValue(0);
   if(reduced||state!=='active')return;
   animation=Animated.loop(Animated.sequence([
    Animated.delay(2400),
    Animated.timing(blink,{toValue:1,duration:75,useNativeDriver:true,isInteraction:false}),
    Animated.delay(35),
    Animated.timing(blink,{toValue:0,duration:110,useNativeDriver:true,isInteraction:false}),
   ]));animation.start();
  };
  sync(AppState.currentState);
  const sub=AppState.addEventListener('change',sync);
  return()=>{animation?.stop();sub.remove();};
 },[blink,reduced]);
 return <View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{alignSelf:'center',width,height:width*76/120,marginTop:4}}><View style={{position:'absolute',width:120,height:76,left:(width-120)/2,top:(width*76/120-76)/2,transform:[{scale:width/120}]}}>
  <Image source={require('../assets/training-cat.png')} resizeMode="contain" style={{width:120,height:76}}/>
  {[32.4,70.8].map(left=><Animated.View key={left} style={{position:'absolute',left,top:59,width:16.7,height:14,borderRadius:9,backgroundColor:'#151414',opacity:blink.interpolate({inputRange:[0,.08,1],outputRange:[0,1,1]}),transform:[{scaleY:blink}]}}/>)}
 </View></View>;
}
