import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

async function logActivity({
  userId,
  userName,
  userEmail,
  userPhotoUrl,
  businessId,
  businessName,
  cardName,
  type,
  stampsBefore,
  stampsAfter
}) {
  const logRef = collection(db, 'activityLogs');
  await addDoc(logRef, {
    userId,
    userName,
    userEmail,
    userPhotoUrl,
    businessId,
    businessName,
    cardName,
    type,
    stampsBefore,
    stampsAfter,
    timestamp: serverTimestamp(),
  });
}
