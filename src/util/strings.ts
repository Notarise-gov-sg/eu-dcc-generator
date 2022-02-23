export const convertStandardizationName = (name: string): string => {
    // replace special characters(expect alphabet) with space
    let standardizationName = name.toUpperCase().replace(/[^A-Z]+/g, " ");

    // remove multiple spaces
    standardizationName = standardizationName.replace(/\s+/g, " ").trim();

    // replace space with `<` for standardization Name of EU health cert
    standardizationName = standardizationName.replace(/[^A-Z]/g, "<");

    return standardizationName;
};
