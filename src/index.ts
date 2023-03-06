import { signAndPack } from "@dchocoboo/dcc-sdk";
import { VacTemplate,  PdtTemplate, RecTemplate, VacCertificate, PdtCertificate, RecCertificate} from "./types";
import { genEuDcc } from "./models/eu-dcc-generator";

const APPLE_URL_PREFIX = `https://redirect.health.apple.com/EU-DCC/#`;

/* 
  Implement this function for set specific expiry datetime. 
  `makeCWT` function in `@dchocoboo/dcc-sdk` package only support to set expiry month.   
*/
const makeCWT = (payload: VacCertificate | PdtCertificate | RecCertificate, expiryDateTime: string, issuerName: string) => {
  const CWT_ISSUER = 1;
  const CWT_EXPIRATION = 4;
  const CWT_ISSUED_AT = 6;
  const CWT_HCERT = -260;
  const CWT_HCERT_V1 = 1;

  const cwt = new Map();
  const iss = new Date();
  cwt.set(CWT_ISSUED_AT, Math.round(iss.getTime() / 1000));
  cwt.set(CWT_EXPIRATION, Math.round((new Date(expiryDateTime)).getTime() / 1000));
  cwt.set(CWT_ISSUER, issuerName);
  cwt.set(CWT_HCERT, new Map());
  cwt.get(CWT_HCERT).set(CWT_HCERT_V1, payload);
  return cwt;
};

const signPayload = async (euHealthCerts: VacTemplate[] | PdtTemplate[] | RecTemplate[], publicKeyPem: string, privateKeyP8: string, issuerName: string) => {
  const publicKey = publicKeyPem.replace(/\\n/g, "\n");
  const privateKey = privateKeyP8.replace(/\\n/g, "\n");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const euHealthCertsQr:any[] = [];
  await Promise.all(
    euHealthCerts.map(async (euHealthCert) => {
      const qrData = await signAndPack(
        makeCWT(euHealthCert.certificate, euHealthCert.expiryDateTime, issuerName),
        publicKey,
        privateKey
      );
      euHealthCertsQr.push({ ...euHealthCert, qr: qrData, appleCovidCardUrl: APPLE_URL_PREFIX + encodeURIComponent(qrData.slice(4)) });
    })
  );
  return euHealthCertsQr;
}

export default (publicKeyPem: string, privateKeyP8: string, issuerName: string) => {
  return {
    genEuDcc,
    signPayload: (euHealthCerts: VacTemplate[] | PdtTemplate[] | RecTemplate[]) => {
      return signPayload(euHealthCerts, publicKeyPem, privateKeyP8, issuerName);
    },
  };
};

export * from "./types";
