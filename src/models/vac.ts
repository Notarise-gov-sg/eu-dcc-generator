import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { parseISO, isBefore, isAfter } from 'date-fns';
import { Vaccination, VaccinationRecord, VaccineRecord } from "../types";
import * as sddInformations from "../static/SDD.mapping.json";

dayjs.locale("en-sg");
dayjs.extend(utc);
dayjs.extend(customParseFormat);

/**
 * Helper function to generate Eu Vaccination records.
 * @param vaccinationRecord
 * @returns
 */
export const genVaccinationRecord = (vaccinationRecord: VaccinationRecord, expiryDateTime: string, issuerName: string, reference: string): VaccineRecord[] => {
  const validatedVaccinationRecords = (vaccinationRecord.vaccinations).map((vaccination) => {
    const validateVaccinationDateTime = vaccination.vaccinationDateTime.split('T')[0]; // take only date value if ISO-8601 format
    if (
      !dayjs(
        validateVaccinationDateTime,
        ["YYYY-MM-DD"],
        true
      ).isValid()
    ) {
      throw new Error(
        `Invalid vaccinationDateTime (${vaccination.vaccinationDateTime}). Should be YYYY-MM-DD format`
      );
    }
    vaccination.vaccinationDateTime = validateVaccinationDateTime;
    return vaccination;
  });

  /* assign primary series of vaccination records by filtering `vaccinationDateTime` is before `effectiveDate` or without `effectiveDate` */
  const primaryVaccinations: Vaccination[] = (validatedVaccinationRecords).filter((vaccination) =>
    vaccinationRecord.effectiveDate? isBefore(parseISO(vaccination.vaccinationDateTime), parseISO(vaccinationRecord.effectiveDate)): true
  );

  /* set`isBooster` flag as `true` in vaccination records when `vaccinationDateTime` is after CMB `effectiveDate` */
  const euVaccinations: Vaccination[] = (validatedVaccinationRecords).map((vaccination) => {
    vaccination.isBooster = vaccinationRecord.effectiveDate? isAfter(parseISO(vaccination.vaccinationDateTime), parseISO(vaccinationRecord.effectiveDate)): false;
    return vaccination;
  });

  let incrementDoseNumber = 0;
  return euVaccinations.map((vaccination): VaccineRecord => {
    incrementDoseNumber += 1;
    // Set increment dose number + reference
    const uniqueRef = `${incrementDoseNumber}${reference.toUpperCase()}`;
    // Set Unique Cert Id with prefix + version + country + unique ref
    const UniqueCertificateId = `URN:UVCI:01:SG:${uniqueRef}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sddInfo = (sddInformations as any)[vaccination.vaccineCode];
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
    }
  });
};
