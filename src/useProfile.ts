import {useEffect,useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {prepareProfilePhoto} from './profilePhoto';
import {emptyProfile,Profile} from './profile';
const key='gym-tracker:profile:v1';
export function useProfile(){const [profile,setProfile]=useState<Profile>(emptyProfile);const [ready,setReady]=useState(false);const [error,setError]=useState('');useEffect(()=>{let alive=true;AsyncStorage.getItem(key).then(async raw=>{if(alive&&raw){const p=JSON.parse(raw);if(typeof p.name!=='string'||!Array.isArray(p.weights))throw new Error();if(p.photo){try{const photo=await prepareProfilePhoto(p.photo);if(photo!==p.photo){p.photo=photo;await AsyncStorage.setItem(key,JSON.stringify(p));}}catch{/* Keep the original available for replacement; never drop profile data. */}}
 if(alive)setProfile(p);}}).catch(()=>{if(alive)setError('Could not load your profile. Reload the app before editing.');}).finally(()=>{if(alive)setReady(true);});return()=>{alive=false;};},[]);const save=async(next:Profile)=>{if(!ready||error)throw new Error(error||'Profile is still loading.');await AsyncStorage.setItem(key,JSON.stringify(next));setProfile(next);};return {profile,save,ready,error};}
