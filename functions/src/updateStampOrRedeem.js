const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();

/**
 * Cloud Function to add a stamp or redeem a loyalty card for a user.
 * Triggered via HTTPS callable function.
 */
exports.updateStampOrRedeem = functions
  .region("europe-north1") // 👈 deploy this function in Finland (closest to Denmark)
  .https.onCall(async (data, context) => {
  const { userId, businessId } = data;

  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be logged in to call this function."
    );
  }

  if (!userId || !businessId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing userId or businessId"
    );
  }

  const userRef = db.collection("users").doc(userId);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    throw new functions.https.HttpsError("not-found", "User not found");
  }

  const userData = userSnap.data();
  const joinedBusinesses = { ...userData.joinedBusinesses };
  const card = joinedBusinesses[businessId];

  if (!card || card.type !== "stamp") {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "No stamp card found for this business"
    );
  }

  const currentStamps = card.stamps || 0;
  const needed = card.stampsNeeded || 9;

  const customerRef = db.collection(`businesses/${businessId}/customers`).doc(userId);
  const historyRef = customerRef.collection("history");
  const userHistoryRef = userRef.collection("history");

  if (currentStamps < needed) {
    // Add a stamp
    joinedBusinesses[businessId].stamps = currentStamps + 1;

    await customerRef.update({
      stampCount: currentStamps + 1,
      lastStampTime: admin.firestore.FieldValue.serverTimestamp()
    });

    await userRef.update({
      joinedBusinesses,
      lastStampTime: admin.firestore.FieldValue.serverTimestamp()
    });

    const log = { type: "stamp", businessId, timestamp: admin.firestore.FieldValue.serverTimestamp() };
    await historyRef.add(log);
    await userHistoryRef.add(log);

    return { status: "stamp_added", currentStamps: currentStamps + 1 };
  } else if (currentStamps === needed) {
    // Redeem
    joinedBusinesses[businessId].stamps = 0;

    await customerRef.update({
      stampCount: 0,
      lastRedeemTime: admin.firestore.FieldValue.serverTimestamp()
    });

    await userRef.update({
      joinedBusinesses,
      lastRedeemTime: admin.firestore.FieldValue.serverTimestamp()
    });

    const log = { type: "redeem", businessId, timestamp: admin.firestore.FieldValue.serverTimestamp() };
    await historyRef.add(log);
    await userHistoryRef.add(log);

    return { status: "redeemed", currentStamps: 0 };
  }

  return { status: "no_change", currentStamps };
});
