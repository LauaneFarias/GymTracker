// Native backup: share sheet to save, document picker to restore.
import {File,Paths} from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import {reloadAppAsync} from 'expo';
export async function saveBackupFile(json:string,name:string){const file=new File(Paths.cache,name);if(file.exists)file.delete();file.create();file.write(json);await Sharing.shareAsync(file.uri,{mimeType:'application/json',dialogTitle:'Save Gym Tracker backup'});}
export async function pickBackupFile():Promise<string|undefined>{const result=await DocumentPicker.getDocumentAsync({type:['application/json','text/plain','*/*'],copyToCacheDirectory:true});const asset=result.canceled?undefined:result.assets[0];if(!asset)return undefined;if((asset.size??0)>20*1024*1024)throw new Error('Choose a backup smaller than 20 MB.');return new File(asset.uri).text();}
export function reloadApp(){reloadAppAsync('Backup restored').catch(()=>{});return true;}
