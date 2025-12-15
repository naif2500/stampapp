const { setGlobalOptions } = require("firebase-functions/v2/options");
const admin = require("firebase-admin");

setGlobalOptions({ region: "europe-north1" });

if (!admin.apps.length) {
  admin.initializeApp();
}

exports.joinBusiness = require("./src/JoinBusiness").joinBusiness;
exports.createBusinessFromInvite = require("./src/createBusiness").createBusinessFromInvite;
exports.updateStampOrRedeem = require("./src/updateStampOrRedeem").updateStampOrRedeem;
exports.consumeToken = require("./src/consumeToken").consumeToken;
