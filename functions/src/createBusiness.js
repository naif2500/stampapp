const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

const db = admin.firestore();

exports.createBusinessFromInvite = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const {
    inviteId,
    name,
    city,
    postcode,
    logoUrl,
    cardName,
    stampsNeeded
  } = request.data;

  if (!inviteId || !name || !cardName || !stampsNeeded) {
    throw new HttpsError("invalid-argument", "Missing required fields");
  }

  const businessId = request.auth.uid;

  const inviteRef = db.collection("invites").doc(inviteId);
  const inviteSnap = await inviteRef.get();

  if (!inviteSnap.exists) {
    throw new HttpsError("not-found", "Invite not found");
  }

  const invite = inviteSnap.data();

  if (invite.used === true) {
    throw new HttpsError("failed-precondition", "Invite already used");
  }

  const businessRef = db.collection("businesses").doc(businessId);

  await db.runTransaction(async (tx) => {
    tx.set(businessRef, {
      ownerId: businessId,
      name,
      city: city || "",
      postcode: postcode || "",
      logoUrl: logoUrl || "",
      cardName,
      stampsNeeded: Number(stampsNeeded),

      // 🔒 Hardcoded for MVP
      type: "stamp",

      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    tx.update(inviteRef, {
      used: true,
      usedBy: businessId,
      usedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  return { success: true };
});
