"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genRecoveryRecord = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
const pdt_1 = require("./pdt");
dayjs_1.default.locale("en-sg");
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(customParseFormat_1.default);
/**
 * Helper function to generate a Recovery record and ensures that testResultCode has correct EU record.
 * @param recoveryRecord
 * @returns
 */
const genRecoveryRecord = (recoveryRecords, expiryDateTime, issuerName, reference) => {
    const validatedRecoveryRecords = (recoveryRecords).map((recovery) => {
        const validateFirstPositiveTestDate = recovery.firstPositiveTestDate.split('T')[0]; // take only date value if ISO-8601 format
        if (!(0, dayjs_1.default)(validateFirstPositiveTestDate, ["YYYY-MM-DD"], true).isValid()) {
            throw new Error(`Invalid firstPositiveTestDate (${recovery.firstPositiveTestDate}). Should be YYYY-MM-DD format`);
        }
        const validateTestValidFrom = recovery.testValidFrom.split('T')[0]; // take only date value if ISO-8601 format
        if (!(0, dayjs_1.default)(validateTestValidFrom, ["YYYY-MM-DD"], true).isValid()) {
            throw new Error(`Invalid testValidFrom (${recovery.testValidFrom}). Should be YYYY-MM-DD format`);
        }
        const validateTestValidUntil = recovery.testValidUntil.split('T')[0]; // take only date value if ISO-8601 format
        if (!(0, dayjs_1.default)(validateTestValidUntil, ["YYYY-MM-DD"], true).isValid()) {
            throw new Error(`Invalid testValidUntil (${recovery.testValidUntil}). Should be YYYY-MM-DD format`);
        }
        recovery.firstPositiveTestDate = validateFirstPositiveTestDate;
        recovery.testValidFrom = validateTestValidFrom;
        recovery.testValidUntil = validateTestValidUntil;
        return recovery;
    });
    let incrementRecNumber = 0;
    return validatedRecoveryRecords.map((recoveryRecord) => {
        incrementRecNumber += 1;
        // Set increment dose number + reference
        const uniqueRef = `${incrementRecNumber}${reference.toUpperCase()}`;
        // Set Unique Cert Id with prefix + version + country + unique ref
        const UniqueCertificateId = `URN:UVCI:01:SG:${uniqueRef}`;
        return {
            euRecRecord: {
                tg: pdt_1.targetDisease,
                fr: recoveryRecord.firstPositiveTestDate,
                co: recoveryRecord.testCountry,
                df: recoveryRecord.testValidFrom,
                du: recoveryRecord.testValidUntil,
                is: issuerName,
                ci: UniqueCertificateId,
            },
            expiryDateTime
        };
    });
};
exports.genRecoveryRecord = genRecoveryRecord;
