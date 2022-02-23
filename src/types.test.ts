import { isTestingRecordArray, isVaccinationRecord, TestingRecord, VaccinationRecord } from "./types";

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

describe("types", () => {
  it("should pass TestingRecord[] type check", () => {
    expect(isTestingRecordArray(singleTestingRecord)).toBe(true);
  });

  it("should fail TestingRecord[] type check", () => {
    expect(isTestingRecordArray([{ ...singleTestingRecord[0], collectionDateTime: undefined }])).toBe(false);
    expect(isTestingRecordArray([{ ...singleTestingRecord[0], foo: "bar" }])).toBe(false);
  });

  it("should pass VaccinationRecord[] type check", () => {
    expect(isVaccinationRecord(vaccinationRecord)).toBe(true);
  });

  it("should fail VaccinationRecord[] type check", () => {
    expect(isTestingRecordArray([{ ...vaccinationRecord[0], effectiveDate: undefined }])).toBe(false);
    expect(isTestingRecordArray([{ ...vaccinationRecord[0], foo: "bar" }])).toBe(false);
  });
});
