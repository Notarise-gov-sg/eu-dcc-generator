import { genTestingRecord } from "./pdt";
import { TestingRecord } from "../types";

const validPCRTestingRecord: TestingRecord[] = [
  {
    testTypeCode: "94531-1",
    naatTestName: "SARS-CoV-2 (COVID-19) RNA [Presence] in Specimen by NAA with probe detection",
    collectionDateTime: "2020-09-27T06:15:00Z",
    testResultCode: "260385009",
    testCenter: "MacRitchie Medical Clinic",
    testCountry: "SG"
  }
];

const validARTTestingRecord: TestingRecord[] = [
  {
    testTypeCode: "97097-0",
    ratTestDeviceCode: "1833",
    collectionDateTime: "2020-09-27T06:15:00Z",
    testResultCode: "260385009",
    testCenter: "MacRitchie Medical Clinic",
    testCountry: "SG"
  }
];

describe("genTestingRecord()", () => {
  it("should produce valid TestingRecord PCR for long test name", () => {
    const valid: TestingRecord[] = [{
      ...validPCRTestingRecord[0],
      naatTestName: "SARS-CoV-2 (COVID-19) RNA panel - Respiratory specimen by NAA with probe detection", // long test name more than 80 chars
    }];

    expect(() => genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).not.toThrowError();
    expect(genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toStrictEqual([
      {
        euTestRecord: {
            ci: "URN:UVCI:01:SG:1ABC-ADV-CDE",
            co: "SG",
            is: "MOH",
            nm: "SARS-CoV-2 (COVID-19) RNA panel - Respiratory specimen by NAA with probe detecti", // cut off only 80 chars
            sc: "2020-09-27T06:15:00Z",
            tc: "MacRitchie Medical Clinic",
            tg: "840539006",
            tr: "260415000",
            tt: "LP6464-4",
        },
        expiryDateTime: "2023-02-22T00:00:00.000Z",
        type: "PCR",
      }
    ]);
  });

  it("should produce valid TestingRecord PCR for Negative record", () => {
    const valid: TestingRecord[] = [{
      ...validPCRTestingRecord[0],
      testResultCode: "260385009", // The correct Negative code
    }];

    expect(() => genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).not.toThrowError();
    expect(genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toStrictEqual([
      {
        euTestRecord: {
            ci: "URN:UVCI:01:SG:1ABC-ADV-CDE",
            co: "SG",
            is: "MOH",
            nm: "SARS-CoV-2 (COVID-19) RNA [Presence] in Specimen by NAA with probe detection",
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

  it("should produce valid TestingRecord PCR for Negative record using Recommended Test Type Code", () => {
    const valid: TestingRecord[] = [{
      ...validPCRTestingRecord[0],
      testTypeCode: "94309-2", // Recommended code
    }];

    expect(() => genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).not.toThrowError();
    expect(genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toStrictEqual([
      {
        euTestRecord: {
            ci: "URN:UVCI:01:SG:1ABC-ADV-CDE",
            co: "SG",
            is: "MOH",
            nm: "SARS-CoV-2 (COVID-19) RNA [Presence] in Specimen by NAA with probe detection",
            sc: "2020-09-27T06:15:00Z",
            tc: "MacRitchie Medical Clinic",
            tg: "840539006",
            tr: "260415000",
            tt: "LP6464-4", // The correct "NAAT" code
        },
        expiryDateTime: "2023-02-22T00:00:00.000Z",
        type: "PCR",
      }
    ]);
  });

  it("should produce valid TestingRecord PCR for Negative record using EU DCC Test Result Code", () => {
    const valid: TestingRecord[] = [{
      ...validPCRTestingRecord[0],
      testResultCode: "260415000", // The correct "Not detected" code
    }];

    expect(() => genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).not.toThrowError();
    expect(genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toStrictEqual([
      {
        euTestRecord: {
            ci: "URN:UVCI:01:SG:1ABC-ADV-CDE",
            co: "SG",
            is: "MOH",
            nm: "SARS-CoV-2 (COVID-19) RNA [Presence] in Specimen by NAA with probe detection",
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
      ...validPCRTestingRecord[0],
      testResultCode: "10828004", // The correct Positive code
    }];

    expect(() => genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).not.toThrowError();
    expect(genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toStrictEqual([
      {
        euTestRecord: {
            ci: "URN:UVCI:01:SG:1ABC-ADV-CDE",
            co: "SG",
            is: "MOH",
            nm: "SARS-CoV-2 (COVID-19) RNA [Presence] in Specimen by NAA with probe detection",
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
      ...validPCRTestingRecord[0],
      testResultCode: "260373001", // The correct "Detected" code
    }];

    expect(() => genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).not.toThrowError();
    expect(genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toStrictEqual([
      {
        euTestRecord: {
            ci: "URN:UVCI:01:SG:1ABC-ADV-CDE",
            co: "SG",
            is: "MOH",
            nm: "SARS-CoV-2 (COVID-19) RNA [Presence] in Specimen by NAA with probe detection",
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

  it("should produce valid TestingRecord for ART record", () => {
    const valid: TestingRecord[] = [validARTTestingRecord[0]];
    expect(() => genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).not.toThrowError();
    expect(genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toStrictEqual([
      {
        euTestRecord: {
            ci: "URN:UVCI:01:SG:1ABC-ADV-CDE",
            co: "SG",
            is: "MOH",
            ma: "1833",
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

  it("should produce valid TestingRecord for ART record with iso test collection date", () => {
    const valid: TestingRecord[] = [{
      ...validARTTestingRecord[0],
      collectionDateTime: "2020-09-27" // valid iso test collection date
    }];
    expect(() => genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).not.toThrowError();
    expect(genTestingRecord(valid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toStrictEqual([
      {
        euTestRecord: {
            ci: "URN:UVCI:01:SG:1ABC-ADV-CDE",
            co: "SG",
            is: "MOH",
            ma: "1833",
            sc: "2020-09-27T00:00:00Z",
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
      ...validPCRTestingRecord[0],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      testResultCode: "123456" as any // Invalid test code
    }];

    expect(() => genTestingRecord(invalid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toThrowError(
      `Invalid testResultCode (123456) received. Should be one of these values: ["260385009","10828004","260415000","260373001"]`
    );
  });

  it("should throw error there is an invalid testTypeCode", () => {
    const invalid: TestingRecord[] = [{
      ...validPCRTestingRecord[0],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      testTypeCode: "123456" as any // Invalid test type code
    }];

    expect(() => genTestingRecord(invalid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toThrowError(
      `Invalid testTypeCode (123456) received. Should be one of these values: ["97097-0","94531-1","94309-2","LP6464-4","LP217198-3"]`
    );
  });

  it("should throw error if TestingRecords have invalid collectionDateTime format", () => {
    const invalid: TestingRecord[] = [{
      ...validPCRTestingRecord[0],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collectionDateTime: "12 Feb 2015" as any // Invalid collectionDateTime
    }];
    expect(() => genTestingRecord(invalid, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toThrowError(
      `Invalid collectionDateTime (12 Feb 2015). Should be ISO-8601 date and time format`
    );
  });
});
