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
});
