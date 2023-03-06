"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genTestingRecord = exports.targetDisease = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
const types_1 = require("../types");
dayjs_1.default.locale("en-sg");
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(customParseFormat_1.default);
/**
 * What EU DCC uses:
 * 260415000 (Not detected) / 260373001 (Detected)
 */
const euDccToNotariseTestResultCode = {
    "260385009": "260415000",
    "10828004": "260373001", // Positive -> Detected
};
const acceptedTestResultCodes = [...types_1.notariseAcceptedTestResultCodes, ...types_1.euAcceptedTestResultCodes];
/**
 * What EU DCC uses:
 * LP6464-4 (Nucleic acid amplification with probe detection) / LP217198-3 (Rapid immunoassay)
 */
const euNotariseToDccTestTypeCode = {
    "97097-0": "LP217198-3",
    "94531-1": "LP6464-4",
    "94309-2": "LP6464-4", // Notarise PCR (Recommended) [Loinc Code] -> EU NAAT (Nucleic acid amplification with probe detection) [Loinc Code]
};
const acceptedTestTypeCodes = [...types_1.notariseAcceptedTestTypeCodes, ...types_1.euAcceptedTestTypeCodes];
exports.targetDisease = "840539006";
/**
 * Helper function to generate a Testing record and ensures that testResultCode has correct EU record.
 * @param testingRecord
 * @returns
 */
const genTestingRecord = (testingRecords, expiryDateTime, issuerName, reference) => {
    const validatedTestingRecords = (testingRecords).map((testingRecord) => {
        if (!acceptedTestResultCodes.includes(testingRecord.testResultCode)) {
            throw new Error(`Invalid testResultCode (${testingRecord.testResultCode}) received. Should be one of these values: ${JSON.stringify(acceptedTestResultCodes)}`);
        }
        if (!acceptedTestTypeCodes.includes(testingRecord.testTypeCode)) {
            throw new Error(`Invalid testTypeCode (${testingRecord.testTypeCode}) received. Should be one of these values: ${JSON.stringify(acceptedTestTypeCodes)}`);
        }
        const validateCollectionDateTime = testingRecord.collectionDateTime.split('T')[0]; // take only date value if ISO-8601 format
        if (!(0, dayjs_1.default)(validateCollectionDateTime, ["YYYY-MM-DD"], true).isValid()) {
            throw new Error(`Invalid collectionDateTime (${testingRecord.collectionDateTime}). Should be ISO-8601 date and time format`);
        }
        /* If Notarise codes are used, map it to EU DCC codes */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isEuDccTestResultCode = (x) => types_1.euAcceptedTestResultCodes.includes(x);
        if (!isEuDccTestResultCode(testingRecord.testResultCode)) {
            testingRecord.testResultCode = euDccToNotariseTestResultCode[testingRecord.testResultCode];
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isEuDccTestTypeCode = (x) => types_1.euAcceptedTestTypeCodes.includes(x);
        if (!isEuDccTestTypeCode(testingRecord.testTypeCode)) {
            testingRecord.testTypeCode = euNotariseToDccTestTypeCode[testingRecord.testTypeCode];
        }
        return testingRecord;
    });
    let incrementTestNumber = 0;
    return validatedTestingRecords.map((testingRecord) => {
        incrementTestNumber += 1;
        // Set increment dose number + reference
        const uniqueRef = `${incrementTestNumber}${reference.toUpperCase()}`;
        // Set Unique Cert Id with prefix + version + country + unique ref
        const UniqueCertificateId = `URN:UVCI:01:SG:${uniqueRef}`;
        const testTypeName = testingRecord.testTypeCode === "LP6464-4"
            ? "PCR"
            : testingRecord.testTypeCode === "LP217198-3"
                ? "ART"
                : "";
        const euTestRecord = {
            tg: exports.targetDisease,
            tt: testingRecord.testTypeCode,
            sc: dayjs_1.default.utc(testingRecord.collectionDateTime).format("YYYY-MM-DDTHH:mm:ss[Z]"),
            tr: testingRecord.testResultCode,
            tc: testingRecord.testCenter,
            co: testingRecord.testCountry,
            is: issuerName,
            ci: UniqueCertificateId,
        };
        if (testTypeName === "PCR") {
            euTestRecord.nm = testingRecord.naatTestName?.substring(0, 80);
        }
        else if (testTypeName === "ART") {
            euTestRecord.ma = testingRecord.ratTestDeviceCode;
        }
        return {
            type: testTypeName,
            euTestRecord,
            expiryDateTime
        };
    });
};
exports.genTestingRecord = genTestingRecord;
