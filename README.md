[![Known Vulnerabilities](https://snyk.io//test/github/notarise-gov-sg/eu-dcc-generator/badge.svg?targetFile=package.json)](https://snyk.io//test/github/notarise-gov-sg/eu-dcc-generator?targetFile=package.json)
[![GitHub issues](https://img.shields.io/github/issues/notarise-gov-sg/eu-dcc-generator)](https://github.com/notarise-gov-sg/eu-dcc-generator/issues)
[![License](https://img.shields.io/github/license/notarise-gov-sg/eu-dcc-generator)](https://github.com/Notarise-gov-sg/eu-dcc-generator/blob/master/LICENSE)

# Generate EU Digital Covid Certificates

A helper library for for generate EU Digital Covid Certificates.

## Getting Started

```bash
npm i @notarise-gov-sg/eu-dcc-generator
```

### 1. Import

```javascript
import EuDccGenerator from "@notarise-gov-sg/eu-dcc-generator";
const euDccGenerator = EuDccGenerator(privateKey, publicKey, issuerName);
```

### 2. Prepare records

```javascript
// Patient Details
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

// Basic Details
const basicDetails: BasicDetails = {
  patientDetails,
  reference: "abc-cde-cde",
  issuerName: "MOH",
  expiryDays: 365
};

// Notarise PDT (PCR Testing Record)
const singlePCRTestingRecord: TestingRecord[] = [
  {
    testTypeCode: "94531-1",
    naatTestName: "SARS-CoV-2 (COVID-19) RNA panel - Respiratory specimen by NAA with probe detection",
    collectionDateTime: "2020-09-27T06:15:00Z",
    testResultCode: "260385009",
    testCenter: "MacRitchie Medical Clinic",
    testCountry: "SG"
  }
];

// Notarise PDT (ART Testing Record)
const singleARTTestingRecord: TestingRecord[] = [
  {
    testTypeCode: "97097-0",
    ratTestDeviceCode: "1833",
    collectionDateTime: "2020-09-27T06:15:00Z",
    testResultCode: "260385009",
    testCenter: "MacRitchie Medical Clinic",
    testCountry: "SG"
  }
];

// Notarise Vaccination (Vaccination Record)
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
```

### 3. Generate Json and sign the payload

- Generate for Vaccination Record

```javascript
const payloadJson = euDccGenerator.genEuDcc(basicDetails, vaccinationRecord);
const signedPayload = euDccGenerator.signPayload(payloadJsonpayload);

// signedPayload response data
[
  {
    certificate: {...}
    vaccineCode: '3339641000133109',
    doseNumber: 1,
    expiryDateTime: '2023-02-23T01:00:01.098Z',
    qr: 'HC1:.....'
  },
  {
    certificate: {...}
    vaccineCode: '3339641000133109',
    doseNumber: 2,
    expiryDateTime: '2023-02-23T01:00:01.098Z',
    qr: 'HC1:.....'
  }
]
```

- Generate for Test Record

```javascript
const payloadJson = euDccGenerator.genEuDcc(basicDetails, [testingRecord]);
const signedPayload = euDccGenerator.signPayload(payloadJsonpayload);

// signedPayload response data
[
  {
    certificate: {...}
    type: 'PCR',
    expiryDateTime: '2023-02-23T01:00:01.098Z',
    qr: 'HC1:.....'
  }
]
```
