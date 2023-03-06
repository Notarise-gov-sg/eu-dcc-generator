"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genPatientDetails = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
const util_1 = require("../util");
dayjs_1.default.locale("en-sg");
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(customParseFormat_1.default);
/**
 * Helper function to generate Patient details.
 * @param patientDetails
 * @returns
 */
const genPatientDetails = ({ name, familyName, firstName, dateOfBirth, meta }) => {
    const euNam = {
        fnt: (0, util_1.convertStandardizationName)(name)
    };
    // If family name is provide, it will be mapped to Surname and Standardized Surname in EU Healthcert.
    if (familyName) {
        euNam.fn = familyName;
        euNam.fnt = (0, util_1.convertStandardizationName)(familyName);
    }
    // If first name is provide, it will be mapped to Surname and Standardized Surname in EU Healthcert.
    if (firstName) {
        euNam.gn = firstName;
        euNam.gnt = (0, util_1.convertStandardizationName)(firstName);
    }
    const validateDateOfBirth = dateOfBirth.split('T')[0]; // take only date value if ISO-8601 format
    if (!(0, dayjs_1.default)(validateDateOfBirth, ["YYYY", "YYYY-MM", "YYYY-MM-DD"], true).isValid()) {
        throw new Error(`Invalid dateOfBirth (${dateOfBirth}). Should be YYYY-MM-DD or YYYY-MM or YYYY or ISO-8601 format`);
    }
    const dob = (0, dayjs_1.default)(dateOfBirth, ["YYYY", "YYYY-MM", "YYYY-MM-DD"], true).isValid()
        ? dateOfBirth
        : dayjs_1.default.utc(dateOfBirth).format("YYYY-MM-DD");
    return {
        nam: euNam,
        dob,
        meta
    };
};
exports.genPatientDetails = genPatientDetails;
