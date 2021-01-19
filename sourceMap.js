const charToInteger = {};
const integerToChar = {};

'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  .split('')
  .forEach(function(char, i) {
    charToInteger[char] = i
    integerToChar[i] = char
  })

function decode(string, acc = 0, depth = 0, decoded = []) {
  if (!string) {
    return decoded
  }

  const [nextChar, ...rest] = string
  const integer = charToInteger[nextChar]
  const hasContinuationBit = integer & 32
  const withoutContBit = integer & 31

  console.log('withoutContBit', withoutContBit)
  const suffix = withoutContBit + (31 * depth)// (withoutContBit << (5 * depth))
  const value = acc | suffix
  console.log('value', value)

  if (hasContinuationBit) {
    return decode(rest.join(''), value, depth + 1, decoded)
  } else {
    const isNegative = value & 1
    const finalValue = isNegative ? -(value >>> 1) : value >>> 1
    return decode(rest.join(''), 0, 0, decoded.concat(finalValue))
  }
}

console.log(
  decode('yB') // => [119, -3]
)

