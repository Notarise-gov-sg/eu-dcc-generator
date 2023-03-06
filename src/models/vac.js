"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genVaccinationRecord = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
const date_fns_1 = require("date-fns");
const sddInformations = __importStar(require("../static/SDD.mapping.json"));
dayjs_1.default.locale("en-sg");
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(customParseFormat_1.default);
/**
 * Helper function to generate Eu Vaccination records.
 * @param vaccinationRecord
 * @returns
 */
const genVaccinationRecord = (vaccinationRecord, expiryDateTime, issuerName, reference) => {
    const validatedVaccinationRecords = (vaccinationRecord.vaccinations).map((vaccination) => {
        const validateVaccinationDateTime = vaccination.vaccinationDateTime.split('T')[0]; // take only date value if ISO-8601 format
        if (!(0, dayjs_1.default)(validateVaccinationDateTime, ["YYYY-MM-DD"], true).isValid()) {
            throw new Error(`Invalid vaccinationDateTime (${vaccination.vaccinationDateTime}). Should be YYYY-MM-DD format`);
        }
        vaccination.vaccinationDateTime = validateVaccinationDateTime;
        return vaccination;
    });
    /* assign primary series of vaccination records by filtering `vaccinationDateTime` is before `effectiveDate` or without `effectiveDate` */
    const primaryVaccinations = (validatedVaccinationRecords).filter((vaccination) => vaccinationRecord.effectiveDate ? (0, date_fns_1.isBefore)((0, date_fns_1.parseISO)(vaccination.vaccinationDateTime), (0, date_fns_1.parseISO)(vaccinationRecord.effectiveDate)) : true);
    /* set`isBooster` flag as `true` in vaccination records when `vaccinationDateTime` is after CMB `effectiveDate` */
    const euVaccinations = (validatedVaccinationRecords).map((vaccination) => {
        vaccination.isBooster = vaccinationRecord.effectiveDate ? (0, date_fns_1.isAfter)((0, date_fns_1.parseISO)(vaccination.vaccinationDateTime), (0, date_fns_1.parseISO)(vaccinationRecord.effectiveDate)) : false;
        return vaccination;
    });
    let incrementDoseNumber = 0;
    return euVaccinations.map((vaccination) => {
        incrementDoseNumber += 1;
        // Set increment dose number + reference
        const uniqueRef = `${incrementDoseNumber}${reference.toUpperCase()}`;
        // Set Unique Cert Id with prefix + version + country + unique ref
        const UniqueCertificateId = `URN:UVCI:01:SG:${uniqueRef}`;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sddInfo = sddInformations[vaccination.vaccineCode];
        return {
            euVaccineRecord: {
                tg: sddInfo.disease_agent_targeted_code,
                vp: sddInfo.vaccine_prophylaxis_code,
                mp: sddInfo.vaccine_medicinal_product_code,
                ma: sddInfo.authorization_holder_code,
                dn: incrementDoseNumber,
                /*
                  If current vaccination record is a booster, will set the total dose number as same `incrementDoseNumber`.
                    e.g. 1/3, 2/3, 3/3, 4/4 for S,P,P,M[with booster]
                  Else, will set the total dose number as total primary series count.
                    e.g. 1/3, 2/3, 3/3 for S,P,P[without booster]
                */
                sd: vaccination.isBooster === true ? incrementDoseNumber : primaryVaccinations.length,
                dt: vaccination.vaccinationDateTime,
                co: vaccination.vaccinationCountry,
                is: issuerName,
                ci: UniqueCertificateId
            },
            vaccineCode: vaccination.vaccineCode,
            doseNumber: incrementDoseNumber,
            expiryDateTime
        };
    });
};
exports.genVaccinationRecord = genVaccinationRecord;
