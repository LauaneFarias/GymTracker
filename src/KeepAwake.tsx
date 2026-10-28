import {useKeepAwake} from 'expo-keep-awake';
// Mounted only while training so the phone doesn't lock mid-rest.
export function KeepAwake(){useKeepAwake();return null;}
