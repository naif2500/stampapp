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

  const userRef = db.collection("users").doc(customerId);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    throw new HttpsError("not-found", "User not found");
  }

  const joined = userSnap.data().joinedBusinesses || {};
  const card = joined[businessId];
  if (!card || card.type !== "stamp") {
    throw new HttpsError("failed-precondition", "No stamp card");
  }

  const needed = card.stampsNeeded || 9;
  const current = card.stamps || 0;

  const customerRef = db.doc(`businesses/${businessId}/customers/${customerId}`);
  const historyRef = customerRef.collection("history");
  const userHistoryRef = userRef.collection("history");

  if (current < needed) {
    joined[businessId].stamps = current + 1;

    await customerRef.update({
      stampCount: current + 1,
      lastStampTime: FieldValue.serverTimestamp()
    });

    await userRef.update({
      joinedBusinesses: joined,
      lastStampTime: FieldValue.serverTimestamp()
    });

    const log = {
      type: "stamp",
      businessId,
      timestamp: FieldValue.serverTimestamp()
    };

    await historyRef.add(log);
    await userHistoryRef.add(log);

    return { status: "stamp_added", currentStamps: current + 1, customerId };
  }

  if (current === needed) {
    joined[businessId].stamps = 0;

    await customerRef.update({
      stampCount: 0,
      lastRedeemTime: FieldValue.serverTimestamp()
    });

    await userRef.update({
      joinedBusinesses: joined,
      lastRedeemTime: FieldValue.serverTimestamp()
    });

    const log = {
      type: "redeem",
      businessId,
      timestamp: FieldValue.serverTimestamp()
    };

    await historyRef.add(log);
    await userHistoryRef.add(log);

    return { status: "redeemed", currentStamps: 0, customerId };
  }

  return { status: "no_change", currentStamps: current, customerId };
});
