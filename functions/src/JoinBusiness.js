
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();


exports.joinBusiness = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const customerId = request.auth.uid;
  const { businessId } = request.data;

  if (!businessId) {
    throw new HttpsError("invalid-argument", "Missing businessId");
  }

  const userRef = db.collection("users").doc(customerId);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    await userRef.set({
      joinedBusinesses: {},
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }



  const businessRef = db.collection("businesses").doc(businessId);
  const businessSnap = await businessRef.get();

  if (!businessSnap.exists) {
    throw new HttpsError("not-found", "Business not found");
  }

  
  function generateShortId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}
 
// Generate shortId and ensure uniqueness inside this business
let shortId;
let exists = true;

while (exists) {
  shortId = generateShortId();
  const checkRef = businessRef.collection("customers")
    .where("shortId", "==", shortId);
  const snap = await checkRef.get();
  exists = !snap.empty;
}

  const business = businessSnap.data();
  const initialStamps = 0;

  await userRef.set(
    {
      joinedBusinesses: {
        [businessId]: {
          shortId,
          stamps: initialStamps,
          name: business.name,
          cardName: business.cardName,
          type: business.type,
          logoUrl: business.logoUrl,
          stampsNeeded: business.stampsNeeded
        }
      }
    },
    { merge: true }
  );

  await businessRef.collection("customers").doc(customerId).set(
    {
      customerId,
      shortId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      stampCount: initialStamps
    },
    { merge: true }
  );

  return { success: true };
});
