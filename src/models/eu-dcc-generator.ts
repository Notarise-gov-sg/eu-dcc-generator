import { GenericEuDccTemplate, isRecoveryRecordArray, PdtTemplate, RecTemplate, VacTemplate } from "../types";
import {
  BasicDetails,
  TestingRecord,
  VaccinationRecord,
  RecoveryRecord,
  isTestingRecordArray,
  isVaccinationRecord,
} from "../types";
import { genPatientDetails } from "./patient";
import { genTestingRecord } from "./pdt";
import { genRecoveryRecord } from "./rec";
import { genVaccinationRecord } from "./vac";

/**
 * Generates generate EU Digital Covid Certificates payload depending on the type of record provided (i.e. TestingRecord or VaccinationRecord or RecoveryRecord).
 *
 * @param basicDetails
 * @param record
 */
export function genEuDcc(basicDetails: BasicDetails, record: TestingRecord[]): PdtTemplate[];
export function genEuDcc(basicDetails: BasicDetails, record: VaccinationRecord): VacTemplate[];
export function genEuDcc(basicDetails: BasicDetails, record: RecoveryRecord[]): RecTemplate[];

export function genEuDcc(
  basicDetails: BasicDetails,
  record: VaccinationRecord | TestingRecord[] | RecoveryRecord[]
): VacTemplate[] | PdtTemplate[] | RecTemplate[] {
  const { reference, issuerName, expiryDays, patientDetails } = basicDetails;
  const { nam, dob, meta } = genPatientDetails(patientDetails);
  const expiryDateTime = new Date();
  expiryDateTime.setDate(expiryDateTime.getDate() + expiryDays);

  const baseTemplate: GenericEuDccTemplate = {
    ver: "1.3.0",
    nam,
    dob,
    meta
  };

  if (isVaccinationRecord(record)) {
    const vaccinationRecords = genVaccinationRecord(record, expiryDateTime.toISOString(), issuerName, reference);
    const final: VacTemplate[] = vaccinationRecords.map((vaccination) => {
      return {
        certificate: {
          ...baseTemplate,
          v: [vaccination.euVaccineRecord]
        },
        vaccineCode: vaccination.vaccineCode,
        doseNumber: vaccination.doseNumber,
        expiryDateTime: vaccination.expiryDateTime
      }
    });
    return final;
  } else if (isTestingRecordArray(record)) {
    const testingRecords = genTestingRecord(record, expiryDateTime.toISOString(), issuerName, reference);
    const final: PdtTemplate[] = testingRecords.map((testing) => {
      return {
        certificate: {
          ...baseTemplate,
          t: [testing.euTestRecord]
        },
        type: testing.type,
        expiryDateTime: testing.expiryDateTime
      }
    });
    return final;
  }  else if (isRecoveryRecordArray(record)) {
    const recoveryRecords = genRecoveryRecord(record, expiryDateTime.toISOString(), issuerName, reference);
    const final: RecTemplate[] = recoveryRecords.map((recovery) => {
      return {
        certificate: {
          ...baseTemplate,
          r: [recovery.euRecRecord]
        },
        expiryDateTime: recovery.expiryDateTime
      }
    });
    return final;
  } else {
    throw new Error("Please provide a valid testingRecord or vaccinationRecord or recoveryRecord.");
  }
}
