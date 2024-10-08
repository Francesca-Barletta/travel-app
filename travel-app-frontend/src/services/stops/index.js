

import { db } from '../../../src/firebase';
import { collection, getDocs} from 'firebase/firestore';

// Leggere tutti i stops/tappe
export const getStops = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'stops'));
    const stops = [];
    querySnapshot.forEach((doc) => {
      stops.push({ id: doc.id, ...doc.data() });
    });
    return stops;
  } catch (e) {
    console.error('Error getting documents: ', e);
    throw e;
  }
};