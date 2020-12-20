import * as fs from 'fs'

function isRegex(val: 'LOOP' | string): val is string {
  return val != 'LOOP'
}

function resolve(
  key: number,
  rulesLinesMap: Map<number, string>,
  regexMap: Map<number, string>
): string | 'LOOP' {
  if (regexMap.has(key)) {
    return regexMap.get(key)!
  } else {
    const line = rulesLinesMap.get(key)!
    let match
    if ((match = line.match(/\s*"([a-z])"\s*/))) {
      const res = match[1]
      regexMap.set(key, res)
      return res
    } else {
      const parts = line!.split('|').map((part) => part.trim())
      const partsRegexes = parts.map((part) => {
        let bits = part.split(/\s+/).map((bit) => {
          const thisKey = parseInt(bit)
          if (key == thisKey) {
            return 'LOOP'
          }

          return resolve(thisKey, rulesLinesMap, regexMap)
        })
        if (bits.some((bit) => bit == 'LOOP')) {
          bits = bits.filter(isRegex)
          // (╯°□°)╯︵ ┻━┻
          return `(${[...new Array(20).keys()]
            .map((num) => bits.map((val) => `(${val}){${num + 1}}`).join(''))
            .join('|')})`
        }
        return `(${bits.join('')})`
      })

      const res = `(${partsRegexes.join('|')})`
      regexMap.set(key, res)
      return res
    }
  }
}

;(() => {
  const file = fs.readFileSync(process.argv[2]).toString()

  const sections = file.split('\n\n')

  const rulesLines = sections[0]
  const rulesLinesMap = rulesLines.split('\n').reduce((prev, curr) => {
    const parts = curr.split(': ')
    prev.set(parseInt(parts[0]), parts[1])
    return prev
  }, new Map<number, string>())

  const regexMap = new Map<number, string>()

  ;[...rulesLinesMap.keys()].map((key) => resolve(key, rulesLinesMap, regexMap))

  console.log(regexMap.get(0))

  const lines = sections[1]
    .trim()
    .split('\n')
    .filter((line) => line.match(new RegExp(`^${regexMap.get(0)!}$`)))

  console.log('matching: ')
  console.log(lines.join('\n'))
  console.log(lines.length)
})()
