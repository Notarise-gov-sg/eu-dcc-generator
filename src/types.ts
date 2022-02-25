import { arrayEquals } from "./util";

export interface PatientDetails {
  name: string;
  familyName?: string;
  firstName?: string;
  dateOfBirth: string;
  meta?: object;
}

export interface EuNamRecord {
  fn?: string;
  fnt: string;
  gn?: string;
  gnt?: string;
}

export interface EuVaccineRecord {
  tg: string;
  vp: string;
  mp: string;
  ma: string;
  dn: number;
  sd: number;
  dt: string;
  co: string;
  is: string;
  ci: string;
}

export interface EuTestRecord {
  tg: string;
  tt: string;
  nm?: string;
  ma?: string;
  sc: string;
  tr: string;
  tc: string;
  co: string;
  is: string;
  ci: string;
}

export interface EuRecRecord {
  tg: string;
  fr: string;
  co: string;
  is: string;
  df: string;
  du: string;
  ci: string;
}

/* input types for vaccine certificate */
export interface Vaccination {
  vaccineCode: string;
  vaccineName: string;
  vaccineLot: string;
  vaccinationDateTime: string;
  vaccinationLocationCode: string;
  vaccinationCountry: string;
  isBooster?: boolean;
}

export interface VaccinationRecord {
  vaccinations: Vaccination[];
  effectiveDate: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isVaccinationRecord(x: any): x is VaccinationRecord {
  const keys = [
    "vaccineCode",
    "vaccineName",
    "vaccineLot",
    "vaccinationDateTime",
    "vaccinationLocationCode",
    "vaccinationCountry"
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return x.effectiveDate && (x.vaccinations).every((obj: any) => {
    const _keys = Object.keys(obj);
    return arrayEquals(_keys.sort(), keys.sort()) && _keys.every((k) => typeof obj[k] === "string");
  });
}

/**
* What Notarise uses:
* 260385009 (Negative) / 10828004 (Positive)
*/
export const notariseAcceptedTestResultCodes = ["260385009", "10828004"];

/**
* What EU DCC uses:
* 260415000 (Not detected) / 260373001 (Detected)
*/
export const euAcceptedTestResultCodes = ["260415000", "260373001"];

/**
 * What Notarise uses:
 * ART (97097-0) / PCR (94531-1)
 */
export const notariseAcceptedTestTypeCodes = ["97097-0", "94531-1"];

/**
* What EU DCC uses:
* LP6464-4 (Nucleic acid amplification with probe detection) / LP217198-3 (Rapid immunoassay)
*/
export const euAcceptedTestTypeCodes = ["LP6464-4", "LP217198-3"];

  
/* input types for test certificate */
export interface TestingRecord {
  testTypeCode: string;
  naatTestName?: string;
  ratTestDeviceCode?: string; //use device code from here https://github.com/ehn-dcc-development/ehn-dcc-valuesets/blob/main/test-manf.json
  collectionDateTime: string;
  testResultCode: string;
  testCenter: string;
  testCountry: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isTestingRecordArray(x: any): x is TestingRecord[] {
  const keys = [
    "collectionDateTime",
    "testCenter",
    "testCountry",
    "testResultCode",
    "testTypeCode"
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Array.isArray(x) && x.every((obj: any) => {
    const inputKey = [...keys];
    const _keys = Object.keys(obj);
    if(obj.naatTestName) inputKey.push("naatTestName");
    if(obj.ratTestDeviceCode) inputKey.push("ratTestDeviceCode");
    return (obj.naatTestName || obj.ratTestDeviceCode) && arrayEquals(_keys.sort(), inputKey.sort()) && _keys.every((k) => typeof obj[k] === "string");
  });
}

/* input types for recovery certificate */
export interface RecoveryRecord {
  firstPositiveTestDate: string;
  testCountry: string;
  testValidFrom: string;
  testValidUntil: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isRecoveryRecordArray(x: any): x is RecoveryRecord[] {
  /* Todo: implement for recovery cert*/
  const keys = [
    "firstPositiveTestDate",
    "testCountry",
    "testValidFrom",
    "testValidUntil"
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Array.isArray(x) && x.every((obj: any) => {
    const _keys = Object.keys(obj);
    return arrayEquals(_keys.sort(), keys.sort()) && _keys.every((k) => typeof obj[k] === "string");
  });
}

/* output types for vaccine certificate */
export interface VaccineRecord {
  euVaccineRecord: EuVaccineRecord;
  vaccineCode: string;
  doseNumber: number;
  expiryDateTime: string;
};

/* output types for test certificate */
export interface TestRecord {
  euTestRecord: EuTestRecord;
  type: string;
  expiryDateTime: string;
};

/* output types for recovery certificate */
export interface RecRecord {
  euRecRecord: EuRecRecord;
  expiryDateTime: string;
};

export interface GenericEuDccTemplate {
  ver: "1.3.0";
  nam: EuNamRecord;
  dob: string;
  meta?: object;
}

export type PdtCertificate = GenericEuDccTemplate & {
  t: EuTestRecord[];
};

export type VacCertificate = GenericEuDccTemplate & {
  v: EuVaccineRecord[];
};

export type RecCertificate = GenericEuDccTemplate & {
  r: EuRecRecord[];
};

export interface PdtTemplate {
  certificate : PdtCertificate;
  type: string;
  expiryDateTime: string;
};

export interface VacTemplate {
  certificate : VacCertificate;
  vaccineCode: string;
  doseNumber: number;
  expiryDateTime: string;
};

export interface RecTemplate {
  certificate : RecCertificate;
  expiryDateTime: string;
};

export interface BasicDetails {
  reference: string;
  issuerName: string;
  expiryDays: number;
  patientDetails: PatientDetails;
}
