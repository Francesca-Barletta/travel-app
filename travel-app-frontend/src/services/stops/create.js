import { db } from '../../../src/firebase';
import { collection, addDoc } from 'firebase/firestore';
import slugify from 'slugify'; 

export const createStop = async (stopData) => {
  try {
    // Crea uno slug basato sul paese
    const slug = slugify(stopData.paese, { lower: true, strict: true });

    // Aggiunge lo slug ai dati della tappa
    const stopWithSlug = { ...stopData, slug };

    // Aggiungi il documento alla raccolta 'stops'
    const docRef = await addDoc(collection(db, 'stops'), stopWithSlug);

    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
};