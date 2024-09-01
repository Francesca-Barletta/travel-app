import { db } from '../../../src/firebase';
import { collection, query, where, getDocs} from 'firebase/firestore';

// Funzione per ottenere il giorno con tappe e cibi
export const getDayBySlug = async (slug) => {
  try {
    // Recupera il giorno per lo slug specificato
    const dayQuery = query(collection(db, 'days'), where('slug', '==', slug));
    const daySnapshot = await getDocs(dayQuery);

    if (daySnapshot.empty) {
      throw new Error('No such document!');
    }

    const dayDoc = daySnapshot.docs[0];
    const dayData = { id: dayDoc.id, ...dayDoc.data() };

    // Controlla se ci sono tappe e recupera solo se l'array non è vuoto
    let stops = [];
    if (dayData.tappe && dayData.tappe.length > 0) {
      const stopsQuery = query(collection(db, 'stops'), where('id', 'in', dayData.tappe));
      const stopsSnapshot = await getDocs(stopsQuery);

      stops = await Promise.all(stopsSnapshot.docs.map(async (stopDoc) => {
        const stopData = { id: stopDoc.id, ...stopDoc.data() };

        // Recupera i cibi per ogni tappa
        const foodsQuery = query(collection(db, 'foods'), where('stop_id', '==', stopData.id));
        const foodsSnapshot = await getDocs(foodsQuery);
        const foods = foodsSnapshot.docs.map(foodDoc => ({ id: foodDoc.id, ...foodDoc.data() }));

        return {
          ...stopData,
          foods
        };
      }));
    }

    return {
      ...dayData,
      stops
    };
  } catch (e) {
    console.error('Error getting document: ', e);
    throw e;
  }
};