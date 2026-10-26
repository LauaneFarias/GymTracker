import {Data, emptyData, startSession} from './model';
import {installTemplates} from './templates';

// Isolated, in-memory sample data. Never passed to the real-data persistence key.
export function createWeekDemo(now=new Date()): Data {
 const data=installTemplates(emptyData());
 const monday=new Date(now);monday.setHours(9,0,0,0);monday.setDate(monday.getDate()-((monday.getDay()+6)%7));
 const plan=[['Full Legs',0],['Full Upper',1],['Full Body',2],['Full Legs',4],['Full Upper',5],['Full Body',6]] as const;
 const weights: Record<string,number>={'Hack Squat':80,'Leg Press':120,'Leg Extension':40,'Leg Curl':35,'Hip Abductor':45,'Hip Adductor':40,'Hip Thrust':80,'Barbell Bench Press':40,'Incline Bench Press':30,'Barbell Row':40,'Single-Arm Dumbbell Row':16,'Biceps Curl':10,'Shoulder Press':20,'Overhead Triceps Extension':12,'Bulgarian Split Squat':12};
 for(const [category,day] of plan){
  const started=new Date(monday);started.setDate(started.getDate()+day);
  if(started>now)continue;
  const session=startSession(data,category);session.id=`demo-${day}`;session.started=started.toISOString();session.finished=new Date(started.getTime()+46*60000).toISOString();
  session.entries.forEach(e=>e.sets.forEach((r,i)=>{r.weight=String((weights[e.name]??20)+(day>3?2.5:0)+(i===3?2.5:0));r.complete=true;}));
  data.sessions.unshift(session);
 }
 return data;
}

export function createNinetyDayDemo(now=new Date()):Data{
 const data=installTemplates(emptyData());const baseline=createWeekDemo(new Date('2026-10-18T20:00:00'));const base=new Map(baseline.sessions.flatMap(s=>s.entries.map(e=>[e.name,Number(e.sets[0].weight)] as const)));
 let index=0;
 for(let daysAgo=89;daysAgo>=0;daysAgo--){const started=new Date(now);started.setDate(started.getDate()-daysAgo);started.setHours(8,0,0,0);if(started>now||![1,3,5,6].includes(started.getDay()))continue;
 const category=(['Full Legs','Full Upper','Full Body'] as const)[index%3];const session=startSession(data,category);session.id=`demo-90-${daysAgo}`;session.started=started.toISOString();session.finished=new Date(Math.min(now.getTime(),started.getTime()+(42+index%19)*60000)).toISOString();
 session.entries.forEach((entry,ei)=>entry.sets.forEach((set,si)=>{const initial=base.get(entry.name)??20;set.weight=String(Math.round((initial*.7+Math.floor((89-daysAgo)/21)*2.5+(si===3&&index%4===0?2.5:0))*2)/2);set.complete=!(index%9===0&&ei===session.entries.length-1&&si===3);}));data.sessions.unshift(session);index++;
 }
 return data;
}
