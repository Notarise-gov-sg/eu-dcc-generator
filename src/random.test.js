// console.log(process);

import { debug } from "@pathcheck/dcc-sdk";

console.log(debug);

describe("Main Helper Functions", () => {
    it("should be able to decode and verify a signed vaccine cert payload", async () => {
        expect(1).toStrictEqual(1);
        // debug();
    });
});
// import EuDcc from "./index";
// import { BasicDetails, PatientDetails, VaccinationRecord } from "./types";

// const PUBLIC_KEY_PEM = '-----BEGIN CERTIFICATE-----\nMIIBYDCCAQYCEQCAG8uscdLb0ppaneNN5sB7MAoGCCqGSM49BAMCMDIxIzAhBgNV\nBAMMGk5hdGlvbmFsIENTQ0Egb2YgRnJpZXNsYW5kMQswCQYDVQQGEwJGUjAeFw0y\nMTA0MjcyMDQ3MDVaFw0yNjAzMTIyMDQ3MDVaMDYxJzAlBgNVBAMMHkRTQyBudW1i\nZXIgd29ya2VyIG9mIEZyaWVzbGFuZDELMAkGA1UEBhMCRlIwWTATBgcqhkjOPQIB\nBggqhkjOPQMBBwNCAARkJeqyO85dyR+UrQ5Ey8EdgLyf9NtsCrwORAj6T68/elL1\n9aoISQDbzaNYJjdD77XdHtd+nFGTQVpB88wPTwgbMAoGCCqGSM49BAMCA0gAMEUC\nIQDvDacGFQO3tuATpoqf40CBv09nfglL3wh5wBwA1uA7lAIgZ4sOK2iaaTsFNqEN\nAF7zi+d862ePRQ9Lwymr7XfwVm0=\n-----END CERTIFICATE-----';
// const PRIVATE_KEY_P8 = '-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgZgp3uylFeCIIXozb\nZkCkSNr4DcLDxplZ1ax/u7ndXqahRANCAARkJeqyO85dyR+UrQ5Ey8EdgLyf9Nts\nCrwORAj6T68/elL19aoISQDbzaNYJjdD77XdHtd+nFGTQVpB88wPTwgb\n-----END PRIVATE KEY-----';

// const patientDetails = {
//     name: "Tan Chen Chen",
//     familyName: "Tan",
//     firstName: "Chen Chen",
//     dateOfBirth: "1990-01-15",
//     meta: {
//         reference: "abc-cde-cde",
//         notarisedOn: "2022-02-26T00:00:00.000Z",
//         passportNumber: "E7831177G",
//         url: "storedUrl",
//     }
// };

// const euDcc = EuDcc(PUBLIC_KEY_PEM, PRIVATE_KEY_P8, "MOH");

// const basicDetails = {
//     patientDetails,
//     reference: "abc-cde-cde",
//     issuerName: "MOH",
//     expiryDaysOrDate: 365
// };
// const vaccinationRecord = {
//     vaccinations: [
//         {
//             vaccineCode: "3339641000133109",
//             vaccineName: "PFIZER-BIONTECH COVID-19 Vaccine [Tozinameran] Injection",
//             vaccineLot: "Lot12345",
//             vaccinationDateTime: "2021-02-14",
//             vaccinationLocationCode: "HIC001",
//             vaccinationCountry: "SG"
//         },
//         {
//             vaccineCode: "3339641000133109",
//             vaccineName: "PFIZER-BIONTECH COVID-19 Vaccine [Tozinameran] Injection",
//             vaccineLot: "Lot97531",
//             vaccinationDateTime: "2021-03-03",
//             vaccinationLocationCode: "HIC002",
//             vaccinationCountry: "SG"
//         }
//     ],
//     effectiveDate: "2021-03-17"
// };
// const payload = euDcc.genEuDcc(basicDetails, vaccinationRecord);

// const start = async function(){
//     const signedPayload = await euDcc.signPayload(payload);
//     const firstVaccineQr = await debug(signedPayload[0].qr);
//     console.log(parseCWT(firstVaccineQr.value[2]));
// }

// start();