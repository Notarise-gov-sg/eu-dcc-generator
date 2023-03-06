"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const dcc_sdk_1 = require("@pathcheck/dcc-sdk");
const eu_dcc_generator_1 = require("./models/eu-dcc-generator");
const APPLE_URL_PREFIX = `https://redirect.health.apple.com/EU-DCC/#`;
/*
  Implement this function for set specific expiry datetime.
  `makeCWT` function in `@pathcheck/dcc-sdk` package only support to set expiry month.
*/
const makeCWT = (payload, expiryDateTime, issuerName) => {
    const CWT_ISSUER = 1;
    const CWT_EXPIRATION = 4;
    const CWT_ISSUED_AT = 6;
    const CWT_HCERT = -260;
    const CWT_HCERT_V1 = 1;
    const cwt = new Map();
    const iss = new Date();
    cwt.set(CWT_ISSUED_AT, Math.round(iss.getTime() / 1000));
    cwt.set(CWT_EXPIRATION, Math.round((new Date(expiryDateTime)).getTime() / 1000));
    cwt.set(CWT_ISSUER, issuerName);
    cwt.set(CWT_HCERT, new Map());
    cwt.get(CWT_HCERT).set(CWT_HCERT_V1, payload);
    return cwt;
};
const signPayload = async (euHealthCerts, publicKeyPem, privateKeyP8, issuerName) => {
    const publicKey = publicKeyPem.replace(/\\n/g, "\n");
    const privateKey = privateKeyP8.replace(/\\n/g, "\n");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const euHealthCertsQr = [];
    await Promise.all(euHealthCerts.map(async (euHealthCert) => {
        const qrData = await (0, dcc_sdk_1.signAndPack)(makeCWT(euHealthCert.certificate, euHealthCert.expiryDateTime, issuerName), publicKey, privateKey);
        euHealthCertsQr.push({ ...euHealthCert, qr: qrData, appleCovidCardUrl: APPLE_URL_PREFIX + encodeURIComponent(qrData.slice(4)) });
    }));
    return euHealthCertsQr;
};
exports.default = (publicKeyPem, privateKeyP8, issuerName) => {
    return {
        genEuDcc: eu_dcc_generator_1.genEuDcc,
        signPayload: (euHealthCerts) => {
            return signPayload(euHealthCerts, publicKeyPem, privateKeyP8, issuerName);
        },
    };
};
__exportStar(require("./types"), exports);
