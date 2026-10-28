import React,{useEffect,useRef,useState} from 'react';
import {Animated,Easing,Pressable,Text,View} from 'react-native';
import {ExerciseVideoLink} from './ExerciseVideoLink';
import Svg,{Path} from 'react-native-svg';
import {Ionicons} from './Icon';
import {Category,Exercise} from './model';
import {SpringPress,useReducedMotion} from './PopMotion';

export function WorkoutFolder({category,exercises,background,foreground,open,last,current,lastDate,onToggle,onStart,index,children}:{category:Category;exercises:Exercise[];background:string;foreground:string;open:boolean;last:boolean;current:boolean;lastDate?:string;onToggle:()=>void;onStart:()=>void;index:number;children?:React.ReactNode}){
 const reduced=useReducedMotion();const [height,setHeight]=useState(0);const reveal=useRef(new Animated.Value(0)).current;const turn=useRef(new Animated.Value(0)).current;
 useEffect(()=>{const animation=Animated.parallel([Animated.timing(reveal,{toValue:open?height:0,duration:reduced?0:360,easing:Easing.inOut(Easing.cubic),useNativeDriver:false}),Animated.timing(turn,{toValue:open?1:0,duration:reduced?0:300,easing:Easing.out(Easing.cubic),useNativeDriver:true})]);animation.start();return()=>animation.stop();},[open,height,reduced]);
 return <View style={{marginTop:index?-44:0,zIndex:index}}>
 <Pressable accessibilityRole="button" accessibilityLabel={`Preview ${category} exercises`} accessibilityState={{expanded:open}} onPress={onToggle} style={({pressed})=>({height:72,opacity:pressed?.9:1})}>
 <View pointerEvents="none" style={{position:'absolute',inset:0}}><Svg width="100%" height={73} viewBox="0 0 360 65" preserveAspectRatio="none"><Path d="M0 65 V25 Q0 0 25 0 H116 C146 0 145 19 180 19 H335 Q360 19 360 44 V65 Z" fill={background}/></Svg></View>
 <View style={{paddingHorizontal:20,height:72,paddingTop:20,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><Text style={{fontSize:20,lineHeight:28,fontWeight:'700',letterSpacing:-.6,color:foreground}}>{category}</Text><Animated.View style={{width:28,height:28,justifyContent:'center',alignItems:'center',transform:[{translateY:2},{rotate:turn.interpolate({inputRange:[0,1],outputRange:['0deg','90deg']})}]}}><Svg width={24} height={24} viewBox="0 0 24 24"><Path d="M5 12 H19 M12 5 L19 12 L12 19" fill="none" stroke={foreground} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"/></Svg></Animated.View></View>
 </Pressable>
 <View style={{backgroundColor:background,marginTop:-1,paddingTop:1,borderBottomLeftRadius:last?24:0,borderBottomRightRadius:last?24:0,paddingBottom:last?10:44}}>
 <Animated.View style={{height:reveal,overflow:'hidden'}} pointerEvents={open?'auto':'none'} accessibilityElementsHidden={!open} importantForAccessibility={open?'auto':'no-hide-descendants'} aria-hidden={!open}>
 <View onLayout={event=>setHeight(event.nativeEvent.layout.height)} style={{position:'absolute',left:0,right:0,paddingHorizontal:20,paddingTop:4,paddingBottom:24,gap:18}}>
 {children??<><Text style={{fontSize:12,fontWeight:'600',letterSpacing:.7,color:foreground}}>{exercises.length} EXERCISES · {current?'IN PROGRESS':lastDate?`LAST TRAINED ${new Date(lastDate).toLocaleDateString(undefined,{month:'short',day:'numeric'}).toUpperCase()}`:'YOUR ROUTINE'}</Text>
 <View style={{gap:0}}>{exercises.map((exercise,i)=><Animated.View key={exercise.id} style={{opacity:turn.interpolate({inputRange:[Math.min(i*.04,.4),1],outputRange:[0,1],extrapolate:'clamp'}),transform:[{translateY:turn.interpolate({inputRange:[0,1],outputRange:[reduced?0:10,0]})}],flexDirection:'row',alignItems:'center',gap:12,minHeight:46,paddingVertical:10,borderBottomWidth:1,borderColor:foreground+'25'}}><Text style={{fontSize:12,color:foreground,opacity:.7,width:20}}>{String(i+1).padStart(2,'0')}</Text><Text style={{color:foreground,fontSize:14,flex:1,fontWeight:'500'}}>{exercise.name}</Text><Text style={{color:foreground,fontSize:12}}>{exercise.sets} × {exercise.reps}</Text><ExerciseVideoLink name={exercise.name} videoUrl={exercise.videoUrl} color={foreground} compact/></Animated.View>)}</View>
 {!exercises.length&&<Text style={{fontSize:14,lineHeight:21,color:foreground}}>Add the exercises from your {category} routine to get started.</Text>}
 <SpringPress label={current?`Resume ${category}`:exercises.length?`Start ${category}`:`Set up ${category}`} onPress={onStart} style={{backgroundColor:'#292929',borderRadius:25,paddingVertical:15,paddingHorizontal:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><Text style={{fontSize:14,fontWeight:'700',color:'#FFFFFF'}}>{current?'Resume workout':exercises.length?'Start workout':'Set up routine'}</Text><Ionicons name="arrow-forward" size={20} color="#FFFFFF"/></SpringPress></>}
 </View></Animated.View></View>
 </View>;
}
