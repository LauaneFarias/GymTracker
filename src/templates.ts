import { Category, Data, Exercise } from './model';

export const workoutTemplates: {category: Category; names: string[]}[] = [
 {category:'Full Legs', names:['Hack Squat','Leg Press','Leg Extension','Leg Curl','Hip Abductor','Hip Adductor','Hip Thrust']},
 {category:'Full Upper', names:['Barbell Bench Press','Incline Bench Press','Barbell Row','Single-Arm Dumbbell Row','Biceps Curl','Shoulder Press','Overhead Triceps Extension']},
 {category:'Full Body', names:['Hack Squat','Hip Thrust','Barbell Bench Press','Barbell Row','Shoulder Press','Bulgarian Split Squat','Leg Extension','Overhead Triceps Extension']},
];
const normalize = (name: string) => name.trim().toLowerCase();

// Add placements once. Existing records, settings and snapshots remain intact.
export function installTemplates(data: Data): Data {
 if (data.templatesVersion === 1) return data;
 const identities = new Map<string,string>();
 data.exercises.forEach(e=>{if(!identities.has(normalize(e.name))) identities.set(normalize(e.name),e.progressId??e.id);});
 data.sessions.forEach(s=>s.entries.forEach(e=>{if(!identities.has(normalize(e.name))) identities.set(normalize(e.name),e.exerciseId);}));
 data.active?.entries.forEach(e=>{if(!identities.has(normalize(e.name))) identities.set(normalize(e.name),e.exerciseId);});
 const templatePlacements: Exercise[] = [];
 const reused = new Set<string>();
 for(const template of workoutTemplates) for(const name of template.names) {
  const existing=data.exercises.find(e=>e.category===template.category&&normalize(e.name)===normalize(name));
  if(existing){templatePlacements.push(existing);reused.add(existing.id);continue;}
  const key=normalize(name);
  const progressId=identities.get(key)??`exercise:${key.replace(/[^a-z0-9]+/g,'-')}`;
  identities.set(key,progressId);
  templatePlacements.push({id:`template:${template.category}:${progressId}`,progressId,category:template.category,name,sets:4,reps:12});
 }
 return {...data,templatesVersion:1,exercises:[...templatePlacements,...data.exercises.filter(e=>!reused.has(e.id))]};
}
