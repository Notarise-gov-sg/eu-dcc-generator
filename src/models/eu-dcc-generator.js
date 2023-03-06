"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genEuDcc = void 0;
const types_1 = require("../types");
const types_2 = require("../types");
const patient_1 = require("./patient");
const pdt_1 = require("./pdt");
const rec_1 = require("./rec");
const vac_1 = require("./vac");
function genEuDcc(basicDetails, record) {
    const { reference, issuerName, expiryDaysOrDate, patientDetails } = basicDetails;
    if (typeof expiryDaysOrDate !== "number" && expiryDaysOrDate instanceof Date !== true) {
        throw new Error(`Invalid expiryDaysOrDate (${expiryDaysOrDate}) received. Should be number of days or specific date object.`);
    }
    const { nam, dob, meta } = (0, patient_1.genPatientDetails)(patientDetails);
    let expiryDateTime = new Date();
    if (expiryDaysOrDate instanceof Date) {
        expiryDateTime = expiryDaysOrDate;
    }
    else {
        expiryDateTime.setDate(expiryDateTime.getDate() + expiryDaysOrDate);
    }
    const baseTemplate = {
        ver: "1.3.0",
        nam,
        dob,
        meta
    };
    if ((0, types_2.isVaccinationRecord)(record)) {
        const vaccinationRecords = (0, vac_1.genVaccinationRecord)(record, expiryDateTime.toISOString(), issuerName, reference);
        const final = vaccinationRecords.map((vaccination) => {
            return {
                certificate: {
                    ...baseTemplate,
                    v: [vaccination.euVaccineRecord]
                },
                vaccineCode: vaccination.vaccineCode,
                doseNumber: vaccination.doseNumber,
                expiryDateTime: vaccination.expiryDateTime
            };
        });
        return final;
    }
    else if ((0, types_2.isTestingRecordArray)(record)) {
        const testingRecords = (0, pdt_1.genTestingRecord)(record, expiryDateTime.toISOString(), issuerName, reference);
        const final = testingRecords.map((testing) => {
            return {
                certificate: {
                    ...baseTemplate,
                    t: [testing.euTestRecord]
                },
                type: testing.type,
                expiryDateTime: testing.expiryDateTime
            };
        });
        return final;
    }
    else if ((0, types_1.isRecoveryRecordArray)(record)) {
        const recoveryRecords = (0, rec_1.genRecoveryRecord)(record, expiryDateTime.toISOString(), issuerName, reference);
        const final = recoveryRecords.map((recovery) => {
            return {
                certificate: {
                    ...baseTemplate,
                    r: [recovery.euRecRecord]
                },
                expiryDateTime: recovery.expiryDateTime
            };
        });
        return final;
    }
    else {
        throw new Error("Please provide a valid testingRecord or vaccinationRecord or recoveryRecord.");
    }
}
exports.genEuDcc = genEuDcc;
