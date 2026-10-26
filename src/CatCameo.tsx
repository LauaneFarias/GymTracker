import React,{useEffect,useRef} from 'react';
import {Animated,AppState,Image,View} from 'react-native';
import {useReducedMotion} from './PopMotion';

// Decorative only: never intercept a tap or enter the accessibility tree.
export function CatCameo({width=120,variant='sleepy'}:{width?:number;variant?:'sleepy'|'orange'}){
 const height=width*(variant==='sleepy'?840/1873:1080/1456);
 const source=variant==='sleepy'?require('../assets/cat-sleepy.png'):require('../assets/cat-orange.png');
 const breath=useRef(new Animated.Value(0)).current;
 const reduced=useReducedMotion();
 useEffect(()=>{
  let loop:Animated.CompositeAnimation|undefined;
  const sync=(state:string)=>{
   loop?.stop();breath.setValue(0);
   if(reduced||state!=='active')return;
   loop=Animated.loop(Animated.sequence([
    Animated.timing(breath,{toValue:1,duration:1900,useNativeDriver:true,isInteraction:false}),
    Animated.timing(breath,{toValue:0,duration:1900,useNativeDriver:true,isInteraction:false}),
   ]));loop.start();
  };
  sync(AppState.currentState);
  const sub=AppState.addEventListener('change',sync);
  return()=>{loop?.stop();sub.remove();};
 },[breath,reduced]);
 return <View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{width,height}}><Animated.View style={{transform:[{translateY:breath.interpolate({inputRange:[0,1],outputRange:[0,-1.5]})}]}}><Image source={source} resizeMode="contain" style={{width,height}}/></Animated.View></View>;
}
