const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");


const db = admin.firestore();


exports.updateStampOrRedeem = onCall(async (request) => {
   const { userId, businessId } = request.data;

  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "You must be logged in to call this function."
    );
  }

  if (!userId || !businessId) {
    throw new HttpsError(
      "invalid-argument",
      "Missing userId or businessId"
    );
  }

  if (request.auth.uid !== businessId) {
  throw new HttpsError(
    "permission-denied",
    "You can only update customers for your own business."
  );
}


  const userRef = db.collection("users").doc(userId);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    throw new HttpsError("not-found", "User not found");
  }

  const userData = userSnap.data();
  const joinedBusinesses = { ...userData.joinedBusinesses };
  const card = joinedBusinesses[businessId];

  if (!card || card.type !== "stamp") {
    throw new HttpsError(
      "failed-precondition",
      "No stamp card found for this business"
    );
  }

  const currentStamps = card.stamps || 0;
  const needed = card.stampsNeeded || 9;

  const customerRef = db.collection(`businesses/${businessId}/customers`).doc(userId);
  const historyRef = customerRef.collection("history");
  const userHistoryRef = userRef.collection("history");
  const globalRef = db.collection('globalActivity')


  if (currentStamps < needed) {
    // Add a stamp
    joinedBusinesses[businessId].stamps = currentStamps + 1;

    await customerRef.update({
      stampCount: currentStamps + 1,
      lastStampTime: FieldValue.serverTimestamp()
    });

    await userRef.update({
      joinedBusinesses,
      lastStampTime: FieldValue.serverTimestamp()
    });

    const log = { type: "stamp", businessId, customerId: userId, timestamp: FieldValue.serverTimestamp() };
    await historyRef.add(log);
    await userHistoryRef.add(log);
    await globalRef.add(log);

    return { status: "stamp_added", currentStamps: currentStamps + 1 };
  } else if (currentStamps === needed) {
    // Redeem
    joinedBusinesses[businessId].stamps = 0;

    await customerRef.update({
      stampCount: 0,
      lastRedeemTime: FieldValue.serverTimestamp()
    });

    await userRef.update({
      joinedBusinesses,
      lastRedeemTime: FieldValue.serverTimestamp()
    });

    const log = { type: "redeem", businessId, customerId: userId, timestamp: FieldValue.serverTimestamp() };
    await historyRef.add(log);
    await userHistoryRef.add(log);
    await globalRef.add(log); 

    return { status: "redeemed", currentStamps: 0 };
  }

  return { status: "no_change", currentStamps };
});
