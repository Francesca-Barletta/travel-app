// src/services/stops/update.js
import { db } from '../../../src/firebase';
import { collection, doc, updateDoc, getDoc, query, where, limit, orderBy, getDocs } from 'firebase/firestore';
import slugify from 'slugify';

// Funzione per aggiornare una tappa con l'ID del nuovo cibo
export const updateStopWithFood = async (stopId, foodId) => {
  try {
    const stopRef = doc(db, 'stops', stopId);
    const stopDoc = await getDoc(stopRef);
    
    if (stopDoc.exists()) {
      const stopData = stopDoc.data();
      const updatedFoods = [...(stopData.cibi || []), foodId];
      
      await updateDoc(stopRef, {
        cibi: updatedFoods
      });
      
      console.log('Stop updated with new food ID');
    } else {
      console.error('Stop not found');
    }
  } catch (e) {
    console.error('Error updating stop with food: ', e);
  }
};

// Funzione per aggiornare una tappa
export const updateStop = async (slug, stopData) => {
  try {
    // Trova il documento con il campo slug specifico
    const stopsQuery = query(
      collection(db, 'stops'),
      where('slug', '==', slug)
    );
    const querySnapshot = await getDocs(stopsQuery);
    const docRef = querySnapshot.docs[0]; // Assumiamo che ci sia solo un documento corrispondente

    if (docRef) {
      const stopId = docRef.id;
      const oldStopData = docRef.data();
      const oldDayId = oldStopData.day_id;
      const newDayId = stopData.day_id;

      // Aggiorna il documento della tappa
      await updateDoc(docRef.ref, {
        paese: stopData.paese,
        attivita: stopData.attivita,
        descrizione: stopData.descrizione,
        slug: slugify(stopData.paese, { lower: true }),
        day_id: newDayId, // Aggiorna anche l'associazione con il giorno
        cibi: stopData.cibi || [],
        photoUrls: stopData.photoUrls || [], // Aggiorna anche l'array cibi
      });
      console.log('Document updated successfully');

      // Se il day_id è cambiato, aggiorna anche i documenti del giorno
      if (oldDayId !== newDayId) {
        console.log('Day ID has changed, updating days documents.');

        // Aggiorna il giorno precedente
        if (oldDayId) {
          const oldDayRef = doc(db, 'days', oldDayId);
          const oldDayDoc = await getDoc(oldDayRef);
          if (oldDayDoc.exists()) {
            const oldDayData = oldDayDoc.data();
            const updatedOldTappe = oldDayData.tappe ? oldDayData.tappe.filter(id => id !== stopId) : [];
            console.log('Updating old day with new tappe:', updatedOldTappe);
            await updateDoc(oldDayRef, { tappe: updatedOldTappe });
            console.log('Old day updated successfully');
          } else {
            console.error('Old day document not found:', oldDayId);
          }
        }

        // Aggiungi la tappa al nuovo giorno
        if (newDayId) {
          const newDayRef = doc(db, 'days', newDayId);
          const newDayDoc = await getDoc(newDayRef);
          if (newDayDoc.exists()) {
            const newDayData = newDayDoc.data();
            const updatedNewTappe = newDayData.tappe ? [ ...(newDayData.tappe || []), stopId ] : [stopId];
            console.log('Adding new day with tappe:', updatedNewTappe);
            await updateDoc(newDayRef, { tappe: updatedNewTappe });
            console.log('New day updated successfully');
          } else {
            console.error('New day document not found:', newDayId);
          }
        }
      }

      // Aggiorna anche l'array cibi della tappa, se sono stati forniti nuovi cibi
      if (stopData.cibi && stopData.cibi.length > 0) {
        console.log('Updating foods for stop:', stopId);
        for (const foodId of stopData.cibi) {
          await updateStopWithFood(stopId, foodId);
        }
      }
    } else {
      console.error('Document not found');
    }
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

// Funzione per ottenere i giorni con un limite di risultati
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
