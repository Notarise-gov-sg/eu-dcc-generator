import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { EuTestRecord } from "../index";
import { notariseAcceptedTestResultCodes, euAcceptedTestResultCodes, notariseAcceptedTestTypeCodes, euAcceptedTestTypeCodes, TestingRecord, TestRecord } from "../types";

dayjs.locale("en-sg");
dayjs.extend(utc);
dayjs.extend(customParseFormat);

/**
 * What EU DCC uses:
 * 260415000 (Not detected) / 260373001 (Detected)
 */
const euDccToNotariseTestResultCode = {
  "260385009" : "260415000", // Negative -> Not detected
  "10828004": "260373001", // Positive -> Detected
};

const acceptedTestResultCodes = [...notariseAcceptedTestResultCodes, ...euAcceptedTestResultCodes];

/**
 * What EU DCC uses:
 * LP6464-4 (Nucleic acid amplification with probe detection) / LP217198-3 (Rapid immunoassay)
 */
 const euNotariseToDccTestTypeCode = {
   "97097-0": "LP217198-3", // Notarise ART [Loinc Code] -> EU RAT (Rapid immunoassay) [Loinc Code]
   "94531-1": "LP6464-4", // Notarise PCR [Loinc Code] -> EU NAAT (Nucleic acid amplification with probe detection) [Loinc Code]
   "94309-2": "LP6464-4", // Notarise PCR (Recommended) [Loinc Code] -> EU NAAT (Nucleic acid amplification with probe detection) [Loinc Code]
 };

const acceptedTestTypeCodes = [...notariseAcceptedTestTypeCodes, ...euAcceptedTestTypeCodes];

export const targetDisease = "840539006";

/**
 * Helper function to generate a Testing record and ensures that testResultCode has correct EU record.
 * @param testingRecord
 * @returns
 */
export const genTestingRecord = (testingRecords: TestingRecord[], expiryDateTime: string, issuerName: string, reference: string): TestRecord[] => {
  const validatedTestingRecords = (testingRecords).map((testingRecord) => {
    if (!acceptedTestResultCodes.includes(testingRecord.testResultCode)) {
      throw new Error(
        `Invalid testResultCode (${testingRecord.testResultCode}) received. Should be one of these values: ${JSON.stringify(
          acceptedTestResultCodes
        )}`
      );
    }

    if (!acceptedTestTypeCodes.includes(testingRecord.testTypeCode)) {
      throw new Error(
        `Invalid testTypeCode (${testingRecord.testTypeCode}) received. Should be one of these values: ${JSON.stringify(
          acceptedTestTypeCodes
        )}`
      );
    }

    const validateCollectionDateTime = testingRecord.collectionDateTime.split('T')[0]; // take only date value if ISO-8601 format
    if (
      !dayjs(
        validateCollectionDateTime,
        ["YYYY", "YYYY-MM", "YYYY-MM-DD"],
        true
      ).isValid()
    ) {
      throw new Error(
        `Invalid dateOfBirth (${testingRecord.collectionDateTime}). Should be YYYY-MM-DD or YYYY-MM or YYYY or ISO-8601 format`
      );
    }
      
    /* If Notarise codes are used, map it to EU DCC codes */

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isEuDccTestResultCode = (x: any): x is typeof euAcceptedTestResultCodes[number] =>
    euAcceptedTestResultCodes.includes(x);
    if (!isEuDccTestResultCode(testingRecord.testResultCode)) {
      testingRecord.testResultCode = euDccToNotariseTestResultCode[testingRecord.testResultCode];
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isEuDccTestTypeCode = (x: any): x is typeof euAcceptedTestTypeCodes[number] =>
    euAcceptedTestTypeCodes.includes(x);
    if (!isEuDccTestTypeCode(testingRecord.testTypeCode)) {
      testingRecord.testTypeCode = euNotariseToDccTestTypeCode[testingRecord.testTypeCode];
    }
    return testingRecord;
  });

  let incrementTestNumber = 0;
  return validatedTestingRecords.map((testingRecord): TestRecord => {
    incrementTestNumber += 1;
    // Set increment dose number + reference
    const uniqueRef = `${incrementTestNumber}${reference.toUpperCase()}`;
    // Set Unique Cert Id with prefix + version + country + unique ref
    const UniqueCertificateId = `URN:UVCI:01:SG:${uniqueRef}`;
    const testTypeName =
      testingRecord.testTypeCode === "LP6464-4"
        ? "PCR"
        : testingRecord.testTypeCode === "LP217198-3"
        ? "ART"
        : "";
    const collectionDateTime = 
      dayjs(testingRecord.collectionDateTime, ["YYYY", "YYYY-MM", "YYYY-MM-DD"], true).isValid()
        ? testingRecord.collectionDateTime
        : dayjs.utc(testingRecord.collectionDateTime).format("YYYY-MM-DDTHH:mm:ss[Z]");
    const euTestRecord: EuTestRecord = {
      tg: targetDisease,
      tt: testingRecord.testTypeCode,
      sc: collectionDateTime,
      tr: testingRecord.testResultCode,
      tc: testingRecord.testCenter,
      co: testingRecord.testCountry,
      is: issuerName,
      ci: UniqueCertificateId,
    }
    if(testTypeName === "PCR"){
      euTestRecord.nm = testingRecord.naatTestName?.substring(0,80);
    }
    else if(testTypeName === "ART") {
      euTestRecord.ma = testingRecord.ratTestDeviceCode;
    }
    return {
      type: testTypeName,
      euTestRecord,
      expiryDateTime
    }
  });
};
