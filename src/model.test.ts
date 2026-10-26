import test from 'node:test';
import assert from 'node:assert/strict';
import {recordPilatesClass,emptyData,startSession,finishSession,progress,validSet} from './model';
test('workout snapshots survive edits, deletion and serialized restart',()=>{
 let data=emptyData();data.exercises=[{id:'squat',name:'My machine',category:'Leg Day',sets:4,reps:12}];
 const active=startSession(data,'Leg Day');assert.equal(active.entries[0].sets.length,4);assert.equal(active.entries[0].sets[0].complete,false);
 active.entries[0].sets[0]={weight:'40',reps:'12',targetReps:12,complete:true};
 active.entries[0].sets[1]={weight:'45',reps:'12',targetReps:12,complete:true};
 active.entries[0].sets[2]={weight:'100',reps:'6',targetReps:12,complete:true};
 data.sessions=[finishSession(active)];data.exercises[0].name='Renamed';
 assert.equal(data.sessions[0].entries[0].name,'My machine');
 const next=startSession(data,'Leg Day');assert.deepEqual(next.entries[0].previous,['40','45','100','']);assert.equal(next.entries[0].sets[1].weight,'45');assert.ok(next.entries[0].sets.every(s=>!s.complete));
 data.active=next;data=JSON.parse(JSON.stringify(data));assert.equal(data.active!.entries[0].sets[1].weight,'45');
 assert.equal(progress(data,'squat',12)[0].weight,45);assert.equal(progress(data,'squat',6)[0].weight,100);assert.deepEqual(progress(data,'another-machine',12),[]);
 data.exercises=[];assert.equal(data.sessions[0].entries[0].name,'My machine');
});
test('invalid or unchecked sets do not become records',()=>{
 const data=emptyData();data.exercises=[{id:'1',name:'Press',category:'Arms Day',sets:4,reps:12}];const active=startSession(data,'Arms Day');
 assert.throws(()=>finishSession(active));assert.equal(validSet({weight:'',reps:'12',targetReps:12,complete:false}),false);
 assert.equal(validSet({weight:'-2',reps:'12',targetReps:12,complete:false}),false);
 assert.equal(validSet({weight:'0',reps:'12',targetReps:12,complete:true}),true);
 active.entries[0].sets[0]={weight:'30',reps:'12',targetReps:12,complete:true};active.entries[0].skipped=true;assert.throws(()=>finishSession(active));
});

import { installTemplates, workoutTemplates } from './templates';
test('all 22 template placements have the specified order and can start',()=>{
 const data=installTemplates(emptyData());assert.equal(data.exercises.length,22);
 for(const {category,names} of workoutTemplates){
  const session=startSession(data,category);
  assert.deepEqual(session.entries.map(e=>e.name),names);
  assert.ok(session.entries.every(e=>e.sets.length===4&&e.sets.every(s=>s.targetReps===12&&s.reps==='12'&&!s.complete)));
 }
 assert.equal(installTemplates(data),data);
 const removed={...data,exercises:data.exercises.slice(1)};assert.equal(installTemplates(removed).exercises.length,21);
});
test('migration preserves user data, reuses exercise identity, and shares progress across templates',()=>{
 const old=emptyData();old.exercises=[{id:'my-hack',name:'Hack Squat',category:'Leg Day',sets:3,reps:8},{id:'custom',name:'Custom',category:'Full Body',sets:2,reps:10}];
 const session=startSession(old,'Leg Day');session.entries[0].sets[0]={weight:'50',reps:'12',targetReps:8,complete:true};old.sessions=[finishSession(session)];old.active=startSession(old,'Leg Day');
 const before=JSON.stringify(old);const migrated=installTemplates(old);
 assert.equal(JSON.stringify(old),before);assert.equal(migrated.sessions,old.sessions);assert.equal(migrated.active,old.active);
 assert.equal(migrated.exercises.find(e=>e.id==='my-hack')?.sets,3);assert.ok(migrated.exercises.some(e=>e.id==='custom'));
 for(const cat of ['Full Legs','Full Body'] as const){const e=startSession(migrated,cat).entries.find(e=>e.name==='Hack Squat')!;assert.equal(e.exerciseId,'my-hack');assert.equal(e.previous[0],'50');}
 const body=startSession(migrated,'Full Body');body.entries[0].sets[0]={weight:'60',reps:'12',targetReps:12,complete:true};migrated.sessions=[finishSession(body),...migrated.sessions];assert.equal(progress(migrated,'my-hack',12).at(-1)?.weight,60);
});

import {createWeekDemo} from './demo';
test('week preview is isolated, reproducible, and uses completed chronological snapshots',()=>{
 const real=emptyData();real.active={id:'real',category:'Full Legs',started:'2026-10-18T10:00:00Z',paused:false,entries:[]};const original=JSON.stringify(real);
 const demo=createWeekDemo(new Date(2026,9,18,18));assert.equal(demo.sessions.length,6);assert.deepEqual([...new Set(demo.sessions.map(s=>s.category))].sort(),['Full Body','Full Legs','Full Upper']);assert.ok(demo.sessions.every(s=>s.id.startsWith('demo-')&&s.entries.every(e=>e.sets.every(r=>r.complete))));assert.ok(demo.sessions[0].started>demo.sessions.at(-1)!.started);assert.equal(demo.active,undefined);assert.equal(JSON.stringify(real),original);
});

