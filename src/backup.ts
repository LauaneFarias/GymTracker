import {categories,Data} from './model';
import {Profile} from './profile';
export type Backup={format:'gym-tracker-backup';version:1;data:Data;profile?:Profile;appearance?:'light'|'dark'};
export function parseBackup(raw:string):Backup{
 const value=JSON.parse(raw), backup=value.format==='gym-tracker-backup'?value:{format:'gym-tracker-backup',version:1,data:value};
 const fail=()=>{throw new Error('This file is not a valid Gym Tracker backup. Nothing was replaced.');};
 const str=(v:unknown)=>typeof v==='string';
 const num=(v:unknown)=>typeof v==='number'&&Number.isFinite(v);
 const session=(s:any)=>s&&str(s.id)&&categories.includes(s.category)&&str(s.started)&&Number.isFinite(Date.parse(s.started))&&typeof s.paused==='boolean'&&Array.isArray(s.entries)&&s.entries.every((e:any)=>e&&str(e.exerciseId)&&str(e.name)&&typeof e.skipped==='boolean'&&Array.isArray(e.previous)&&e.previous.every(str)&&Array.isArray(e.sets)&&e.sets.every((r:any)=>r&&str(r.weight)&&str(r.reps)&&num(r.targetReps)&&typeof r.complete==='boolean'));
 const d=backup.data;
 if(backup.version!==1||!d||d.version!==1||!Array.isArray(d.exercises)||!d.exercises.every((e:any)=>e&&str(e.id)&&str(e.name)&&categories.includes(e.category)&&Number.isInteger(e.sets)&&e.sets>0&&Number.isInteger(e.reps)&&e.reps>0)||!Array.isArray(d.sessions)||!d.sessions.every(session)||(d.active&&!session(d.active)))fail();
 const p=backup.profile;
 if(p&&(!str(p.name)||!Array.isArray(p.weights)||!p.weights.every((w:any)=>w&&str(w.date)&&num(w.kg)&&w.kg>0)||(p.heightCm!==undefined&&!num(p.heightCm))||(p.photo!==undefined&&(!str(p.photo)||!/^data:image\/(png|jpeg|webp);base64,/.test(p.photo)))||(p.bodyRecords!==undefined&&(!Array.isArray(p.bodyRecords)||!p.bodyRecords.every((r:any)=>r&&str(r.date)&&Object.entries(r).every(([k,v])=>k==='date'||num(v)))))))fail();
 if(backup.appearance!==undefined&&!['light','dark'].includes(backup.appearance))fail();
 return backup;
}
