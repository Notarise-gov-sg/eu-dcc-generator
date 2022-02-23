import { genTestingRecord } from "./pdt";
import { TestingRecord } from "../types";

const validTestingRecord: TestingRecord[] = [
  {
    testTypeCode: "258500001",
    naatTestName: "SARS-CoV-2 (COVID-19) RNA panel - Respiratory specimen by NAA with probe detection",
    collectionDateTime: "2020-09-27T06:15:00Z",
    testResultCode: "260385009",
    testCenter: "MacRitchie Medical Clinic",
    testCountry: "SG"
  }
];

describe("genTestingRecord()", () => {
  it("should produce valid TestingRecord PCR for Negative record", () => {
    const valid: TestingRecord[] = [{
      ...validTestingRecord[0],
      testResultCode: "260385009", // The correct Negative code
    }];

    expect(() => genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).not.toThrowError();
    expect(genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toStrictEqual([
      {
        euTestRecord: {
            ci: "URN:UVCI:01:SG:1ABC-ADV-CDE",
            co: "SG",
            is: "MOH",
            sc: "2020-09-27T06:15:00Z",
            tc: "MacRitchie Medical Clinic",
            tg: "840539006",
            tr: "260415000", // The correct "Not detected" code
            tt: "LP6464-4",
        },
        expiryDateTime: "2023-02-22T00:00:00.000Z",
        type: "PCR",
      }
    ]);
  });

  it("should produce valid TestingRecord PCR for Negative record using EU DCC Test Result Code", () => {
    const valid: TestingRecord[] = [{
      ...validTestingRecord[0],
      testResultCode: "260415000", // The correct "Not detected" code
    }];

    expect(() => genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).not.toThrowError();
    expect(genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toStrictEqual([
      {
        euTestRecord: {
            ci: "URN:UVCI:01:SG:1ABC-ADV-CDE",
            co: "SG",
            is: "MOH",
            sc: "2020-09-27T06:15:00Z",
            tc: "MacRitchie Medical Clinic",
            tg: "840539006",
            tr: "260415000", // The correct "Not detected" code
            tt: "LP6464-4",
        },
        expiryDateTime: "2023-02-22T00:00:00.000Z",
        type: "PCR",
      }
    ]);
  });

  it("should produce valid TestingRecord PCR for Positive record", () => {
    const valid: TestingRecord[] = [{
      ...validTestingRecord[0],
      testResultCode: "10828004", // The correct Positive code
    }];

    expect(() => genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).not.toThrowError();
    expect(genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toStrictEqual([
      {
        euTestRecord: {
            ci: "URN:UVCI:01:SG:1ABC-ADV-CDE",
            co: "SG",
            is: "MOH",
            sc: "2020-09-27T06:15:00Z",
            tc: "MacRitchie Medical Clinic",
            tg: "840539006",
            tr: "260373001", // The correct "Detected" code
            tt: "LP6464-4",
        },
        expiryDateTime: "2023-02-22T00:00:00.000Z",
        type: "PCR",
      }
    ]);
  });

  it("should produce valid TestingRecord PCR for Positive record using EU DCC Test Result Code", () => {
    const valid: TestingRecord[] = [{
      ...validTestingRecord[0],
      testResultCode: "260373001", // The correct "Detected" code
    }];

    expect(() => genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).not.toThrowError();
    expect(genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toStrictEqual([
      {
        euTestRecord: {
            ci: "URN:UVCI:01:SG:1ABC-ADV-CDE",
            co: "SG",
            is: "MOH",
            sc: "2020-09-27T06:15:00Z",
            tc: "MacRitchie Medical Clinic",
            tg: "840539006",
            tr: "260373001", // The correct "Detected" code
            tt: "LP6464-4",
        },
        expiryDateTime: "2023-02-22T00:00:00.000Z",
        type: "PCR",
      }
    ]);
  });

  it("should produce valid TestingRecord for PCR Saliva record", () => {
    const valid: TestingRecord[] = [{
      ...validTestingRecord[0],
      testTypeCode: "119342007", // The correct PCR Saliva
    }];

    expect(() => genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).not.toThrowError();
    expect(genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toStrictEqual([
      {
        euTestRecord: {
            ci: "URN:UVCI:01:SG:1ABC-ADV-CDE",
            co: "SG",
            is: "MOH",
            sc: "2020-09-27T06:15:00Z",
            tc: "MacRitchie Medical Clinic",
            tg: "840539006",
            tr: "260415000", // The correct "Not detected" code
            tt: "LP6464-4",
        },
        expiryDateTime: "2023-02-22T00:00:00.000Z",
        type: "PCR",
      }
    ]);
  });

  it("should produce valid TestingRecord for ART record", () => {
    const valid: TestingRecord[] = [{
      ...validTestingRecord[0],
      testTypeCode: "697989009", // The correct ART [snomed]
    }];

    expect(() => genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).not.toThrowError();
    expect(genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toStrictEqual([
      {
        euTestRecord: {
            ci: "URN:UVCI:01:SG:1ABC-ADV-CDE",
            co: "SG",
            is: "MOH",
            sc: "2020-09-27T06:15:00Z",
            tc: "MacRitchie Medical Clinic",
            tg: "840539006",
            tr: "260415000", // The correct "Not detected" code
            tt: "LP217198-3",
        },
        expiryDateTime: "2023-02-22T00:00:00.000Z",
        type: "ART",
      }
    ]);
  });

  it("should throw error there is an invalid testResultCode", () => {
    const invalid: TestingRecord[] = [{
      ...validTestingRecord[0],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      testResultCode: "123456" as any // Invalid test code
    }];

    expect(() => genTestingRecord(invalid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toThrowError(
      `Invalid testResultCode (123456) received. Should be one of these values: ["260385009","10828004","260415000","260373001"]`
    );
  });

  it("should throw error there is an invalid testTypeCode", () => {
    const invalid: TestingRecord[] = [{
      ...validTestingRecord[0],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      testTypeCode: "123456" as any // Invalid test type code
    }];

    expect(() => genTestingRecord(invalid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toThrowError(
      `Invalid testTypeCode (123456) received. Should be one of these values: ["697989009","258500001","119342007","LP6464-4","LP217198-3"]`
    );
  });
});
