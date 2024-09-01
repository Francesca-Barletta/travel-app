import { db } from '../../../src/firebase';
import { doc, deleteDoc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';

export const deleteStopAndAssociates = async (stopId, dayId) => {
  try {
    // riferimento alla tappa da eliminare
    const stopRef = doc(db, 'stops', stopId);
    const stopDoc = await getDoc(stopRef);

    if (!stopDoc.exists()) {
      throw new Error('La tappa non esiste.');
    }

    const stopData = stopDoc.data();

    // Rimuove i cibi associati alla tappa
    if (stopData.cibi && stopData.cibi.length > 0) {
      const foodQuery = query(collection(db, 'foods'), where('id', 'in', stopData.cibi));
      const foodSnapshot = await getDocs(foodQuery);
      
      const deleteFoodPromises = foodSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteFoodPromises);
    }

    // Elimina la tappa
    await deleteDoc(stopRef);

    // Rimuove l'ID della tappa dall'array tappe nel documento del giorno
    const dayRef = doc(db, 'days', dayId);
    const dayDoc = await getDoc(dayRef);

    if (!dayDoc.exists()) {
      throw new Error('Il giorno associato non esiste.');
    }

    const dayData = dayDoc.data();
    const updatedStops = dayData.tappe.filter(id => id !== stopId);

    await updateDoc(dayRef, { tappe: updatedStops });

    console.log('Tappa e cibi associati eliminati correttamente.');
  } catch (error) {
    console.error('Errore durante la cancellazione della tappa e dei cibi associati:', error);
    throw error;
  }
};
