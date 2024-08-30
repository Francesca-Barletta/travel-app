// services/stops/create.js
import { db } from '../../../src/firebase';
import { collection, doc, setDoc, updateDoc, Timestamp, getDoc, getDocs, query, orderBy, limit } from 'firebase/firestore'; // Aggiungi le importazioni mancanti
import slugify from 'slugify'; 
import { v4 as uuidv4 } from 'uuid';

// Funzione per creare una nuova tappa
export const createStop = async (stopData) => {
  try {
    const stopId = uuidv4();
    const slug = slugify(stopData.paese, { lower: true, strict: true });
    const currentTimestamp = Timestamp.now();

    const stopDoc = { 
      ...stopData,
      id: stopId,
      slug,
      creazione: currentTimestamp,
      cibi: stopData.cibi || [],
    };

    // Aggiungi il documento alla raccolta 'stops'
    const docRef = doc(collection(db, 'stops'), stopId);
    await setDoc(docRef, stopDoc);

    console.log('Tappa creata con ID:', stopId);

    // Aggiorna il documento del giorno per includere l'ID della tappa
    if (stopData.day_id) {
      const dayRef = doc(db, 'days', stopData.day_id);
      const dayDoc = await getDoc(dayRef);

      if (dayDoc.exists()) {
        const dayData = dayDoc.data();
        const updatedTappe = [ ...(dayData.tappe || []), stopId ];
        await updateDoc(dayRef, { tappe: updatedTappe });
        console.log('Documento giorno aggiornato con ID:', stopData.day_id);
      } else {
        console.error('Documento giorno non trovato:', stopData.day_id);
      }
    }

    return stopId;
  } catch (e) {
    console.error('Errore durante l\'aggiunta della tappa:', e);
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
    console.error('Errore durante il recupero dei giorni:', e);
    throw e;
  }
};
