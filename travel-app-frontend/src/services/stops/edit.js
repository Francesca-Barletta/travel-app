import { db } from '../../../src/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
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