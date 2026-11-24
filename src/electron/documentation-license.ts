import {OFFICIAL_PACKS,type InstalledDocumentPack} from '../shared/documentation.ts';

/** Only known redistributable/open documentation license families can enter the AI textbook pipeline. */
const permitted=/(?:^|\b)(?:PSF(?:\s+License)?|MIT|Apache-2\.0|BSD(?:\s*3-Clause)?|CC\s*BY(?:-SA)?(?:\s*[234]\.0)?|GPL-2\.0|GFDL)(?:\b|$)/i;
const forbidden=/persönlich|interne?\s+verwendung|all\s+rights\s+reserved|proprietary|copyright\s+reserved|kein(?:e)?\s+weitergabe|je\s+seite\s+beachten|dateibezogene\s+ausnahmen\s+prüfen/i;
export type CourseLicense={name:string;url:string;sourceUrl:string;recognized:boolean};
export function assertFreeDocumentationLicense(pack:InstalledDocumentPack):CourseLicense{
 const definition=OFFICIAL_PACKS.find(item=>item.id===pack.id);
 if(!definition||pack.sourceUrl!==definition.sourceUrl||pack.license!==definition.license)
  throw Error('Quellenherkunft oder Lizenzmetadaten nicht verifiziert.');
 const name=pack.license.trim();
 const url=pack.licenseUrl.trim();
 const sourceUrl=pack.sourceUrl.trim();
 if(!name||forbidden.test(name)||!permitted.test(name)||
  !/^https:\/\/[^\s]+$/i.test(url)||!/^https:\/\/[^\s]+$/i.test(sourceUrl))
  throw Error('Dieses Dokumentationspaket ist nicht für die automatische KI-Lehrbuchverarbeitung freigegeben. Bitte Nutzungsrechte prüfen: '+pack.title);
 return {name,url,sourceUrl,recognized:true};
}
