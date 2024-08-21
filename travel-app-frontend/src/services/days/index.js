

import { db } from '../../../src/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Leggere tutti i documenti
export const getDays = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'days'));
    const days = [];
    querySnapshot.forEach((doc) => {
      days.push({ id: doc.id, ...doc.data() });
    });
    return days;
  } catch (e) {
    console.error('Error getting documents: ', e);
    throw e;
  }
};