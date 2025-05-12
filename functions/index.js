const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.redeemStamp = functions.region('europe-west1').https.onCall(async (data, context) => {

  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }

  const userId = context.auth.uid;
  const {businessId } = data;

  const userRef = admin.firestore().collection('users').doc(userId);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    throw new functions.https.HttpsError('not-found', 'User not found');
  }

  const userData = userSnap.data();
  const joined = userData.joinedBusinesses || {};

  if (!joined[businessId]) {
    throw new functions.https.HttpsError('invalid-argument', 'User not joined to business');
  }

  const card = joined[businessId];

  if (card.type === 'stamp') {
    if ((card.stamps || 0) >= 9) {
      joined[businessId].stamps = 0; // Reset
    } else {
      throw new functions.https.HttpsError('failed-precondition', 'Not enough stamps to redeem');
    }
  } else if (card.type === 'punch') {
    if ((card.stamps || 0) > 0) {
      joined[businessId].stamps -= 1;
      if (joined[businessId].stamps <= 0) {
        delete joined[businessId];
      }
    } else {
      throw new functions.https.HttpsError('failed-precondition', 'No punches left');
    }
  } else {
    throw new functions.https.HttpsError('invalid-argument', 'Unknown card type');
  }

  await userRef.update({ joinedBusinesses: joined });
  return { success: true };
});
