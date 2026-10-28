import React,{useState} from 'react';
import {Platform,Pressable,Text,View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Data} from './model';
import {Profile} from './profile';
import {Backup,parseBackup} from './backup';
import {useTheme} from './ThemeProvider';
import {pickBackupFile,reloadApp,saveBackupFile} from './backupFile';
export function PhoneSetup({data,profile,disabled=false}:{data:Data;profile:Profile;disabled?:boolean}){
 const {colors:c,appearance}=useTheme();const [pending,setPending]=useState<Backup>();const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);
 const web=Platform.OS==='web';
 const button=(label:string,action:()=>void)=><Pressable accessibilityRole="button" disabled={busy||disabled} onPress={action} style={{padding:16,borderRadius:999,backgroundColor:c.popLilac,opacity:busy||disabled?.5:1}}><Text style={{textAlign:'center',fontWeight:'700',color:c.popInk}}>{label}</Text></Pressable>;
 return <View style={{padding:20,gap:14,borderWidth:1,borderColor:c.line,borderRadius:26}}><Text style={{color:c.ink,fontSize:22,fontWeight:'700'}}>On your phone</Text>{web&&<Text style={{color:c.muted,lineHeight:21}}>Open your private app in Safari or Chrome, then choose Add to Home Screen. After the first online visit, workouts can be recorded offline. Technique videos still need internet.</Text>}<Text style={{color:c.muted,lineHeight:21}}>Records stay on this device. Save a backup regularly and before changing phones. Backups include your profile photo and workout history.</Text>
 {button(web?'Download backup':'Save backup',async()=>{try{await saveBackupFile(JSON.stringify({format:'gym-tracker-backup',version:1,data,profile,appearance},null,2),`gym-tracker-${new Date().toISOString().slice(0,10)}.json`);await AsyncStorage.setItem('gym-tracker:last-backup',new Date().toISOString());}catch(e){setMessage((e as Error).message);}})}
 {button('Restore backup',async()=>{try{const raw=await pickBackupFile();if(raw===undefined)return;setPending(parseBackup(raw));setMessage('');}catch(e){setMessage((e as Error).message);}})}
 {pending&&<><Text style={{color:c.ink}}>Replace this device’s records with {pending.data.sessions.length} saved sessions? Download your current backup first.</Text>{button('Replace records and reload',async()=>{setBusy(true);const keys=['gym-tracker:v1','gym-tracker:profile:v1','gym-tracker:appearance'];let before:readonly [string,string|null][]=[];try{before=await AsyncStorage.multiGet(keys);await AsyncStorage.setItem('gym-tracker:before-restore',JSON.stringify(before));await AsyncStorage.setItem(keys[0],JSON.stringify(pending.data));if(pending.profile)await AsyncStorage.setItem(keys[1],JSON.stringify(pending.profile));if(pending.appearance)await AsyncStorage.setItem(keys[2],pending.appearance);if(!reloadApp()){setPending(undefined);setMessage('Backup restored. Close and reopen the app to see it.');setBusy(false);}}catch{try{for(const [key,value] of before){if(value===null)await AsyncStorage.removeItem(key);else await AsyncStorage.setItem(key,value);}setMessage('Restore failed. Your previous records were kept.');}catch{setMessage('Restore failed. Keep your backup file and retry restoring it.');}setBusy(false);}})}{button('Cancel restore',()=>setPending(undefined))}</>}
 {!!message&&<Text accessibilityRole="alert" style={{color:c.ink}}>{message}</Text>}</View>;
}
