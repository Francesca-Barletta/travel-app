import { db } from '../../../src/firebase';
import { collection, query, where, getDocs} from 'firebase/firestore';

// Funzione per ottenere la tappa con giorno e cibo
export const getStopBySlug = async (slug) => {
  try {
    // Recupera la tappa per lo slug specificato
    const stopQuery = query(collection(db, 'stops'), where('slug', '==', slug));
    const stopSnapshot = await getDocs(stopQuery);

    if (stopSnapshot.empty) {
      throw new Error('No such stop document!');
    }

    const stopDoc = stopSnapshot.docs[0];
    const stopData = { id: stopDoc.id, ...stopDoc.data() };

    console.log('Stop Data:', stopData);

    // Recupera tutti i giorni
    const daysQuery = query(collection(db, 'days'));
    const daysSnapshot = await getDocs(daysQuery);
    const days = daysSnapshot.docs.map(dayDoc => ({ id: dayDoc.id, ...dayDoc.data() }));
    console.log('All Days:', days);

    // Trova il giorno associato alla tappa
    if (stopData.day_id) {
      const day = days.find(day => day.id === stopData.day_id);
      if (day) {
        stopData.day = day;
      } else {
        console.error('Day not found for ID:', stopData.day_id);
         // Imposta a null
        stopData.day = null;
      }
    }

    // Recupera i cibi per la tappa
    const foodsQuery = query(collection(db, 'foods'), where('stop_id', '==', stopData.id));
    const foodsSnapshot = await getDocs(foodsQuery);
    const foods = foodsSnapshot.docs.map(foodDoc => ({ id: foodDoc.id, ...foodDoc.data() }));

    // console.log('Foods:', foods);

    return {
      ...stopData,
      foods
    };
  } catch (e) {
    console.error('Error getting document: ', e);
    throw e;
  }
};