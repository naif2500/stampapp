
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
  let joined = {};

if (!userSnap.exists) {
  await userRef.set({
    joinedBusinesses: {},
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
} else {
  joined = userSnap.data().joinedBusinesses || {};
}



  if (joined[businessId]) {
    return { alreadyJoined: true, shortId: joined[businessId].shortId };
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
 
let shortId;
let attempts = 0;

while (attempts < 10) {
  attempts++;
  shortId = generateShortId();
  const snap = await businessRef
    .collection("customers")
    .where("shortId", "==", shortId)
    .get();

  if (snap.empty) break;
}

if (!shortId) {
  throw new HttpsError("internal", "Failed to generate a unique shortId");
}


  const business = businessSnap.data();
  const initialStamps = 0;

  await userRef.update({
  [`joinedBusinesses.${businessId}`]: {
    shortId,
    stamps: initialStamps,
    name: business.name,
    cardName: business.cardName,
    type: business.type,
    logoUrl: business.logoUrl,
    stampsNeeded: business.stampsNeeded
  }
});


  await businessRef.collection("customers").doc(customerId).set(
    {
      customerId,
      shortId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      stampCount: initialStamps
    },
    { merge: true }
  );

  return { success: true, shortId };
});
