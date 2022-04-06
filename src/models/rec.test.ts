import { genRecoveryRecord } from "./rec";
import { RecoveryRecord } from "../types";

const validRecoveryRecord: RecoveryRecord[] = [
  {
    firstPositiveTestDate: "2022-01-01T00:00:00.000Z",
    testValidFrom: "2022-01-08T00:00:00.000Z",
    testValidUntil: "2022-06-30T00:00:00.000Z",
    testCountry: "SG"
  }
];

describe("genRecoveryRecord()", () => {
  it("should produce valid RecoveryRecord", () => {
    expect(() => genRecoveryRecord(validRecoveryRecord, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).not.toThrowError();
    expect(genRecoveryRecord(validRecoveryRecord, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toStrictEqual([
      {
        euRecRecord: {
            ci: "URN:UVCI:01:SG:1ABC-ADV-CDE",
            co: "SG",
            is: "MOH",
            tg: "840539006",
            fr: "2022-01-01T00:00:00.000Z",
            df: "2022-01-08T00:00:00.000Z",
            du: "2022-06-30T00:00:00.000Z",
        },
        expiryDateTime: "2023-02-22T00:00:00.000Z"
      }
    ]);
  });
});
