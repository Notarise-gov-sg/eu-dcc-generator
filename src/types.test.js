"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const singleTestingPCRRecord = [
    {
        testTypeCode: "258500001",
        naatTestName: "SARS-CoV-2 (COVID-19) RNA [Presence] in Specimen by NAA with probe detection",
        collectionDateTime: "2020-09-27T06:15:00Z",
        testResultCode: "260385009",
        testCenter: "MacRitchie Medical Clinic",
        testCountry: "SG"
    }
];
const singleTestingARTRecord = [
    {
        testTypeCode: "697989009",
        ratTestDeviceCode: "1833",
        collectionDateTime: "2020-09-27T06:15:00Z",
        testResultCode: "260385009",
        testCenter: "MacRitchie Medical Clinic",
        testCountry: "SG"
    }
];
const vaccinationRecord = {
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
    it("should pass PCR TestingRecord[] type check", () => {
        expect((0, types_1.isTestingRecordArray)(singleTestingPCRRecord)).toBe(true);
    });
    it("should fail PCR TestingRecord[] type check", () => {
        expect((0, types_1.isTestingRecordArray)([{ ...singleTestingPCRRecord[0], collectionDateTime: undefined }])).toBe(false);
        expect((0, types_1.isTestingRecordArray)([{ ...singleTestingPCRRecord[0], foo: "bar" }])).toBe(false);
        expect((0, types_1.isTestingRecordArray)(singleTestingPCRRecord[0])).toBe(false);
    });
    it("should pass ART TestingRecord[] type check", () => {
        expect((0, types_1.isTestingRecordArray)(singleTestingARTRecord)).toBe(true);
    });
    it("should fail ART TestingRecord[] type check", () => {
        expect((0, types_1.isTestingRecordArray)([{ ...singleTestingARTRecord[0], collectionDateTime: undefined }])).toBe(false);
        expect((0, types_1.isTestingRecordArray)([{ ...singleTestingARTRecord[0], foo: "bar" }])).toBe(false);
    });
    it("should pass VaccinationRecord[] type check", () => {
        expect((0, types_1.isVaccinationRecord)(vaccinationRecord)).toBe(true);
        expect((0, types_1.isVaccinationRecord)({ ...vaccinationRecord, effectiveDate: undefined })).toBe(true);
    });
    it("should fail VaccinationRecord[] type check", () => {
        expect((0, types_1.isVaccinationRecord)([{ ...vaccinationRecord, foo: "bar" }])).toBe(false);
    });
});
