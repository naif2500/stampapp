// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

//const { redeemStamp } = require('./src/redeemStamp');
const { consumeToken } = require('./src/consumeToken');
const { joinBusiness } = require('./src/JoinBusiness');
const { updateStampOrRedeem } = require('./src/updateStampOrRedeem');


exports.joinBusiness = joinBusiness;
exports.updateStampOrRedeem = updateStampOrRedeem;
exports.consumeToken = consumeToken;
//exports.redeemStamp = redeemStamp;
// You can add more exported functions here as needed