// Muscle & Strength video guides, verified October 2026. Variants are explicit.
const guides: Record<string,[string,string]> = {
 'hack squat':['hack-squat.html','Machine hack squat'],
 'leg press':['45-degree-leg-press.html','45° leg press'],
 'leg extension':['leg-extension.html','Leg extension machine'],
 'leg curl':['leg-curl.html','Lying leg curl'],
 'hip abductor':['hip-abduction-machine.html','Hip abduction machine'],
 'hip adductor':['hip-adduction-machine.html','Hip adduction machine'],
 'hip thrust':['barbell-hip-thrust','Barbell hip thrust'],
 'barbell bench press':['barbell-bench-press.html','Barbell bench press'],
 'incline bench press':['incline-bench-press.html','Incline barbell bench press'],
 'barbell row':['bent-over-barbell-row.html','Bent-over barbell row'],
 'single-arm dumbbell row':['one-arm-dumbbell-row.html','One-arm dumbbell row'],
 'biceps curl':['standing-barbell-curl.html','Standing barbell curl'],
 'shoulder press':['seated-shoulder-press.html','Seated barbell shoulder press'],
 'overhead triceps extension':['french-press.html','Barbell French press'],
 'bulgarian split squat':['one-leg-dumbbell-squat-aka-bulgarian-squat.html','Dumbbell Bulgarian split squat'],
};
export function validVideoUrl(value:string){try{const u=new URL(value);return u.protocol==='https:'&&!!u.hostname&&!u.username&&!u.password;}catch{return false;}}
export function exerciseVideo(name:string,custom?:string){
 if(custom?.trim()&&validVideoUrl(custom.trim()))return {url:custom.trim(),variant:'Your video link'};
 const guide=guides[name.trim().toLowerCase()];
 return guide?{url:`https://www.muscleandstrength.com/exercises/${guide[0]}`,variant:guide[1]}:undefined;
}
