import { db } from '../../../src/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import slugify from 'slugify'; 

export const updateDay = async (slug, dayData) => {
    try {
        // Trova il documento con il campo slug specifico
        const querySnapshot = await getDocs(collection(db, 'days'));
        const docRef = querySnapshot.docs.find(doc => doc.data().slug === slug);

        if (docRef) {
            await updateDoc(docRef.ref, {
                titolo: dayData.titolo,
                alloggio: dayData.alloggio,
                citta_alloggio: dayData.citta_alloggio,
                regione: dayData.regione,
                data: dayData.data,
                slug: slugify(dayData.titolo, { lower: true }),
                photoUrls: dayData.photoUrls || [],
            });
            console.log('Document updated successfully');
        } else {
            console.error('Document not found');
        }
    } catch (e) {
        console.error('Error updating document: ', e);
    }
};