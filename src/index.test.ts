import { parseCWT, debug } from "@pathcheck/dcc-sdk";
import EuDcc from "./index";
import { BasicDetails, PatientDetails, RecoveryRecord, TestingRecord, VaccinationRecord } from "./types";

const PUBLIC_KEY_PEM = '-----BEGIN CERTIFICATE-----\nMIIBYDCCAQYCEQCAG8uscdLb0ppaneNN5sB7MAoGCCqGSM49BAMCMDIxIzAhBgNV\nBAMMGk5hdGlvbmFsIENTQ0Egb2YgRnJpZXNsYW5kMQswCQYDVQQGEwJGUjAeFw0y\nMTA0MjcyMDQ3MDVaFw0yNjAzMTIyMDQ3MDVaMDYxJzAlBgNVBAMMHkRTQyBudW1i\nZXIgd29ya2VyIG9mIEZyaWVzbGFuZDELMAkGA1UEBhMCRlIwWTATBgcqhkjOPQIB\nBggqhkjOPQMBBwNCAARkJeqyO85dyR+UrQ5Ey8EdgLyf9NtsCrwORAj6T68/elL1\n9aoISQDbzaNYJjdD77XdHtd+nFGTQVpB88wPTwgbMAoGCCqGSM49BAMCA0gAMEUC\nIQDvDacGFQO3tuATpoqf40CBv09nfglL3wh5wBwA1uA7lAIgZ4sOK2iaaTsFNqEN\nAF7zi+d862ePRQ9Lwymr7XfwVm0=\n-----END CERTIFICATE-----';
const PRIVATE_KEY_P8 = '-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgZgp3uylFeCIIXozb\nZkCkSNr4DcLDxplZ1ax/u7ndXqahRANCAARkJeqyO85dyR+UrQ5Ey8EdgLyf9Nts\nCrwORAj6T68/elL19aoISQDbzaNYJjdD77XdHtd+nFGTQVpB88wPTwgb\n-----END PRIVATE KEY-----';

