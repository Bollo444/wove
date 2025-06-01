"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationStatus = exports.VerificationMethod = void 0;
var VerificationMethod;
(function (VerificationMethod) {
    VerificationMethod["GOOGLE_SSO"] = "google_sso";
    VerificationMethod["PARENTAL_CONSENT_EMAIL"] = "parental_consent_email";
    VerificationMethod["ID_DOCUMENT"] = "id_document";
    VerificationMethod["CREDIT_CARD_CHECK"] = "credit_card_check";
    VerificationMethod["SELF_DECLARATION"] = "self_declaration";
    VerificationMethod["AUTOMATED_QUESTION"] = "automated_question";
})(VerificationMethod || (exports.VerificationMethod = VerificationMethod = {}));
var VerificationStatus;
(function (VerificationStatus) {
    VerificationStatus["PENDING"] = "pending";
    VerificationStatus["VERIFIED"] = "verified";
    VerificationStatus["REJECTED"] = "rejected";
    VerificationStatus["EXPIRED"] = "expired";
})(VerificationStatus || (exports.VerificationStatus = VerificationStatus = {}));
//# sourceMappingURL=verification.js.map