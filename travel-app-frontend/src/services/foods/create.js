import { db } from '../../../src/firebase';
import { collection, addDoc } from 'firebase/firestore';
import slugify from 'slugify'; 

export const createFood = async (foodData) => {
  try {
    // Crea uno slug basato sul nome del locale
    const slug = slugify(foodData.locale, { lower: true, strict: true });

    // Aggiunge lo slug ai dati della tappa
    const foodWithSlug = { ...foodData, slug };

    // Aggiungi il documento alla raccolta 'foods'
    const docRef = await addDoc(collection(db, 'foods'), foodWithSlug);

    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
};