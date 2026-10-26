// Pop strength · semantic tokens shared by every screen.
export const colors = {
 popBlue:'#4854C7', popOrange:'#F36338', popLilac:'#D8B5F2', popPink:'#D8B5F2', popYellow:'#E2F56B', popInk:'#292929', popRule:'rgba(41,41,41,0.18)', bg:'#FAFAFB', onAccent:'#FFFFFF', frostHighlight:0.7, headerTint:'rgba(0,0,0,0.05)', headerGlass:'rgba(250,250,251,0.96)', done:'#2F6851', doneSurface:'#DCEDE3', frostDeep:'#D8B5F2', frostBase:'rgba(255,255,255,0.40)', frostEdge:'rgba(255,255,255,0.68)', paperCool:'#FAFAFB', paperWarm:'#FAFAFB',
 dockGlass:'rgba(255,255,255,0.72)', dockEdge:'rgba(255,255,255,0.9)', dockIcon:'rgba(98,17,34,0.08)',
 card:'rgba(255,255,255,0.65)', ink:'#292929', muted:'#66666D', line:'rgba(42,36,51,0.13)', accent:'#292929',
 coral:'#F36338', blue:'#4854C7', gradientText:'#292929', gradientMuted:'#4F3D65', photoGlass:'rgba(22,27,30,0.48)', photoEdge:'rgba(255,255,255,0.32)', photoOverlay:'rgba(12,17,21,0.25)',
 soft:'#F0E6FA', sage:'#DDEEDA', white:'#FFFFFF',
 glass:'rgba(255,255,255,0.8)', scrim:'rgba(17,14,23,0.45)',
 stage:'#FFFFFF', bezel:'#242824', black:'#050806',
};
export const workoutImages = {
 legs: require('../assets/legs.png'), upper: require('../assets/upper.png'), body: require('../assets/full-body.png'),
};
export type Colors = typeof colors;
export const darkColors: Colors = {
 ...colors, bg:'#202124', paperCool:'#202124', paperWarm:'#202124', ink:'#F4F1F4', muted:'#C1BBC6',
 card:'rgba(255,255,255,0.065)', line:'rgba(255,255,255,0.16)', accent:'#D8B5F2',
 headerGlass:'rgba(37,38,45,0.94)', dockGlass:'rgba(49,48,60,0.78)', dockEdge:'rgba(255,255,255,0.20)', dockIcon:'rgba(255,255,255,0.07)',
 frostBase:'rgba(35,36,44,0.85)', frostEdge:'rgba(255,255,255,0.22)', soft:'rgba(241,161,143,0.12)', sage:'rgba(112,129,192,0.18)',
 glass:'rgba(39,39,47,0.88)', done:'#A2D8B8', doneSurface:'#284338', onAccent:'#241C20', frostHighlight:0.14,
};
