import { db } from '../../../src/firebase';
import { collection, doc, setDoc, Timestamp, getDocs, orderBy, limit, query} from 'firebase/firestore';
import slugify from 'slugify'; 
import { v4 as uuidv4 } from 'uuid';

export const createStop = async (stopData) => {
  try {
    const stopId = uuidv4();
    // Crea uno slug basato sul paese
    const slug = slugify(stopData.paese, { lower: true, strict: true });
    const currentTimestamp = Timestamp.now();
    // Aggiunge lo slug ai dati della tappa
    const stopDoc = { 
      ...stopData,
      id: stopId,
      slug,
      creazione:currentTimestamp,
      cibi: stopData.cibi || [],
     };

    // Aggiungi il documento alla raccolta 'stops'
    const docRef = doc(collection(db, 'stops'), stopId);
    await setDoc(docRef, stopDoc);

    console.log('Document written with ID: ', stopId);
    return stopId;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
};

// Funzione per ottenere i giorni disponibili
export const getDaysForStops = async (limitSize = 100) => {
  try {
    const daysQuery = query(
      collection(db, 'days'),
      orderBy('creazione', 'asc'),
      limit(limitSize)
    );
    const querySnapshot = await getDocs(daysQuery);
    const days = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return days;
  } catch (e) {
    console.error('Error fetching days: ', e);
    throw e;
  }
};
