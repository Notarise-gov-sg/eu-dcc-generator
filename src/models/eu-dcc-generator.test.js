"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mockdate_1 = __importDefault(require("mockdate"));
const eu_dcc_generator_1 = require("./eu-dcc-generator");
const pdt_art_single_record_json_1 = __importDefault(require("../../fixtures/notarise-examples/pdt-art-single-record.json"));
const pdt_pcr_single_record_json_1 = __importDefault(require("../../fixtures/notarise-examples/pdt-pcr-single-record.json"));
const vac_single_record_json_1 = __importDefault(require("../../fixtures/notarise-examples/vac-single-record.json"));
const pdt_multi_record_json_1 = __importDefault(require("../../fixtures/notarise-examples/pdt-multi-record.json"));
beforeEach(() => {
    mockdate_1.default.set(new Date("2022-01-01T00:00:00.000+00:00"));
});
afterEach(() => {
    mockdate_1.default.reset();
});
const patientDetails = {
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
const basicDetails = {
    patientDetails,
    reference: "abc-cde-cde",
    issuerName: "MOH",
    expiryDaysOrDate: 365
};
const singlePCRTestingRecord = [
    {
        testTypeCode: "94531-1",
        naatTestName: "SARS-CoV-2 (COVID-19) RNA [Presence] in Specimen by NAA with probe detection",
        collectionDateTime: "2020-09-27T06:15:00Z",
        testResultCode: "260385009",
        testCenter: "MacRitchie Medical Clinic",
        testCountry: "SG"
    }
];
const singleARTTestingRecord = [
    {
        testTypeCode: "97097-0",
        ratTestDeviceCode: "1833",
        collectionDateTime: "2020-09-27T06:15:00Z",
        testResultCode: "260385009",
        testCenter: "MacRitchie Medical Clinic",
        testCountry: "SG"
    }
];
const multiTestingRecord = [
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
describe("genEuDcc() invalid", () => {
    it("Invalid Expiry Record", () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(() => (0, eu_dcc_generator_1.genEuDcc)({ ...basicDetails, expiryDaysOrDate: "test" }, singlePCRTestingRecord)).toThrowError(`Invalid expiryDaysOrDate (test) received. Should be number of days or specific date object.`);
    });
});
describe("genEuDcc() [Single record]", () => {
    it("TestingPCRRecord", () => {
        const singlePCRTestingRecordResult = (0, eu_dcc_generator_1.genEuDcc)(basicDetails, singlePCRTestingRecord);
        expect(singlePCRTestingRecordResult).toStrictEqual(pdt_pcr_single_record_json_1.default);
    });
    it("TestingARTRecord", () => {
        const singleARTTestingRecordResult = (0, eu_dcc_generator_1.genEuDcc)(basicDetails, singleARTTestingRecord);
        expect(singleARTTestingRecordResult).toStrictEqual(pdt_art_single_record_json_1.default);
    });
    it("VaccinationRecords", () => {
        const singleVaccinationRecord = (0, eu_dcc_generator_1.genEuDcc)(basicDetails, vaccinationRecord);
        expect(singleVaccinationRecord).toStrictEqual(vac_single_record_json_1.default);
    });
});
describe("genEuDcc() [Multi record]", () => {
    it("TestingRecord", () => {
        const multiTestingRecordResult = (0, eu_dcc_generator_1.genEuDcc)({ ...basicDetails, expiryDaysOrDate: 7 }, multiTestingRecord);
        expect(multiTestingRecordResult).toStrictEqual(pdt_multi_record_json_1.default);
    });
});
