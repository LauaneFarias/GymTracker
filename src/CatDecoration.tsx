import React,{useEffect,useRef} from 'react';
import {Animated,AppState,Image,View} from 'react-native';
import {useReducedMotion} from './PopMotion';
const cats={
 paw:{source:require('../assets/cat-paw.png'),image:[1832,858],crop:[0,100,1832,720],eye:[1070,610,150,120]},
 right:{source:require('../assets/cat-right.png'),image:[991,1587],crop:[320,330,671,1000],eye:[865,880,175,150]},
 left:{source:require('../assets/cat-left.png'),image:[1254,1254],crop:[0,0,730,1254],eye:[225,795,170,140]},
 tail:{source:require('../assets/cat-tail.png'),image:[1254,1254],crop:[100,80,1154,1174],eye:null},
};
export function CatDecoration({variant,width=90}:{variant:keyof typeof cats;width?:number}){
 const cat=cats[variant],scale=width/cat.crop[2],height=cat.crop[3]*scale;
 const motion=useRef(new Animated.Value(0)).current,reduced=useReducedMotion();
 useEffect(()=>{let animation:Animated.CompositeAnimation|undefined;
 const sync=(state:string)=>{animation?.stop();motion.setValue(0);if(reduced||state!=='active')return;
 animation=Animated.loop(Animated.sequence(variant==='tail'?[
 Animated.timing(motion,{toValue:1,duration:1600,useNativeDriver:true,isInteraction:false}),
 Animated.timing(motion,{toValue:0,duration:1600,useNativeDriver:true,isInteraction:false}),
 ]:[Animated.delay(variant==='paw'?2400:3100),Animated.timing(motion,{toValue:1,duration:75,useNativeDriver:true,isInteraction:false}),Animated.delay(35),Animated.timing(motion,{toValue:0,duration:110,useNativeDriver:true,isInteraction:false})]));animation.start();};
 sync(AppState.currentState);const sub=AppState.addEventListener('change',sync);return()=>{animation?.stop();sub.remove();};},[motion,reduced,variant]);
 return <View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{width,height,overflow:'hidden'}}><Animated.View style={{width,height,transform:[{rotate:variant==='tail'?motion.interpolate({inputRange:[0,1],outputRange:['-3deg','3deg']}):'0deg'}]}}>
 <Image source={cat.source} resizeMode="stretch" style={{position:'absolute',width:cat.image[0]*scale,height:cat.image[1]*scale,left:-cat.crop[0]*scale,top:-cat.crop[1]*scale}}/>
 {cat.eye&&<Animated.View style={{position:'absolute',left:(cat.eye[0]-cat.eye[2]/2-cat.crop[0])*scale,top:(cat.eye[1]-cat.eye[3]/2-cat.crop[1])*scale,width:cat.eye[2]*scale,height:cat.eye[3]*scale,borderRadius:100,backgroundColor:'#171717',opacity:motion.interpolate({inputRange:[0,.08,1],outputRange:[0,1,1]}),transform:[{scaleY:motion}]}}/>}
 </Animated.View></View>;
}
