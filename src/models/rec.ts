import { RecoveryRecord, RecRecord } from "../types";
import { targetDisease } from "./pdt";

/**
 * Helper function to generate a Recovery record and ensures that testResultCode has correct EU record.
 * @param recoveryRecord
 * @returns
 */
export const genRecoveryRecord = (recoveryRecords: RecoveryRecord[], expiryDateTime: string, issuerName: string, reference: string): RecRecord[] => {
  
  let incrementRecNumber = 0;
  return recoveryRecords.map((recoveryRecord): RecRecord => {
    incrementRecNumber += 1;
    // Set increment dose number + reference
    const uniqueRef = `${incrementRecNumber}${reference.toUpperCase()}`;
    // Set Unique Cert Id with prefix + version + country + unique ref
    const UniqueCertificateId = `URN:UVCI:01:SG:${uniqueRef}`;
    return {
      euRecRecord: {
        tg: targetDisease,
        fr: recoveryRecord.firstPositiveTestDate,
        co: recoveryRecord.testCountry,
        df: recoveryRecord.testValidFrom,
        du: recoveryRecord.testValidUntil,
        is: issuerName,
        ci: UniqueCertificateId,
      },
      expiryDateTime
    }
  });

};