import {createNinetyDayDemo} from './demo';
import {addBodyRecord,addWeight,createDemoProfile,emptyProfile} from './profile';
test('90-day demo spans three months and progresses loads without future records',()=>{
 const now=new Date('2026-10-26T20:00:00');const demo=createNinetyDayDemo(now);
 assert.ok(demo.sessions.length>=45);assert.ok(demo.sessions.every(s=>new Date(s.finished!)<=now));
 const oldest=demo.sessions.at(-1)!;assert.ok((now.getTime()-new Date(oldest.started).getTime())/86400000>=85);
 assert.equal(new Set(demo.sessions.map(s=>s.category)).size,3);
 const id=demo.exercises.find(e=>e.name==='Hack Squat')!;const points=progress(demo,id.progressId??id.id,12);assert.ok(points.at(-1)!.weight>points[0].weight);
});
test('profile weigh-ins validate, replace same-day values, sort and preserve profile',()=>{
 const p={...emptyProfile(),heightCm:168,photo:'data:image/jpeg;base64,test'};
 const next=addWeight(addWeight(p,73,'2026-01-02'),74,'2026-01-01');const updated=addWeight(next,72.5,'2026-01-02');
 assert.equal(p.weights.length,0);assert.deepEqual(updated.weights.map(w=>w.kg),[74,72.5]);assert.equal(updated.photo,p.photo);assert.equal(updated.heightCm,168);
 assert.throws(()=>addWeight(p,0,'2026-01-01'));assert.throws(()=>addWeight(p,NaN,'2026-01-01'));assert.throws(()=>addWeight(p,70,'2026-02-31'));assert.throws(()=>addWeight(p,70,'2999-01-01'));
 assert.ok(createDemoProfile(new Date('2026-10-26')).weights.length>=12);
});

test('body records merge optional fields by day and preserve the existing profile',()=>{
 const p={...emptyProfile(),goal:'Maintain' as const,weights:[{date:'2026-01-01',kg:70}]};
 const a=addBodyRecord(p,{date:'2026-01-02',waist:80,hips:95});
 const b=addBodyRecord(a,{date:'2026-01-02',energy:4,sleep:3,soreness:2});
 const next=addBodyRecord(b,{date:'2026-01-02',waist:79,hips:undefined});
 assert.deepEqual(next.bodyRecords,[{date:'2026-01-02',waist:79,hips:95,energy:4,sleep:3,soreness:2}]);
 assert.equal(next.goal,'Maintain');assert.deepEqual(next.weights,p.weights);assert.equal('bodyRecords' in p,false);
 assert.equal(addBodyRecord(next,{date:'2026-01-01',arm:30}).bodyRecords![0].date,'2026-01-01');
 for(const record of [{date:'2026-02-31',waist:80},{date:'2999-01-01',waist:80},{date:'2026-01-01'},{date:'2026-01-01',waist:NaN},{date:'2026-01-01',arm:0},{date:'2026-01-01',sleep:6},{date:'2026-01-01',energy:1.5}])assert.throws(()=>addBodyRecord(p,record));
 assert.deepEqual(JSON.parse(JSON.stringify(next)),next);
});

test('Pilates attendance counts as a completed session without changing strength data',()=>{
 const data=createNinetyDayDemo(new Date('2026-10-26T10:00:00'));const active=startSession(data,'Full Legs');data.active=active;
 const next=recordPilatesClass(data,'2026-01-01','  Relaxed and energized  ');const logged=next.sessions.find(s=>s.kind==='class')!;
 assert.equal(logged.note,'Relaxed and energized');assert.equal(JSON.parse(JSON.stringify(next)).sessions.find((s:any)=>s.id===logged.id).note,logged.note);assert.equal(logged.category,'Pilates');assert.ok(logged.finished);assert.deepEqual(logged.entries,[]);assert.equal(next.active,active);assert.equal(next.exercises,data.exercises);
 assert.equal(next.sessions.length,data.sessions.length+1);assert.equal(data.sessions.some(s=>s.kind==='class'),false);
 assert.throws(()=>recordPilatesClass(next,'2026-01-01'));assert.throws(()=>recordPilatesClass(data,'2999-01-01'));assert.throws(()=>recordPilatesClass(data,'2026-02-31'));
 assert.deepEqual(progress(next,'missing',12),[]);
});

test('video guides cover templates and custom links survive workout snapshots',async()=>{
 const {exerciseVideo,validVideoUrl}=await import('./exerciseVideos');
 const {installTemplates}=await import('./templates');
 const data=installTemplates(emptyData());
 for(const e of data.exercises)assert.ok(exerciseVideo(e.name),e.name);
 for(const url of ['javascript:alert(1)','data:text/html,test','http://example.com','https://user:pass@example.com'])assert.equal(validVideoUrl(url),false);
 const url='https://www.youtube.com/watch?v=example';
 data.exercises[0].videoUrl=url;
 const session=startSession(data,'Full Legs');data.exercises[0].videoUrl='https://example.com/changed';
 assert.equal(JSON.parse(JSON.stringify(session)).entries[0].videoUrl,url);
 assert.equal(exerciseVideo('Custom exercise',url)?.url,url);
 assert.equal(exerciseVideo('Unknown exercise'),undefined);
});

test('backups restore full records and reject malformed sessions',async()=>{
 const {parseBackup}=await import('./backup');
 const data={version:1,exercises:[],sessions:[]};
 const profile={name:'Maria',weights:[{date:'2026-10-01',kg:70}]};
 assert.deepEqual(parseBackup(JSON.stringify({format:'gym-tracker-backup',version:1,data,profile})).profile,profile);
 assert.deepEqual(parseBackup(JSON.stringify(data)).data,data);
 assert.throws(()=>parseBackup(JSON.stringify({...data,sessions:[{id:'bad'}]})));
 assert.throws(()=>parseBackup(JSON.stringify({format:'gym-tracker-backup',version:2,data})));
});
