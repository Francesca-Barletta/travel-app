import { db } from '../../../src/firebase';
import { collection, doc, setDoc, getDocs, orderBy, limit, query} from 'firebase/firestore';
import slugify from 'slugify'; 
import { v4 as uuidv4 } from 'uuid';

export const createFood = async (foodData) => {
  try {
    const foodId = uuidv4();
    // Crea uno slug basato sul nome del locale
    const slug = slugify(foodData.locale, { lower: true, strict: true });

    const foodDoc = { 
      ...foodData,
      id: foodId,
      slug,
      
     };
   

    // Aggiungi il documento alla raccolta 'foods'
    const docRef = doc(collection(db, 'foods'), foodId);
    await setDoc(docRef, foodDoc);

    console.log('Document written with ID: ', foodId);
    return foodId;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
};

export const getStopsForFoods = async (limitSize = 100) => {
  try {
    const stopsQuery = query(
      collection(db, 'stops'),
      orderBy('creazione', 'asc'),
      limit(limitSize)
    );
    const querySnapshot = await getDocs(stopsQuery);
    const stops = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return stops;
  } catch (e) {
    console.error('Error fetching stops: ', e);
    throw e;
  }
};