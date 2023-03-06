"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rec_1 = require("./rec");
const validRecoveryRecord = [
    {
        firstPositiveTestDate: "2022-01-01T00:00:00.000Z",
        testValidFrom: "2022-01-08T00:00:00.000Z",
        testValidUntil: "2022-06-30T00:00:00.000Z",
        testCountry: "SG"
    }
];
describe("genRecoveryRecord()", () => {
    it("should produce valid RecoveryRecord", () => {
        expect(() => (0, rec_1.genRecoveryRecord)(validRecoveryRecord, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).not.toThrowError();
        expect((0, rec_1.genRecoveryRecord)(validRecoveryRecord, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toStrictEqual([
            {
                euRecRecord: {
                    ci: "URN:UVCI:01:SG:1ABC-ADV-CDE",
                    co: "SG",
                    is: "MOH",
                    tg: "840539006",
                    fr: "2022-01-01",
                    df: "2022-01-08",
                    du: "2022-06-30",
                },
                expiryDateTime: "2023-02-22T00:00:00.000Z"
            }
        ]);
    });
    it("should throw error if RecoveryRecord have invalid firstPositiveTestDate format", () => {
        const invalid = [{
                ...validRecoveryRecord[0],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                firstPositiveTestDate: "12 Feb 2015" // Invalid firstPositiveTestDate
            }];
        expect(() => (0, rec_1.genRecoveryRecord)(invalid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toThrowError(`Invalid firstPositiveTestDate (12 Feb 2015). Should be YYYY-MM-DD format`);
    });
    it("should throw error if RecoveryRecord have invalid testValidFrom format", () => {
        const invalid = [{
                ...validRecoveryRecord[0],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                testValidFrom: "12 Feb 2015" // Invalid testValidFrom
            }];
        expect(() => (0, rec_1.genRecoveryRecord)(invalid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toThrowError(`Invalid testValidFrom (12 Feb 2015). Should be YYYY-MM-DD format`);
    });
    it("should throw error if RecoveryRecord have invalid testValidUntil format", () => {
        const invalid = [{
                ...validRecoveryRecord[0],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                testValidUntil: "12 Feb 2015" // Invalid testValidUntil
            }];
        expect(() => (0, rec_1.genRecoveryRecord)(invalid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toThrowError(`Invalid testValidUntil (12 Feb 2015). Should be YYYY-MM-DD format`);
    });
});
