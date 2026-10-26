import React, {createContext,useContext,useEffect,useRef,useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors,darkColors} from './theme';
type Appearance='light'|'dark';
const ThemeContext=createContext({colors,appearance:'light' as Appearance,setAppearance:(_value:Appearance)=>{}});
export function ThemeProvider({children}:{children:React.ReactNode}){
 const [appearance,setMode]=useState<Appearance>('light');const changed=useRef(false);
 useEffect(()=>{let mounted=true;AsyncStorage.getItem('gym-tracker:appearance').then(value=>{if(mounted&&!changed.current&&(value==='light'||value==='dark'))setMode(value);}).catch(()=>{});return()=>{mounted=false;};},[]);
 const setAppearance=(value:Appearance)=>{changed.current=true;setMode(value);AsyncStorage.setItem('gym-tracker:appearance',value).catch(()=>{});};
 return <ThemeContext.Provider value={{colors:appearance==='dark'?darkColors:colors,appearance,setAppearance}}>{children}</ThemeContext.Provider>;
}
export const useTheme=()=>useContext(ThemeContext);
