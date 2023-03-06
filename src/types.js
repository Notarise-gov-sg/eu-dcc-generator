"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRecoveryRecordArray = exports.isTestingRecordArray = exports.euAcceptedTestTypeCodes = exports.notariseAcceptedTestTypeCodes = exports.euAcceptedTestResultCodes = exports.notariseAcceptedTestResultCodes = exports.isVaccinationRecord = void 0;
const util_1 = require("./util");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isVaccinationRecord(x) {
    const keys = [
        "vaccineCode",
        "vaccineName",
        "vaccineLot",
        "vaccinationDateTime",
        "vaccinationLocationCode",
        "vaccinationCountry"
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Array.isArray(x.vaccinations) && (x.vaccinations).every((obj) => {
        const _keys = Object.keys(obj);
        return (0, util_1.arrayEquals)(_keys.sort(), keys.sort()) && _keys.every((k) => typeof obj[k] === "string");
    });
}
exports.isVaccinationRecord = isVaccinationRecord;
/**
* What Notarise uses:
* 260385009 (Negative) / 10828004 (Positive)
*/
exports.notariseAcceptedTestResultCodes = ["260385009", "10828004"];
/**
* What EU DCC uses:
* 260415000 (Not detected) / 260373001 (Detected)
*/
exports.euAcceptedTestResultCodes = ["260415000", "260373001"];
/**
 * What Notarise uses:
 * ART (97097-0) / PCR (94531-1)/ PCR (94309-2) (Recommended)
 */
exports.notariseAcceptedTestTypeCodes = ["97097-0", "94531-1", "94309-2"];
/**
* What EU DCC uses:
* LP6464-4 (Nucleic acid amplification with probe detection) / LP217198-3 (Rapid immunoassay)
*/
exports.euAcceptedTestTypeCodes = ["LP6464-4", "LP217198-3"];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isTestingRecordArray(x) {
    const keys = [
        "collectionDateTime",
        "testCenter",
        "testCountry",
        "testResultCode",
        "testTypeCode"
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Array.isArray(x) && x.every((obj) => {
        const inputKey = [...keys];
        const _keys = Object.keys(obj);
        if (obj.naatTestName)
            inputKey.push("naatTestName");
        if (obj.ratTestDeviceCode)
            inputKey.push("ratTestDeviceCode");
        return (obj.naatTestName || obj.ratTestDeviceCode) && (0, util_1.arrayEquals)(_keys.sort(), inputKey.sort()) && _keys.every((k) => typeof obj[k] === "string");
    });
}
exports.isTestingRecordArray = isTestingRecordArray;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isRecoveryRecordArray(x) {
    /* Todo: implement for recovery cert*/
    const keys = [
        "firstPositiveTestDate",
        "testCountry",
        "testValidFrom",
        "testValidUntil"
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Array.isArray(x) && x.every((obj) => {
        const _keys = Object.keys(obj);
        return (0, util_1.arrayEquals)(_keys.sort(), keys.sort()) && _keys.every((k) => typeof obj[k] === "string");
    });
}
exports.isRecoveryRecordArray = isRecoveryRecordArray;
;
;
;
;
;
;
