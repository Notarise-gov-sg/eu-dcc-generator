"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertStandardizationName = void 0;
const convertStandardizationName = (name) => {
    // replace special characters(expect alphabet) with space
    let standardizationName = name.toUpperCase().replace(/[^A-Z]+/g, " ");
    // remove multiple spaces
    standardizationName = standardizationName.replace(/\s+/g, " ").trim();
    // replace space with `<` for standardization Name of EU health cert
    standardizationName = standardizationName.replace(/[^A-Z]/g, "<");
    return standardizationName;
};
exports.convertStandardizationName = convertStandardizationName;
