// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const { redeemStamp } = require('./redeemStamp');

exports.redeemStamp = redeemStamp;
// You can add more exported functions here as needed