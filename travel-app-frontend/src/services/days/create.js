import { db } from '../../../src/firebase';
import { collection, addDoc } from 'firebase/firestore';
import slugify from 'slugify'; 

export const createDay = async (dayData) => {
  try {
    // Crea uno slug basato sul titolo
    const slug = slugify(dayData.titolo, { lower: true, strict: true });

    // Aggiunge lo slug ai dati del giorno
    const dayWithSlug = { ...dayData, slug };

    // Aggiunge il documento alla raccolta 'days'
    const docRef = await addDoc(collection(db, 'days'), dayWithSlug);

    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
};