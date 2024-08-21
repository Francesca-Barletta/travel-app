import { db } from '../../../src/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const getStopBySlug = async (slug) => {
  try {
    const q = query(collection(db, 'stops'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0]; // Supponiamo che lo slug sia unico
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('No such document!');
    }
  } catch (e) {
    console.error('Error getting document: ', e);
    throw e;
  }
};