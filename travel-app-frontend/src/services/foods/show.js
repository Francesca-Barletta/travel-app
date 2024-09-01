import { db } from '../../../src/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Funzione per ottenere il cibo e la tappa associata usando lo slug del cibo
export const getFoodWithStopBySlug = async (slug) => {
  try {
    // Recupera il cibo per lo slug specificato
    const foodQuery = query(collection(db, 'foods'), where('slug', '==', slug));
    const foodSnapshot = await getDocs(foodQuery);

    if (foodSnapshot.empty) {
      throw new Error('No such food document!');
    }

    const foodDoc = foodSnapshot.docs[0];
    const foodData = { id: foodDoc.id, ...foodDoc.data() };

    console.log('Food Data:', foodData);

    // Recupera la tappa associata utilizzando lo stop_id
    let stopData = null;
    if (foodData.stop_id) {
      // query per recuperare lo stop con l'id uguale a stop_id
      const stopQuery = query(collection(db, 'stops'), where('id', '==', foodData.stop_id));
      const stopSnapshot = await getDocs(stopQuery);

      if (!stopSnapshot.empty) {
        const stopDoc = stopSnapshot.docs[0];
        stopData = { id: stopDoc.id, ...stopDoc.data() };
        console.log('Stop Data:', stopData);
      } else {
        console.error('No such stop document with ID:', foodData.stop_id);
      }
    }

    return {
      food: foodData,
      stop: stopData
    };
  } catch (e) {
    console.error('Error getting document: ', e);
    throw e;
  }
};
