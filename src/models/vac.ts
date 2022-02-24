import { parseISO, isBefore, isAfter } from 'date-fns'
import { Vaccination, VaccinationRecord, VaccineRecord } from "../types";
import * as sddInformations from "../static/SDD.mapping.json";

/**
 * Helper function to generate Eu Vaccination records.
 * @param vaccinationRecord
 * @returns
 */
export const genVaccinationRecord = (vaccinationRecord: VaccinationRecord, expiryDateTime: string, issuerName: string, reference: string): VaccineRecord[] => {

  /* assign primary series of vaccination records by filtering `vaccinationDateTime` is before `effectiveDate` */
  const primaryVaccinations: Vaccination[] = (vaccinationRecord.vaccinations).filter((vaccination) =>
    isBefore(parseISO(vaccination.vaccinationDateTime), parseISO(vaccinationRecord.effectiveDate))
  );

  /* set`isBooster` flag in vaccination records when `vaccinationDateTime` is after CMB `effectiveDate` */
  const euVaccinations: Vaccination[] = (vaccinationRecord.vaccinations).map((vaccination) => {
    vaccination.isBooster = isAfter(parseISO(vaccination.vaccinationDateTime), parseISO(vaccinationRecord.effectiveDate));
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
