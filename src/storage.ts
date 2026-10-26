import AsyncStorage from '@react-native-async-storage/async-storage';
import { Data, emptyData } from './model';
import { installTemplates } from './templates';
const KEY = 'gym-tracker:v1';
export async function loadData(): Promise<Data> {
 const raw = await AsyncStorage.getItem(KEY);
 if (!raw) { const data = installTemplates(emptyData()); await saveData(data); return data; }
 const data = JSON.parse(raw);
 if (data.version !== 1 || !Array.isArray(data.exercises) || !Array.isArray(data.sessions)) throw new Error('Saved data could not be read. Your records have not been overwritten.');
 const migrated = installTemplates(data);
 if (migrated !== data) {
  await AsyncStorage.setItem(`${KEY}:before-templates`, raw);
  await saveData(migrated);
 }
 return migrated;
}
let queue: Promise<void> = Promise.resolve();
export function saveData(data: Data) {
 const raw = JSON.stringify(data);
 const next = queue.catch(() => {}).then(() => AsyncStorage.setItem(KEY, raw));
 queue = next;
 return next;
}
