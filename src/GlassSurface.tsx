import React from 'react';
import {StyleSheet,View} from 'react-native';
import {useTheme} from './ThemeProvider';
// Shared flat surface keeps records and exercise cards in the same pop system.
export function GlassSurface({strong=false}:{strong?:boolean;animated?:boolean}){
 const {colors:c}=useTheme();
 return <View pointerEvents="none" accessible={false} style={[StyleSheet.absoluteFill,{backgroundColor:strong?c.popLilac:c.card}]}/>;
}
