const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");


const db = admin.firestore();

exports.consumeToken = onCall(async (request) => {
  const { businessId, token } = request.data;

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  if (!businessId || !token) {
    throw new HttpsError("invalid-argument", "Missing businessId or token");
  }

  if (request.auth.uid !== businessId) {
  throw new HttpsError("permission-denied", "You can only use tokens for your own business");
}

  const tokenRef = db.doc(`businesses/${businessId}/tokens/${token}`);

  let customerId;
  await db.runTransaction(async (transaction) => {
    const tokenSnap = await transaction.get(tokenRef);
    if (!tokenSnap.exists) {
      throw new HttpsError("not-found", "Token not found");
    }

    const data = tokenSnap.data();
    if (data.used) {
      throw new HttpsError("failed-precondition", "Token already used");
    }

    customerId = data.customerId;
    transaction.update(tokenRef, {
      used: true,
      usedAt: FieldValue.serverTimestamp()
    });
  });

 const { getFunctions, httpsCallable } = require("firebase-admin/functions");

  const updateFn = httpsCallable(
    getFunctions(admin.app(), "europe-north1"),
    "updateStampOrRedeem"
  );

  const result = await updateFn({
    userId: customerId,
    businessId,
  });

  return {
    status: result.data.status,
    currentStamps: result.data.currentStamps,
    customerId,
  };
});