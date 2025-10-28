// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const { redeemStamp } = require('./src/redeemStamp');
const { onUserJoinMembership } = require('./src/createMembershipOnJoin');
const { updateStampOrRedeem } = require('./src/updateStampOrRedeem');

exports.onUserJoinMembership = onUserJoinMembership;
exports.updateStampOrRedeem = updateStampOrRedeem;
exports.redeemStamp = redeemStamp;
// You can add more exported functions here as needed