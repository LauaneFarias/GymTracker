export const categories = ['Full Legs', 'Full Upper', 'Full Body', 'Pilates', 'Leg Day', 'Arms Day'] as const;
export type Category = typeof categories[number];
export type Exercise = { id: string; progressId?: string; videoUrl?: string; category: Category; name: string; sets: number; reps: number };
export type SetRecord = { weight: string; reps: string; targetReps: number; complete: boolean };
export type Entry = { exerciseId: string; name: string; videoUrl?: string; skipped: boolean; sets: SetRecord[]; previous: string[] };
export type Session = { kind?: 'class'; note?: string; id: string; category: Category; started: string; finished?: string; paused: boolean; entries: Entry[] };
export type Data = { version: 1; exercises: Exercise[]; sessions: Session[]; active?: Session; templatesVersion?: 1 };
export const emptyData = (): Data => ({ version: 1, exercises: [], sessions: [] });
export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
export function startSession(data: Data, category: Category): Session {
 return { id: uid(), category, started: new Date().toISOString(), paused: false, entries: data.exercises.filter(e => e.category === category).map(e => {
 const exerciseId = e.progressId ?? e.id;
 const last = data.sessions.find(s => s.finished && s.entries.some(x => x.exerciseId === exerciseId && !x.skipped && x.sets.some(r => r.complete)));
 const previous = last?.entries.find(x => x.exerciseId === exerciseId)?.sets.map(s => s.complete ? s.weight : '') ?? [];
 return { exerciseId, name: e.name, videoUrl: e.videoUrl, skipped: false, previous, sets: Array.from({length: e.sets}, (_, i) => ({weight: previous[i] ?? '', reps: String(e.reps), targetReps: e.reps, complete: false})) };
 }) };
}
export function validSet(s: SetRecord) { return s.weight.trim() !== '' && Number.isFinite(Number(s.weight)) && Number(s.weight) >= 0 && /^\d+$/.test(s.reps) && Number(s.reps) > 0; }
export function completedSets(s: Session) { return s.entries.filter(e => !e.skipped).flatMap(e => e.sets).filter(r => r.complete); }
export function finishSession(s: Session): Session {
 if (!completedSets(s).length) throw new Error('Complete at least one set before finishing.');
 if (completedSets(s).some(r => !validSet(r))) throw new Error('Check weights and reps before finishing.');
 return {...s, paused: false, finished: new Date().toISOString(), entries: s.entries.map(e => ({...e, sets: e.sets.map(r => ({...r, complete: !e.skipped && r.complete}))}))};
}
export function progress(data: Data, exerciseId: string, reps: number) {
 return [...data.sessions].reverse().flatMap(s => {
 const weights = s.entries.filter(e => e.exerciseId === exerciseId && !e.skipped).flatMap(e => e.sets).filter(r => r.complete && Number(r.reps) === reps).map(r => Number(r.weight));
 return weights.length ? [{date: s.finished!, weight: Math.max(...weights)}] : [];
 });
}

// Attendance is a completed session without strength sets; preserve active workouts.
export function recordPilatesClass(data:Data,date:string,note?:string):Data {
 const d=new Date(date+'T12:00:00');const key=(v:Date)=>`${v.getFullYear()}-${String(v.getMonth()+1).padStart(2,'0')}-${String(v.getDate()).padStart(2,'0')}`;
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(d.getTime())||key(d)!==date||date>key(new Date()))throw new Error('Choose a valid date, today or earlier.');
 if(data.sessions.some(s=>s.kind==='class'&&s.category==='Pilates'&&key(new Date(s.started))===date))throw new Error('A Pilates class is already recorded for this day.');
 const time=(date===key(new Date())?new Date():d).toISOString();
 return {...data,sessions:[{id:uid(),kind:'class' as const,note:note?.trim()||undefined,category:'Pilates' as const,started:time,finished:time,paused:false,entries:[]},...data.sessions].sort((a,b)=>b.started.localeCompare(a.started))};
}
