import { genVaccinationRecord } from "./vac";
import { VaccinationRecord } from "../types";

describe("genVaccinationRecord()", () => {
  it("should produce valid VaccinationRecord", () => {
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
    expect(() => genVaccinationRecord(validVaccinationRecord, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).not.toThrowError();
    expect(genVaccinationRecord(validVaccinationRecord, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toStrictEqual([{"doseNumber": 1, "euVaccineRecord": {"ci": "URN:UVCI:01:SG:1ABC-ADV-CDE", "co": "SG", "dn": 1, "dt": "2021-02-14", "is": "MOH", "ma": "ORG-100030215", "mp": "EU/1/20/1528", "sd": 2, "tg": "840539006", "vp": "1119349007"}, "expiryDateTime": "2023-02-22T00:00:00.000Z", "vaccineCode": "3339641000133109"}, {"doseNumber": 2, "euVaccineRecord": {"ci": "URN:UVCI:01:SG:2ABC-ADV-CDE", "co": "SG", "dn": 2, "dt": "2021-03-03", "is": "MOH", "ma": "ORG-100030215", "mp": "EU/1/20/1528", "sd": 2, "tg": "840539006", "vp": "1119349007"}, "expiryDateTime": "2023-02-22T00:00:00.000Z", "vaccineCode": "3339641000133109"}]);
  });
  it("should produce valid VaccinationRecord without effectiveDate", () => {
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
    expect(() => genVaccinationRecord(validVaccinationRecord, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).not.toThrowError();
    expect(genVaccinationRecord(validVaccinationRecord, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toStrictEqual([{"doseNumber": 1, "euVaccineRecord": {"ci": "URN:UVCI:01:SG:1ABC-ADV-CDE", "co": "SG", "dn": 1, "dt": "2021-02-14", "is": "MOH", "ma": "ORG-100030215", "mp": "EU/1/20/1528", "sd": 2, "tg": "840539006", "vp": "1119349007"}, "expiryDateTime": "2023-02-22T00:00:00.000Z", "vaccineCode": "3339641000133109"}, {"doseNumber": 2, "euVaccineRecord": {"ci": "URN:UVCI:01:SG:2ABC-ADV-CDE", "co": "SG", "dn": 2, "dt": "2021-03-03", "is": "MOH", "ma": "ORG-100030215", "mp": "EU/1/20/1528", "sd": 2, "tg": "840539006", "vp": "1119349007"}, "expiryDateTime": "2023-02-22T00:00:00.000Z", "vaccineCode": "3339641000133109"}]);
  });
  it("should produce valid VaccinationRecord with primary series of multiple doses", () => {
    const validVaccinationRecord: VaccinationRecord = {
      vaccinations: [
        {
          vaccineCode: "3440141000133104",
          vaccineName: "CORONAVAC COVID-19 Vaccine (SINOVAC) [SARS-CoV-2 Virus (inactivated, CZ02 strain)] Injection",
          vaccineLot: "12345",
          vaccinationLocationCode: "9405111",
          vaccinationDateTime: "2021-04-24",
          vaccinationCountry: "SG"
        },
        {
          vaccineCode: "3440141000133104",
          vaccineName: "CORONAVAC COVID-19 Vaccine (SINOVAC) [SARS-CoV-2 Virus (inactivated, CZ02 strain)] Injection",
          vaccineLot: "12345",
          vaccinationLocationCode: "9405111",
          vaccinationDateTime: "2021-05-24",
          vaccinationCountry: "SG"
        },
        {
          vaccineCode: "3339641000133109",
          vaccineName: "PFIZER-BIONTECH/COMIRNATY COVID-19 Vaccine [Tozinameran] Injection",
          vaccineLot: "12345",
          vaccinationLocationCode: "9405111",
          vaccinationDateTime: "2021-05-30",
          vaccinationCountry: "SG"
        },
        {
          vaccineCode: "3339641000133109",
          vaccineName: "PFIZER-BIONTECH/COMIRNATY COVID-19 Vaccine [Tozinameran] Injection",
          vaccineLot: "12345",
          vaccinationLocationCode: "9405111",
          vaccinationDateTime: "2021-06-30",
          vaccinationCountry: "SG"
        }
      ],
      effectiveDate: "2021-07-14"
    };
    expect(() => genVaccinationRecord(validVaccinationRecord, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).not.toThrowError();
    expect(genVaccinationRecord(validVaccinationRecord, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toStrictEqual([
      {
          "doseNumber": 1,
          "euVaccineRecord": {
              "ci": "URN:UVCI:01:SG:1ABC-ADV-CDE",
              "co": "SG",
              "dn": 1,
              "dt": "2021-04-24",
              "is": "MOH",
              "ma": "Sinovac-Biotech",
              "mp": "CoronaVac",
              "sd": 4,
              "tg": "840539006",
              "vp": "J07BX03"
          },
          "expiryDateTime": "2023-02-22T00:00:00.000Z",
          "vaccineCode": "3440141000133104"
      },
      {
          "doseNumber": 2,
          "euVaccineRecord": {
              "ci": "URN:UVCI:01:SG:2ABC-ADV-CDE",
              "co": "SG",
              "dn": 2,
              "dt": "2021-05-24",
              "is": "MOH",
              "ma": "Sinovac-Biotech",
              "mp": "CoronaVac",
              "sd": 4,
              "tg": "840539006",
              "vp": "J07BX03"
          },
          "expiryDateTime": "2023-02-22T00:00:00.000Z",
          "vaccineCode": "3440141000133104"
      },
      {
          "doseNumber": 3,
          "euVaccineRecord": {
              "ci": "URN:UVCI:01:SG:3ABC-ADV-CDE",
              "co": "SG",
              "dn": 3,
              "dt": "2021-05-30",
              "is": "MOH",
              "ma": "ORG-100030215",
              "mp": "EU/1/20/1528",
              "sd": 4,
              "tg": "840539006",
              "vp": "1119349007"
          },
          "expiryDateTime": "2023-02-22T00:00:00.000Z",
          "vaccineCode": "3339641000133109"
      },
      {
          "doseNumber": 4,
          "euVaccineRecord": {
              "ci": "URN:UVCI:01:SG:4ABC-ADV-CDE",
              "co": "SG",
              "dn": 4,
              "dt": "2021-06-30",
              "is": "MOH",
              "ma": "ORG-100030215",
              "mp": "EU/1/20/1528",
              "sd": 4,
              "tg": "840539006",
              "vp": "1119349007"
          },
          "expiryDateTime": "2023-02-22T00:00:00.000Z",
          "vaccineCode": "3339641000133109"
      }
    ]);
  });
  it("should produce valid VaccinationRecord with primary series + booster multiple doses", () => {
    const validVaccinationRecord: VaccinationRecord = {
      effectiveDate: "2021-06-13",
      vaccinations: [
        {
          vaccineCode: "3440141000133104",
          vaccineName: "CORONAVAC COVID-19 Vaccine (SINOVAC) [SARS-CoV-2 Virus (inactivated, CZ02 strain)] Injection",
          vaccineLot: "12345",
          vaccinationLocationCode: "9405111",
          vaccinationDateTime: "2021-04-24",
          vaccinationCountry: "SG"
        },
        {
          vaccineCode: "3440141000133104",
          vaccineName: "CORONAVAC COVID-19 Vaccine (SINOVAC) [SARS-CoV-2 Virus (inactivated, CZ02 strain)] Injection",
          vaccineLot: "12345",
          vaccinationLocationCode: "9405111",
          vaccinationDateTime: "2021-05-24",
          vaccinationCountry: "SG"
        },
        {
          vaccineCode: "3339641000133109",
          vaccineName: "PFIZER-BIONTECH/COMIRNATY COVID-19 Vaccine [Tozinameran] Injection",
          vaccineLot: "12345",
          vaccinationLocationCode: "9405111",
          vaccinationDateTime: "2021-05-30",
          vaccinationCountry: "SG"
        },
        {
          vaccineCode: "3339641000133109",
          vaccineName: "PFIZER-BIONTECH/COMIRNATY COVID-19 Vaccine [Tozinameran] Injection",
          vaccineLot: "12345",
          vaccinationLocationCode: "9405111",
          vaccinationDateTime: "2021-11-03",
          vaccinationCountry: "SG"
        }
      ],
    };
    expect(() => genVaccinationRecord(validVaccinationRecord, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).not.toThrowError();
    expect(genVaccinationRecord(validVaccinationRecord, "2023-02-22T00:00:00.000Z", "MOH", "abc-adv-cde")).toStrictEqual([
      {
          "doseNumber": 1,
          "euVaccineRecord": {
              "ci": "URN:UVCI:01:SG:1ABC-ADV-CDE",
              "co": "SG",
              "dn": 1,
              "dt": "2021-04-24",
              "is": "MOH",
              "ma": "Sinovac-Biotech",
              "mp": "CoronaVac",
              "sd": 3,
              "tg": "840539006",
              "vp": "J07BX03"
          },
          "expiryDateTime": "2023-02-22T00:00:00.000Z",
          "vaccineCode": "3440141000133104"
      },
      {
          "doseNumber": 2,
          "euVaccineRecord": {
              "ci": "URN:UVCI:01:SG:2ABC-ADV-CDE",
              "co": "SG",
              "dn": 2,
              "dt": "2021-05-24",
              "is": "MOH",
              "ma": "Sinovac-Biotech",
              "mp": "CoronaVac",
              "sd": 3,
              "tg": "840539006",
              "vp": "J07BX03"
          },
          "expiryDateTime": "2023-02-22T00:00:00.000Z",
          "vaccineCode": "3440141000133104"
      },
      {
          "doseNumber": 3,
          "euVaccineRecord": {
              "ci": "URN:UVCI:01:SG:3ABC-ADV-CDE",
              "co": "SG",
              "dn": 3,
              "dt": "2021-05-30",
              "is": "MOH",
              "ma": "ORG-100030215",
              "mp": "EU/1/20/1528",
              "sd": 3,
              "tg": "840539006",
              "vp": "1119349007"
          },
          "expiryDateTime": "2023-02-22T00:00:00.000Z",
          "vaccineCode": "3339641000133109"
      },
      {
          "doseNumber": 4,
          "euVaccineRecord": {
              "ci": "URN:UVCI:01:SG:4ABC-ADV-CDE",
              "co": "SG",
              "dn": 4,
              "dt": "2021-11-03",
              "is": "MOH",
              "ma": "ORG-100030215",
              "mp": "EU/1/20/1528",
              "sd": 4,
              "tg": "840539006",
              "vp": "1119349007"
          },
          "expiryDateTime": "2023-02-22T00:00:00.000Z",
          "vaccineCode": "3339641000133109"
      }
    ]);
  });
});
