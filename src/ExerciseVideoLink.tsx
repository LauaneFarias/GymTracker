import React,{useState} from 'react';
import {Linking,Platform,Pressable,Text,View} from 'react-native';
import {Ionicons} from './Icon';
import {exerciseVideo} from './exerciseVideos';
export function ExerciseVideoLink({name,videoUrl,color,compact=false}:{name:string;videoUrl?:string;color:string;compact?:boolean}){
 const guide=exerciseVideo(name,videoUrl);const [failed,setFailed]=useState(false);
 if(!guide)return null;
 const web=Platform.OS==='web'?{href:guide.url,hrefAttrs:{target:'_blank',rel:'noopener noreferrer'}}:{};
 return <View><Pressable {...web} accessibilityRole="link" accessibilityLabel={`Watch technique video for ${name}: ${guide.variant}`} onPress={Platform.OS==='web'?undefined:()=>{setFailed(false);Linking.openURL(guide.url).catch(()=>setFailed(true));}} style={({pressed})=>({minWidth:44,minHeight:44,flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:compact?0:12,paddingVertical:compact?0:8,borderRadius:999,borderWidth:compact?0:1,borderColor:color+'50',opacity:pressed?.6:1})}><Ionicons name="play-circle-outline" color={color} size={24}/>{!compact&&<View style={{flex:1,gap:2}}><Text style={{color,fontSize:13,fontWeight:'700'}}>Watch video</Text><Text style={{color,fontSize:12}}>{guide.variant} · {videoUrl?'Video':'Muscle & Strength'}</Text></View>}</Pressable>{failed&&<Text accessibilityRole="alert" style={{color,fontSize:12}}>Could not open the video. Please try again.</Text>}</View>;
}
