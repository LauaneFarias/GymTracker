import React from 'react';
import {Activity,ArrowDown,ArrowRight,ArrowUp,ArrowUpRight,BatteryFull,Bike,Calendar,ChartBarIncreasing,ChartColumn,Check,ChevronDown,ChevronLeft,ChevronRight,ChevronUp,Circle,CircleCheck,CirclePlay,Dumbbell,Flame,Footprints,House,LayoutGrid,Moon,MountainSnow,Pause,Pencil,PawPrint,Play,Plus,Shuffle,Trophy,Signal,SkipForward,Sun,Timer,TrendingUp,User,WavesHorizontal,Wifi,X,type LucideIcon} from 'lucide-react-native';
// Lucide icons behind the old Ionicons names, so call sites keep their names.
const icons={
 'home-outline':House,'grid-outline':LayoutGrid,'stats-chart-outline':ChartColumn,
 'arrow-forward':ArrowRight,'arrow-down':ArrowDown,'arrow-up':ArrowUp,'open':ArrowUpRight,
 'chevron-forward':ChevronRight,'chevron-back':ChevronLeft,'chevron-up':ChevronUp,'chevron-down':ChevronDown,
 checkmark:Check,'checkmark-circle':CircleCheck,'ellipse-outline':Circle,
 play:Play,'play-outline':Play,'play-circle-outline':CirclePlay,pause:Pause,'play-skip-forward':SkipForward,close:X,
 'moon-outline':Moon,'sunny-outline':Sun,'person-outline':User,barbell:Dumbbell,'barbell-outline':Dumbbell,
 'trending-up':TrendingUp,'trending-up-outline':TrendingUp,wifi:Wifi,cellular:Signal,'battery-full':BatteryFull,
 'calendar-outline':Calendar,'pencil-outline':Pencil,add:Plus,activity:Activity,flame:Flame,shuffle:Shuffle,paw:PawPrint,trophy:Trophy,timer:Timer,
 rowing:WavesHorizontal,bike:Bike,ski:MountainSnow,treadmill:Footprints,stairs:ChartBarIncreasing,
} satisfies Record<string,LucideIcon>;
export type IconName=keyof typeof icons;
export function Ionicons({name,size=24,color='#292929',style,strokeWidth=2}:{name:IconName;size?:number;color?:string;style?:any;strokeWidth?:number}){
 const Glyph=icons[name];return <Glyph size={size} color={color} strokeWidth={strokeWidth} style={style}/>;
}
