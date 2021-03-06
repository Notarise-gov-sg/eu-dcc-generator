import MockDate from 'mockdate';
import { BasicDetails, PatientDetails, TestingRecord, VaccinationRecord } from "../types";
import { genEuDcc } from "./eu-dcc-generator";

import notarisePdtArtSingleRecord from "../../fixtures/notarise-examples/pdt-art-single-record.json";
import notarisePdtPcrSingleRecord from "../../fixtures/notarise-examples/pdt-pcr-single-record.json";
import notariseVacSingleRecord from "../../fixtures/notarise-examples/vac-single-record.json";
import notarisePdtMultiRecord from "../../fixtures/notarise-examples/pdt-multi-record.json";

beforeEach(() => {
  MockDate.set(new Date("2022-01-01T00:00:00.000+00:00"));
});
afterEach(() => {
  MockDate.reset();
});

const patientDetails: PatientDetails = {
  name: "Tan Chen Chen",
  familyName: "Tan",
  firstName: "Chen Chen",
  dateOfBirth: "1990-01-15",
  meta: {
    reference: "abc-cde-cde",
    notarisedOn: "2022-02-26T00:00:00.000Z",
    passportNumber: "E7831177G",
    url: "storedUrl",
  }
};

const basicDetails: BasicDetails = {
  patientDetails,
  reference: "abc-cde-cde",
  issuerName: "MOH",
  expiryDaysOrDate: 365
};

const singlePCRTestingRecord: TestingRecord[] = [
  {
    testTypeCode: "94531-1",
    naatTestName: "SARS-CoV-2 (COVID-19) RNA [Presence] in Specimen by NAA with probe detection",
    collectionDateTime: "2020-09-27T06:15:00Z",
    testResultCode: "260385009",
    testCenter: "MacRitchie Medical Clinic",
    testCountry: "SG"
  }
];

const singleARTTestingRecord: TestingRecord[] = [
  {
    testTypeCode: "97097-0",
    ratTestDeviceCode: "1833",
    collectionDateTime: "2020-09-27T06:15:00Z",
    testResultCode: "260385009",
    testCenter: "MacRitchie Medical Clinic",
    testCountry: "SG"
  }
];

const multiTestingRecord: TestingRecord[] =   [
  {
    testTypeCode: "94531-1",
    naatTestName: "SARS-CoV-2 (COVID-19) RNA [Presence] in Specimen by NAA with probe detection",
    collectionDateTime: "2020-09-27T06:15:00Z",
    testResultCode: "260385009",
    testCenter: "MacRitchie Medical Clinic",
    testCountry: "SG"
  },
  {
    testTypeCode: "94531-1",
    naatTestName: "SARS-CoV-2 (COVID-19) RNA [Presence] in Specimen by NAA with probe detection",
    collectionDateTime: "2020-09-27T06:15:00Z",
    testResultCode: "260385009",
    testCenter: "MacRitchie Medical Clinic",
    testCountry: "SG"
  },
];

const vaccinationRecord: VaccinationRecord = {
  vaccinations: [
    {
      vaccineCode: "3339641000133109",
      vaccineName: "PFIZER-BIONTECH COVID-19 Vaccine [Tozinameran] Injection",
      vaccineLot: "Lot12345",
      vaccinationDateTime: "2021-02-14",
      vaccinationLocationCode: "HIC001",
      vaccinationCountry: "SG"
    },
    {
      vaccineCode: "3339641000133109",
      vaccineName: "PFIZER-BIONTECH COVID-19 Vaccine [Tozinameran] Injection",
      vaccineLot: "Lot97531",
      vaccinationDateTime: "2021-03-03",
      vaccinationLocationCode: "HIC002",
      vaccinationCountry: "SG"
    }
  ],
  effectiveDate: "2021-03-17"
};

describe("genEuDcc() invalid", () => {
  it("Invalid Expiry Record", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => genEuDcc({...basicDetails, expiryDaysOrDate: "test" as any}, singlePCRTestingRecord)).toThrowError(
      `Invalid expiryDaysOrDate (test) received. Should be number of days or specific date object.`
    );
  });
});

describe("genEuDcc() [Single record]", () => {
  it("TestingPCRRecord", () => {
    const singlePCRTestingRecordResult = genEuDcc(basicDetails, singlePCRTestingRecord);
    expect(singlePCRTestingRecordResult).toStrictEqual(notarisePdtPcrSingleRecord);
  });

  it("TestingARTRecord", () => {
    const singleARTTestingRecordResult = genEuDcc(basicDetails, singleARTTestingRecord);
    expect(singleARTTestingRecordResult).toStrictEqual(notarisePdtArtSingleRecord);
  });
  it("VaccinationRecords", () => {
    const singleVaccinationRecord = genEuDcc(basicDetails, vaccinationRecord);
    expect(singleVaccinationRecord).toStrictEqual(notariseVacSingleRecord);
  });
});

describe("genEuDcc() [Multi record]", () => {
  it("TestingRecord", () => {
    const multiTestingRecordResult = genEuDcc({ ...basicDetails, expiryDaysOrDate: 7}, multiTestingRecord);
    expect(multiTestingRecordResult).toStrictEqual(notarisePdtMultiRecord);
  });
});
