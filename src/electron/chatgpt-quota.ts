/** Stable user-facing handling of Subscription Sharing quota errors. No estimated reset time. */
export const SUBSCRIPTION_SHARING_LIMIT_MESSAGE=
 'Das Kontingent für ChatGPT-Anfragen aus verbundenen Apps ist aufgebraucht. '+
 'Checkmate hat die Lehrbuchgenerierung angehalten. Bereits geprüfte Kapitel bleiben als lokale Checkpoints erhalten. '+
 'Starte die Generierung erneut, sobald dein Kontingent wieder verfügbar ist. '+
 'Der Zeitpunkt der Freigabe ist Checkmate nicht bekannt; ein API-Key ist dafür nicht erforderlich.';
export function isSubscriptionSharingLimit(code:unknown,message:unknown,status?:number):boolean{
 const parts=[code,message].filter((v):v is string=>typeof v==='string').join(' ').toLowerCase();
 if(!parts)return false;
 return /subscription[ _-]*sharing/.test(parts)&&/(?:usage[ _-]*limit|limit[ _-]*reached|quota|exhaust|resource_exhausted)/.test(parts)||
  (status===429&&/subscription.*sharing/.test(parts));
}
export function mapChatGPTQuotaError(code:unknown,message:unknown,status?:number):string|null{
 return isSubscriptionSharingLimit(code,message,status)?SUBSCRIPTION_SHARING_LIMIT_MESSAGE:null;
}
