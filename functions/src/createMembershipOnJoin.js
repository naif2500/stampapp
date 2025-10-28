const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(); // make sure admin is initialized
const db = admin.firestore();

/**
 * Triggered when a user requests to join a business loyalty program.
 * Handles all secure writes to Firestore.
 */
const onUserJoinMembership = functions
  .region("europe-north1") // 👈 deploys in Finland (closest to Denmark)
  .firestore.document("membershipRequests/{requestId}")
  .onCreate(async (snap) => {
    const data = snap.data();
    const { businessId, customerId } = data;

    if (!businessId || !customerId) {
      console.error("Missing businessId or customerId in membership request");
      return;
    }

    const businessRef = db.collection("businesses").doc(businessId);
    const userRef = db.collection("users").doc(customerId);
    const membershipRef = db.collection("memberships").doc(`${businessId}_${customerId}`);

    const [businessSnap, userSnap] = await Promise.all([
      businessRef.get(),
      userRef.get(),
    ]);

    if (!businessSnap.exists || !userSnap.exists) {
      console.error("❌ Invalid business or user reference");
      return;
    }

    const business = businessSnap.data();
    const user = userSnap.data();

    const initialStamps = business.type === "punch" ? 0 : 0; // adjust if needed

    await membershipRef.set({
      businessId,
      customerId,
      businessName: business.name,
      cardName: business.cardName,
      logoUrl: business.logoUrl,
      type: business.type,
      stamps: initialStamps,
      stampsNeeded: business.stampsNeeded || 9,
      joinedAt: admin.firestore.FieldValue.serverTimestamp(),
      userName: user.name || "",
      userPhone: user.phone || "",
    });

    console.log(`✅ Membership created: ${customerId} joined ${businessId}`);

    // Optional: delete request to keep collection clean
    await snap.ref.delete();
  });

module.exports = { onUserJoinMembership };
