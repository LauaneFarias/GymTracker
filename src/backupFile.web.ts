// Browser download/upload of backup JSON.
export async function saveBackupFile(json:string,name:string){const url=URL.createObjectURL(new Blob([json],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function pickBackupFile():Promise<string|undefined>{return new Promise((resolve,reject)=>{const input=document.createElement('input');input.type='file';input.accept='.json,application/json';input.onchange=async()=>{try{const file=input.files?.[0];if(!file)return resolve(undefined);if(file.size>20*1024*1024)throw new Error('Choose a backup smaller than 20 MB.');resolve(await file.text());}catch(e){reject(e);}};input.click();});}
export function reloadApp(){location.reload();return true;}
