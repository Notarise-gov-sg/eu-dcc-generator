import { notariseAcceptedTestResultCodes, euAcceptedTestResultCodes, notariseAcceptedTestTypeCodes, euAcceptedTestTypeCodes, TestingRecord, TestRecord } from "../types";

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
   "697989009": "LP217198-3", // ART -> Rapid immunoassay
   "258500001": "LP6464-4", // PCR NASAL -> Nucleic acid amplification with probe detection
   "119342007": "LP6464-4", // PCR SALIVA -> Nucleic acid amplification with probe detection
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
    return {
      type: testTypeName,
      euTestRecord: {
        tg: targetDisease,
        tt: testingRecord.testTypeCode,
        sc: testingRecord.collectionDateTime,
        tr: testingRecord.testResultCode,
        tc: testingRecord.testCenter,
        co: testingRecord.testCountry,
        is: issuerName,
        ci: UniqueCertificateId,
      },
      expiryDateTime
    }
  });
};
