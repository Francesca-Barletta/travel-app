import { db } from '../../../src/firebase';
import { collection, query, where, getDocs, doc, writeBatch } from 'firebase/firestore';

export const deleteDayAndAssociates = async (dayId) => {
  const batch = writeBatch(db);
  console.log('ID del giorno:', dayId);

  try {
    const stopsQuery = query(collection(db, 'stops'), where('day_id', '==', dayId));
    const stopsSnapshot = await getDocs(stopsQuery);

    if (stopsSnapshot.empty) {
      console.log('Nessuna tappa trovata per dayId:', dayId);
    } else {
      console.log('Tappe trovate per dayId:', dayId, stopsSnapshot.docs.length);

      for (const stopDoc of stopsSnapshot.docs) {
        const stopId = stopDoc.id;
        console.log('Tappa trovata:', stopDoc.id);

        const foodsQuery = query(collection(db, 'foods'), where('stop_id', '==', stopId));
        const foodsSnapshot = await getDocs(foodsQuery);

        if (foodsSnapshot.empty) {
          console.log('Nessun cibo trovato per stopId:', stopId);
        } else {
          console.log('Cibi trovati per stopId:', stopId, foodsSnapshot.docs.length);

          for (const foodDoc of foodsSnapshot.docs) {
            console.log('Cibo trovato:', foodDoc.id, foodDoc.data());
            batch.delete(doc(db, 'foods', foodDoc.id)); // Elimina il cibo
          }
        }
        batch.delete(doc(db, 'stops', stopId)); // Elimina la tappa
      }
    }

    batch.delete(doc(db, 'days', dayId)); // Elimina il giorno

    await batch.commit();
    console.log('Giorno e associati eliminati con successo');
  } catch (error) {
    console.error('Errore durante l\'eliminazione del giorno e degli associati:', error);
  }
};