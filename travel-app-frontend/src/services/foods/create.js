
import { db } from '../../../src/firebase';
import { collection, doc, setDoc, query, where, getDocs } from 'firebase/firestore';
import slugify from 'slugify'; 
import { v4 as uuidv4 } from 'uuid';
import { updateStopWithFood } from '../stops/edit'; // Assicurati che il percorso sia corretto

export const createFood = async (foodData) => {
  try {
    // Genera un ID univoco per il cibo
    const foodId = uuidv4();
    const slug = slugify(foodData.locale, { lower: true, strict: true });

    // Crea il documento del cibo
    const foodDoc = { 
      ...foodData,
      id: foodId,
      slug,
    };

    // Riferimento al documento del cibo nella collection 'foods'
    const docRef = doc(collection(db, 'foods'), foodId);
    await setDoc(docRef, foodDoc);

    // Aggiorna la tappa con il nuovo ID del cibo se stop_id è fornito
    if (foodData.stop_id) {
      await updateStopWithFood(foodData.stop_id, foodId);
    }

    console.log('Document written with ID: ', foodId);
    return foodId;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
};

export const getStopBySlug = async (slug) => {
  try {
    const stopsQuery = query(collection(db, 'stops'), where('slug', '==', slug));
    const querySnapshot = await getDocs(stopsQuery);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data(); // Torna il primo documento trovato
    } else {
      throw new Error('No stop found with that slug');
    }
  } catch (e) {
    console.error('Error fetching stop by slug: ', e);
    throw e;
  }
};