import { db } from '../../../src/firebase';
import { collection, query, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';

export const getDays = async (lastVisible, pageSize = 4) => {
  try {
    // Crea la query per recuperare i giorni ordinati per 'creazione'
    const daysQuery = query(
      collection(db, 'days'),
      orderBy('data', 'asc'),
      limit(pageSize)
    );

    // Se lastVisible è definito, utilizza startAfter per la paginazione
    const finalQuery = lastVisible ? query(daysQuery, startAfter(lastVisible)) : daysQuery;

    const querySnapshot = await getDocs(finalQuery);

    // Estrai i documenti e l'ultimo documento per la paginazione
    const days = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    return {
      days,
      newLastVisible,
    };
  } catch (e) {
    console.error('Error getting documents: ', e);
    throw e;
  }
};