import { genVaccinationRecord } from "./vac";
import { VaccinationRecord } from "../types";

const validVaccinationRecord: VaccinationRecord = {
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

describe("genVaccinationRecord()", () => {
  it("should produce valid VaccinationRecord", () => {
    expect(() => genVaccinationRecord(validVaccinationRecord, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).not.toThrowError();
    expect(genVaccinationRecord(validVaccinationRecord, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toStrictEqual([{"doseNumber": 1, "euVaccineRecord": {"ci": "URN:UVCI:01:SG:1ABC-ADV-CDE", "co": "SG", "dn": 1, "dt": "2021-02-14", "is": "MOH", "ma": "ORG-100030215", "mp": "EU/1/20/1528", "sd": 2, "tg": "840539006", "vp": "1119349007"}, "expiryDateTime": "2023-02-22T00:00:00.000Z", "vaccineCode": "3339641000133109"}, {"doseNumber": 2, "euVaccineRecord": {"ci": "URN:UVCI:01:SG:2ABC-ADV-CDE", "co": "SG", "dn": 2, "dt": "2021-03-03", "is": "MOH", "ma": "ORG-100030215", "mp": "EU/1/20/1528", "sd": 2, "tg": "840539006", "vp": "1119349007"}, "expiryDateTime": "2023-02-22T00:00:00.000Z", "vaccineCode": "3339641000133109"}]);
  });
});
