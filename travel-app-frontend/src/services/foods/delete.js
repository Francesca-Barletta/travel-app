// src/services/foods/delete.js
import { db } from '../../../src/firebase';
import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

export const deleteFood = async (stopId, foodId) => {
  try {
    // Riferimento alla tappa
    const stopRef = doc(db, 'stops', stopId);
    const stopDoc = await getDoc(stopRef);
    
    if (stopDoc.exists()) {
      const stopData = stopDoc.data();
      const updatedFoods = (stopData.cibi || []).filter(id => id !== foodId);

      // Aggiorna l'array cibi nella tappa
      await updateDoc(stopRef, {
        cibi: updatedFoods
      });

      // Elimina il documento del cibo
      const foodRef = doc(db, 'foods', foodId);
      await deleteDoc(foodRef);

      console.log('Food deleted and stop updated successfully');
    } else {
      console.error('Stop not found');
    }
  } catch (e) {
    console.error('Error deleting food: ', e);
  }
};
