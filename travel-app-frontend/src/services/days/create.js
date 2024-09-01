import { db } from '../../../src/firebase';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import slugify from 'slugify'; 
import { v4 as uuidv4 } from 'uuid';

export const createDay = async (dayData) => {
  try {
    // Crea uno slug basato sul titolo
    const dayId = uuidv4();
    const slug = slugify(dayData.titolo, { lower: true, strict: true });
    const currentTimestamp = Timestamp.now(); 
    const dayDoc = {
      ...dayData,
      id: dayId, 
      slug,
      creazione: currentTimestamp,
      tappe: dayData.tappe || [],
      photoUrls: dayData.photoUrls || [],
    };

    // Aggiunge il documento alla raccolta 'days'
    const docRef = doc(collection(db, 'days'), dayId);
    await setDoc(docRef, dayDoc);
    console.log('Document written with ID: ', dayId);
    return dayId;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
};
