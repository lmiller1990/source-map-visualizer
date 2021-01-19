const charToInteger: Record<string, number> = {}
const integerToChar: Record<number, string> = {}

'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  .split('')
  .forEach((char, i) => {
    charToInteger[char] = i
    integerToChar[i] = char
  })

function decode(str: string, acc = 0, depth = 0, decoded = []) {
  const [char, ...tail] = str
  const rest = tail.join('')
  const integer = charToInteger[char]

  const hasContinuationBit = integer & 32
  const withoutContBit = integer & 31
  const shifted = (withoutContBit << 5 * depth)
  const value = acc | shifted

  if (hasContinuationBit) {
    return decode(rest, value, depth + 1, decoded)
  }

  const isNegative = value & 1
  const finalValue = isNegative ? -(value >>> 1) : value >>> 1
  if (!rest) {
    return decoded.concat(finalValue)
  }

  return decode(rest, 0, 0, decoded.concat(finalValue))
}

console.log(
  decode('63C')
)
