import { BasicDetails, PatientDetails, TestingRecord, VaccinationRecord } from "../types";
import { genEuDcc } from "./eu-dcc-generator";

import notarisePdtSingleRecord from "../../fixtures/notarise-examples/pdt-single-record.json";
import notariseVacSingleRecord from "../../fixtures/notarise-examples/vac-single-record.json";
import notarisePdtMultiRecord from "../../fixtures/notarise-examples/pdt-multi-record.json";

let dateSpy: jest.SpyInstance;
beforeEach(() => {
  const targetDate = new Date(1677039719000);
  dateSpy = jest.spyOn(global, "Date").mockImplementation(() => targetDate);
});
afterEach(() => {
  dateSpy.mockRestore();
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
  expiryDays: 365
};

const singleTestingRecord: TestingRecord[] = [
  {
    testTypeCode: "258500001",
    naatTestName: "SARS-CoV-2 (COVID-19) RNA panel - Respiratory specimen by NAA with probe detection",
    collectionDateTime: "2020-09-27T06:15:00Z",
    testResultCode: "260385009",
    testCenter: "MacRitchie Medical Clinic",
    testCountry: "SG"
  }
];

const multiTestingRecord: TestingRecord[] =   [
  {
    testTypeCode: "258500001",
    naatTestName: "SARS-CoV-2 (COVID-19) RNA panel - Respiratory specimen by NAA with probe detection",
    collectionDateTime: "2020-09-27T06:15:00Z",
    testResultCode: "260385009",
    testCenter: "MacRitchie Medical Clinic",
    testCountry: "SG"
  },
  {
    testTypeCode: "258500001",
    naatTestName: "SARS-CoV-2 (COVID-19) RNA panel - Respiratory specimen by NAA with probe detection",
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

describe("genEuDcc() [Single record]", () => {
  it("TestingRecord", () => {
    const singleTestingRecordResult = genEuDcc(basicDetails, singleTestingRecord);
    expect(singleTestingRecordResult).toStrictEqual(notarisePdtSingleRecord);
  });

  it("VaccinationRecords", () => {
    const singleVaccinationRecord = genEuDcc(basicDetails, vaccinationRecord);
    expect(singleVaccinationRecord).toStrictEqual(notariseVacSingleRecord);
  });
});

describe("genEuDcc() [Multi record]", () => {
  it("TestingRecord", () => {
    const multiTestingRecordResult = genEuDcc({ ...basicDetails, expiryDays: 7}, multiTestingRecord);
    expect(multiTestingRecordResult).toStrictEqual(notarisePdtMultiRecord);
  });
});
