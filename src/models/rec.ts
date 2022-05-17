import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { RecoveryRecord, RecRecord } from "../types";
import { targetDisease } from "./pdt";

dayjs.locale("en-sg");
dayjs.extend(utc);
dayjs.extend(customParseFormat);

/**
 * Helper function to generate a Recovery record and ensures that testResultCode has correct EU record.
 * @param recoveryRecord
 * @returns
 */
export const genRecoveryRecord = (recoveryRecords: RecoveryRecord[], expiryDateTime: string, issuerName: string, reference: string): RecRecord[] => {
  const validatedRecoveryRecords = (recoveryRecords).map((recovery) => {
    const validateFirstPositiveTestDate = recovery.firstPositiveTestDate.split('T')[0]; // take only date value if ISO-8601 format
    if (
      !dayjs(
        validateFirstPositiveTestDate,
        ["YYYY-MM-DD"],
        true
      ).isValid()
    ) {
      throw new Error(
        `Invalid firstPositiveTestDate (${recovery.firstPositiveTestDate}). Should be YYYY-MM-DD format`
      );
    }
    const validateTestValidFrom = recovery.testValidFrom.split('T')[0]; // take only date value if ISO-8601 format
    if (
      !dayjs(
        validateTestValidFrom,
        ["YYYY-MM-DD"],
        true
      ).isValid()
    ) {
      throw new Error(
        `Invalid testValidFrom (${recovery.testValidFrom}). Should be YYYY-MM-DD format`
      );
    }
    const validateTestValidUntil = recovery.testValidUntil.split('T')[0]; // take only date value if ISO-8601 format
    if (
      !dayjs(
        validateTestValidUntil,
        ["YYYY-MM-DD"],
        true
      ).isValid()
    ) {
      throw new Error(
        `Invalid testValidUntil (${recovery.testValidUntil}). Should be YYYY-MM-DD format`
      );
    }
    recovery.firstPositiveTestDate = validateFirstPositiveTestDate;
    recovery.testValidFrom = validateTestValidFrom;
    recovery.testValidUntil = validateTestValidUntil;
    return recovery;
  });

  let incrementRecNumber = 0;
  return validatedRecoveryRecords.map((recoveryRecord): RecRecord => {
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