const patientDetails: PatientDetails = {
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

const euDcc = EuDcc(PUBLIC_KEY_PEM, PRIVATE_KEY_P8, "MOH");

describe("Main Helper Functions", () => {
  it("should be able to decode and verify a signed vaccine cert payload", async () => {
    const basicDetails: BasicDetails = {
      patientDetails,
      reference: "abc-cde-cde",
      issuerName: "MOH",
      expiryDaysOrDate: 365
    };
    const vaccinationRecord: VaccinationRecord = {
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
    const payload = euDcc.genEuDcc(basicDetails, vaccinationRecord);
    const signedPayload = await euDcc.signPayload(payload);
    const firstVaccineQr = await debug(signedPayload[0].qr);
    expect(await parseCWT(firstVaccineQr.value[2])).toStrictEqual({
      meta: {
        notarisedOn: "2022-02-26T00:00:00.000Z",
        passportNumber: "E7831177G",
        reference: "abc-cde-cde",
        url: "storedUrl",
      },
      v: [
        {
          ci: 'URN:UVCI:01:SG:1ABC-CDE-CDE',
          co: 'SG',
          dn: 1,
          dt: "2021-02-14",
          is: "MOH",
          ma: "ORG-100030215",
          mp: "EU/1/20/1528",
          sd: 2,
          tg: '840539006',
          vp: '1119349007'
        }
      ],
      dob: '1990-01-15',
      nam: { fn: "Tan", fnt: "TAN", gn: "Chen Chen", gnt: "CHEN<CHEN" },
      ver: '1.3.0'
    });
    expect(signedPayload[0].appleCovidCardUrl).toMatch(/https:\/\/redirect.health.apple.com\/EU-DCC\/#/);

    const secondVaccineQr = await debug(signedPayload[1].qr);
    expect(await parseCWT(secondVaccineQr.value[2])).toStrictEqual({
      meta: {
        notarisedOn: "2022-02-26T00:00:00.000Z",
        passportNumber: "E7831177G",
        reference: "abc-cde-cde",
        url: "storedUrl",
      },
      v: [
        {
          ci: 'URN:UVCI:01:SG:2ABC-CDE-CDE',
          co: 'SG',
          dn: 2,
          dt: "2021-03-03",
          is: "MOH",
          ma: "ORG-100030215",
          mp: "EU/1/20/1528",
          sd: 2,
          tg: '840539006',
          vp: '1119349007'
        }
      ],
      dob: '1990-01-15',
      nam: { fn: "Tan", fnt: "TAN", gn: "Chen Chen", gnt: "CHEN<CHEN" },
      ver: '1.3.0'
    });
    expect(signedPayload[1].appleCovidCardUrl).toMatch(/https:\/\/redirect.health.apple.com\/EU-DCC\/#/);
  });
  it("should be able to decode and verify a signed test cert payload", async () => {
    const basicDetails: BasicDetails = {
      patientDetails,
      reference: "abc-cde-cde",
      issuerName: "MOH",
      expiryDaysOrDate: 7
    };
    const singleTestingRecord: TestingRecord[] = [
      {
        testTypeCode: "94531-1",
        naatTestName: "SARS-CoV-2 (COVID-19) RNA [Presence] in Specimen by NAA with probe detection",
        collectionDateTime: "2020-09-27T06:15:00Z",
        testResultCode: "260385009",
        testCenter: "MacRitchie Medical Clinic",
        testCountry: "SG"
      }
    ];
    const payload = euDcc.genEuDcc(basicDetails, singleTestingRecord);
    const signedPayload = await euDcc.signPayload(payload);
    const testQr = await debug(signedPayload[0].qr);
    expect(await parseCWT(testQr.value[2])).toStrictEqual({
      meta: {
        notarisedOn: "2022-02-26T00:00:00.000Z",
        passportNumber: "E7831177G",
        reference: "abc-cde-cde",
        url: "storedUrl",
      },
      t: [
        {
          ci: 'URN:UVCI:01:SG:1ABC-CDE-CDE',
          co: 'SG',
          nm: "SARS-CoV-2 (COVID-19) RNA [Presence] in Specimen by NAA with probe detection",
          sc: "2020-09-27T06:15:00Z",
          tc: "MacRitchie Medical Clinic",
          is: "MOH",
          tr: "260415000",
          tt: "LP6464-4",
          tg: '840539006'
        }
      ],
      dob: '1990-01-15',
      nam: { fn: "Tan", fnt: "TAN", gn: "Chen Chen", gnt: "CHEN<CHEN" },
      ver: '1.3.0'
    });
    expect(signedPayload[0].appleCovidCardUrl).toMatch(/https:\/\/redirect.health.apple.com\/EU-DCC\/#/);
  });
  it("should be able to decode and verify a signed recovery cert with expiry date payload", async () => {
    const basicDetails: BasicDetails = {
      patientDetails,
      reference: "abc-cde-cde",
      issuerName: "MOH",
      expiryDaysOrDate: new Date(Date.UTC(2022, 5, 30))
    };
    const singleRecoveryRecord: RecoveryRecord[] = [
      {
        firstPositiveTestDate: "2022-01-01T00:00:00.000Z",
        testValidFrom: "2022-01-08T00:00:00.000Z",
        testValidUntil: "2022-06-30T00:00:00.000Z",
        testCountry: "SG"
      }
    ];
    const payload = euDcc.genEuDcc(basicDetails, singleRecoveryRecord);
    const signedPayload = await euDcc.signPayload(payload);
    expect(signedPayload[0].expiryDateTime).toStrictEqual("2022-06-30T00:00:00.000Z");
    const testQr = await debug(signedPayload[0].qr);
    expect(await parseCWT(testQr.value[2])).toStrictEqual({
      meta: {
        notarisedOn: "2022-02-26T00:00:00.000Z",
        passportNumber: "E7831177G",
        reference: "abc-cde-cde",
        url: "storedUrl",
      },
      r: [
        {
          ci: 'URN:UVCI:01:SG:1ABC-CDE-CDE',
          co: 'SG',
          df : "2022-01-08T00:00:00.000Z",
          du : "2022-06-30T00:00:00.000Z",
          fr : "2022-01-01T00:00:00.000Z",
          is: "MOH",
          tg: '840539006'
        }
      ],
      dob: '1990-01-15',
      nam: { fn: "Tan", fnt: "TAN", gn: "Chen Chen", gnt: "CHEN<CHEN" },
      ver: '1.3.0'
    });
    expect(signedPayload[0].appleCovidCardUrl).toMatch(/https:\/\/redirect.health.apple.com\/EU-DCC\/#/);
  });
});
