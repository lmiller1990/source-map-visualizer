// AAAA -> [0,0,0,0]

const mappings = 'AAAA,IAAM,KAAK,GAAG,UAAC,IAAY;IACzB,OAAO,WAAS,IAAM,CAAA;AACxB,CAAC,CAAA'
const vlqTable = new Uint8Array(128)
const vlqChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (let i = 0; i < vlqTable.length; i++) vlqTable[i] = 0xFF;
for (let i = 0; i < vlqChars.length; i++) vlqTable[vlqChars.charCodeAt(i)] = i;


function decode(val: string) {
  let shift = 0
  let vlq = 0

  const index = vlqTable[val.charCodeAt(0)]
  vlq |= index
  console.log(vlq, vlq & 1)
  return vlq & 1 ? -(vlq >> 1) : vlq >> 1
}

test('', () => {
  for (const ch of 'IACzB') {
    const actual = decode(ch)
    // console.log(actual)
  }
})