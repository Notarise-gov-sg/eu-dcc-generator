import { genPatientDetails } from "./patient";
import { PatientDetails } from "../types";

const validPatientDetails: PatientDetails = {
  name: "Tan Chen Chen",
  familyName: "Tan",
  firstName: "Chen Chen",
  dateOfBirth: "1990-01-15",
  meta: {
    reference: "abc-cde-cde",
    notarisedOn: "2022-02-26T00:00:00.000Z",
    passportNumber: "E7831177G",
    url: "storedUrl",
  },
};

describe("genPatientDetails()", () => {
  it("should produce valid PatientDetails", () => {
    expect(() => genPatientDetails(validPatientDetails)).not.toThrowError();
    expect(genPatientDetails(validPatientDetails)).toStrictEqual({
      "dob": validPatientDetails.dateOfBirth,
      "meta": validPatientDetails.meta,
      "nam": {
        "fn": "Tan",
        "fnt": "TAN",
        "gn": "Chen Chen",
        "gnt": "CHEN<CHEN",
      },
    });
  });

  it("should produce valid PatientDetails without firstname & familyname", () => {
    const valid: PatientDetails = { ...validPatientDetails, familyName: undefined, firstName: undefined };

    expect(() => genPatientDetails(valid)).not.toThrowError();
    expect(genPatientDetails(valid)).toMatchInlineSnapshot(`
    Object {
      "dob": "1990-01-15",
      "meta": Object {
        "notarisedOn": "2022-02-26T00:00:00.000Z",
        "passportNumber": "E7831177G",
        "reference": "abc-cde-cde",
        "url": "storedUrl",
      },
      "nam": Object {
        "fnt": "TAN<CHEN<CHEN",
      },
    }
    `);
  });

  it("should throw error if PatientDetails have invalid dob format", () => {
    const invalid: PatientDetails = { ...validPatientDetails, dateOfBirth: "12 Feb 2015" };
    expect(() => genPatientDetails(invalid)).toThrowError(
      `Invalid dateOfBirth (12 Feb 2015). Should be YYYY-MM-DD or YYYY-MM or YYYY or ISO-8601 format`
    );
  });

  it("should produce valid PatientDetails with ISO 8601 dob", () => {
    const valid: PatientDetails = { ...validPatientDetails, dateOfBirth: "2022-05-12T16:00:00.000Z" };
    expect(() => genPatientDetails(valid)).not.toThrowError();
    expect(genPatientDetails(valid)).toStrictEqual({
      "dob": "2022-05-12",
      "meta": valid.meta,
      "nam": {
        "fn": "Tan",
        "fnt": "TAN",
        "gn": "Chen Chen",
        "gnt": "CHEN<CHEN",
      },
    });
  });

  it("should produce valid PatientDetails with YYYY-MM dob", () => {
    const valid: PatientDetails = { ...validPatientDetails, dateOfBirth: "1990-01" };
    expect(() => genPatientDetails(valid)).not.toThrowError();
    expect(genPatientDetails(valid)).toStrictEqual({
      "dob": "1990-01",
      "meta": valid.meta,
      "nam": {
        "fn": "Tan",
        "fnt": "TAN",
        "gn": "Chen Chen",
        "gnt": "CHEN<CHEN",
      },
    });
  });
});
