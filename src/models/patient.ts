import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import { PatientDetails, EuNamRecord } from "../types";
import { convertStandardizationName } from "../util";

dayjs.locale("en-sg");
dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Singapore");

/**
 * Helper function to generate Patient details.
 * @param patientDetails
 * @returns
 */
export const genPatientDetails = ({
  name,
  familyName,
  firstName,
  dateOfBirth,
  meta
}: PatientDetails) => {

  const euNam: EuNamRecord = {
    fnt: convertStandardizationName(name)
  };
  // If family name is provide, it will be mapped to Surname and Standardized Surname in EU Healthcert.
  if (familyName) {
    euNam.fn = familyName;
    euNam.fnt = convertStandardizationName(familyName);
  }
  // If first name is provide, it will be mapped to Surname and Standardized Surname in EU Healthcert.
  if (firstName) {
    euNam.gn = firstName;
    euNam.gnt = convertStandardizationName(firstName);
  }

  if (
    !dayjs(
      dateOfBirth,
      ["YYYY", "YYYY-MM", "YYYY-MM-DD", "YYYY-MM-DDTHH:mm:ss.SSS[Z]"],
      true
    ).isValid() ||
    !dayjs(dateOfBirth).isValid()
  ) {
    throw new Error(
      `Invalid dateOfBirth (${dateOfBirth}). Should be YYYY-MM-DD or YYYY-MM or YYYY or ISO-8601 format`
    );
  }

  const dob = dayjs(dateOfBirth, ["YYYY", "YYYY-MM", "YYYY-MM-DD"], true).isValid()
  ? dateOfBirth
  : dayjs(dateOfBirth).format("YYYY-MM-DD");

  return {
    nam: euNam,
    dob,
    meta
  };
};
