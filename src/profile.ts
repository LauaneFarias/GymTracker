export type WeighIn={date:string;kg:number};
export type Profile={name:string;photo?:string;heightCm?:number;weights:WeighIn[];bodyRecords?:BodyRecord[];goal?:BodyGoal};
export const emptyProfile=():Profile=>({name:'Maria Saadeh',weights:[]});
export function addWeight(profile:Profile,kg:number,date:string):Profile{
 if(!Number.isFinite(kg)||kg<=0||kg>1000)throw new Error('Enter a weight between 0 and 1,000 kg.');
 const parsed=new Date(date+'T12:00:00');if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(parsed.getTime())||localDate(parsed)!==date||date>localDate(new Date()))throw new Error('Choose a valid date, today or earlier.');
 return {...profile,weights:[...profile.weights.filter(w=>w.date!==date),{date,kg}].sort((a,b)=>a.date.localeCompare(b.date))};
}
export const localDate=(d:Date)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export function createDemoProfile(now=new Date()):Profile{const weights:WeighIn[]=[];for(let day=84;day>=0;day-=7){const d=new Date(now);d.setDate(d.getDate()-day);weights.push({date:localDate(d),kg:Math.round((74.8-(84-day)*.035+Math.sin(day)*.2)*10)/10});}return {name:'Maria Saadeh',heightCm:168,weights};}

export type BodyRecord={date:string;waist?:number;hips?:number;thigh?:number;arm?:number;energy?:number;sleep?:number;soreness?:number};
export type BodyGoal='Build muscle'|'Reduce measurements'|'Maintain';
export function addBodyRecord(profile:Profile,record:BodyRecord):Profile{
 const parsed=new Date(record.date+'T12:00:00');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(record.date)||Number.isNaN(parsed.getTime())||localDate(parsed)!==record.date||record.date>localDate(new Date()))throw new Error('Choose a valid date, today or earlier.');
 const measures=['waist','hips','thigh','arm'] as const, ratings=['energy','sleep','soreness'] as const;
 if(![...measures,...ratings].some(k=>record[k]!==undefined))throw new Error('Add at least one measurement or rating.');
 for(const k of measures){const v=record[k];if(v!==undefined&&(!Number.isFinite(v)||v<=0||v>300))throw new Error('Measurements must be between 0 and 300 cm.');}
 for(const k of ratings){const v=record[k];if(v!==undefined&&(!Number.isInteger(v)||v<1||v>5))throw new Error('Ratings must be from 1 to 5.');}
 const existing=(profile.bodyRecords??[]).find(r=>r.date===record.date);
 const values=Object.fromEntries(Object.entries(record).filter(([,v])=>v!==undefined));
 return {...profile,bodyRecords:[...(profile.bodyRecords??[]).filter(r=>r.date!==record.date),{...existing,...values} as BodyRecord].sort((a,b)=>a.date.localeCompare(b.date))};
}
