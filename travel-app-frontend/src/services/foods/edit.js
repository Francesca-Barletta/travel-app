import { db } from '../../../src/firebase';
import { collection, getDocs, updateDoc } from 'firebase/firestore';
import slugify from 'slugify'; 

// Funzione per aggiornare il documento di un cibo basato sullo slug
export const updateFood = async (slug, foodData) => {
    try {
        // Trova il documento con il campo slug specifico
        const querySnapshot = await getDocs(collection(db, 'foods'));
        const docRef = querySnapshot.docs.find(doc => doc.data().slug === slug);

        if (docRef) {
            await updateDoc(docRef.ref, {
                locale: foodData.locale,
                piatto: foodData.piatto,
                descrizione: foodData.descrizione,
                prezzo: foodData.prezzo,
                voto: foodData.voto,
                slug: slugify(foodData.locale, { lower: true, strict: true }),
                photoUrls: foodData.photoUrls || [],
            });
            console.log('Document updated successfully');
        } else {
            console.error('Document not found');
        }
    } catch (e) {
        console.error('Error updating document: ', e);
        throw e;
    }
};

// Funzione per ottenere un cibo in base allo slug
export const getFoodBySlug = async (slug) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'foods'));
        const docRef = querySnapshot.docs.find(doc => doc.data().slug === slug);

        if (docRef) {
            return { id: docRef.id, ...docRef.data() };
        } else {
            console.error('Document not found');
            return null;
        }
    } catch (e) {
        console.error('Error fetching food by slug: ', e);
        throw e;
    }
};