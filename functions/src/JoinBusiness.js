const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2/options");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

setGlobalOptions({ region: "europe-north1" });

exports.joinBusiness = onCall(async (request) => {
  const { customerId, businessId } = request.data;

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated");
  }

  if (!customerId || !businessId) {
    throw new HttpsError("invalid-argument", "Missing customerId or businessId");
  }

  const businessRef = db.collection("businesses").doc(businessId);
  const businessSnap = await businessRef.get();
  if (!businessSnap.exists) {
    throw new HttpsError("not-found", "Business not found");
  }

  const business = businessSnap.data();
  const initialStamps = business.type === "punch" ? business.stampsNeeded : 0;

  const userRef = db.collection("users").doc(customerId);
  const userSnap = await userRef.get();
  const userData = userSnap.exists ? userSnap.data() : {};
  const currentJoined = userData.joinedBusinesses || {};

  await userRef.set(
    {
      createdAt:
        userData.createdAt ||
        admin.firestore.FieldValue.serverTimestamp(),

      joinedBusinesses: {
        ...currentJoined,
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

  const customerRef = businessRef.collection("customers").doc(customerId);

  await customerRef.set(
    {
      customerId,
      name: userData.name || "",
      phone: userData.phone || "",
      stampCount: initialStamps,
      type: business.type,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  return { success: true };
});
