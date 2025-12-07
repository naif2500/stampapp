
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

  const business = businessSnap.data();
  const initialStamps = business.type === "punch" ? business.stampsNeeded : 0;

  await userRef.set(
    {
      joinedBusinesses: {
        [businessId]: {
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
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      stampCount: initialStamps
    },
    { merge: true }
  );

  return { success: true };
});
