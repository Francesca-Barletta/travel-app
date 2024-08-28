import { db } from '../../../src/firebase';
import {  collection, getDocs, doc, updateDoc, query, where, orderBy, limit} from 'firebase/firestore';
import slugify from 'slugify'; 

export const updateStop = async (slug, stopData) => {
    try {
        // Trova il documento con il campo slug specifico
        const querySnapshot = await getDocs(collection(db, 'stops'));
        const docRef = querySnapshot.docs.find(doc => doc.data().slug === slug);

        if (docRef) {
            await updateDoc(docRef.ref, {
                paese: stopData.paese,
                attivita: stopData.attivita,
                descrizione: stopData.descrizione,
                slug: slugify(stopData.paese, { lower: true })
            });
            console.log('Document updated successfully');
        } else {
            console.error('Document not found');
        }
    } catch (e) {
        console.error('Error updating document: ', e);
    }
};
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
  