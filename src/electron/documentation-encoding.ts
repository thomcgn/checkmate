/** Read genuine documentation text while preserving the original source bytes for integrity checks. */
export function decodeDocumentationText(data:Uint8Array):string{
 if(data.length===0)return '';
 // BOMs identify Unicode reliably, including UTF-16 documentation exports.
 if(data.length>=2&&data[0]===0xff&&data[1]===0xfe)
  return new TextDecoder('utf-16le',{fatal:true}).decode(data);
 if(data.length>=2&&data[0]===0xfe&&data[1]===0xff)
  return new TextDecoder('utf-16be',{fatal:true}).decode(data);
 if(data.length>=3&&data[0]===0xef&&data[1]===0xbb&&data[2]===0xbf)
  return new TextDecoder('utf-8',{fatal:true}).decode(data);
 // A file with raw NULs is probably binary, not a text document.
 const sample=data.subarray(0,Math.min(data.length,8192));
 if(sample.includes(0))throw Error('Diese Quelle ist binär oder hat eine unbekannte Textkodierung.');
 try{return new TextDecoder('utf-8',{fatal:true}).decode(data);}
 catch{
  // Many old API/reference sources still contain Windows-1252 characters.
  // This fallback never changes stored source bytes or their SHA-256 hash.
  return new TextDecoder('windows-1252',{fatal:true}).decode(data);
 }
}
