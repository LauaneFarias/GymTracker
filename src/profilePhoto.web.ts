const isHeic=(uri:string)=>/^data:image\/(heic|heif)/i.test(uri);
function readDataUrl(blob:Blob):Promise<string>{return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error('Could not read your photo.'));reader.readAsDataURL(blob);});}
export async function prepareProfilePhoto(uri:string):Promise<string>{
 if(!isHeic(uri))return uri;
 const {default:decode}=await import('heic2any');
 const blob=await (await fetch(uri)).blob();
 const result=await decode({blob,toType:'image/jpeg',quality:.8});
 const jpeg=Array.isArray(result)?result[0]:result;
 const url=URL.createObjectURL(jpeg);
 try{
  const img=await new Promise<HTMLImageElement>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Could not convert this photo. Try a JPEG or PNG.'));image.src=url;});
  const canvas=document.createElement('canvas');const scale=Math.min(1,512/Math.max(img.naturalWidth,img.naturalHeight));canvas.width=Math.round(img.naturalWidth*scale);canvas.height=Math.round(img.naturalHeight*scale);
  const context=canvas.getContext('2d');if(!context)return readDataUrl(jpeg);context.drawImage(img,0,0,canvas.width,canvas.height);return canvas.toDataURL('image/jpeg',.85);
 }finally{URL.revokeObjectURL(url);}
}
