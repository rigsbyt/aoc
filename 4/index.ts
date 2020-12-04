import * as fs from 'fs'
import * as z from 'zod'

function numericString(min: number, max: number) {
  return z
    .string()
    .refine((str) => z.number().min(min).max(max).check(parseInt(str)))
}

const REQ_FIELD_TO_PARSER = {
  byr: numericString(1920, 2002),
  iyr: numericString(2010, 2020),
  eyr: numericString(2020, 2030),
  hgt: z.string().refine((str) => {
    const match = str.match(/([0-9]+)((cm|in))/)
    if (!match) {
      return false
    }
    const numParser =
      match[2] === 'cm' ? numericString(150, 193) : numericString(59, 76)
    return numParser.check(match[1])
  }),
  hcl: z.string().regex(/#[0-9a-f]{6}/),
  ecl: z.enum(['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']),
  pid: z
    .string()
    .length(9)
    .refine((str) => numericString(0, 999999999).check(str)),
}

const PASSPORT_PARSER = z.string().refine((pp) => {
  const fields = pp.split(/\s+/)

  const fieldMap: { [key: string]: string } = fields.reduce(
    (prev, curr) => ({
      ...prev,
      [curr.split(':')[0]]: curr.split(':')[1],
    }),
    {}
  )

  return Object.entries(REQ_FIELD_TO_PARSER).every(
    ([reqField, parser]) =>
      reqField in fieldMap && parser.check(fieldMap[reqField])
  )
})

;(() => {
  const file = fs.readFileSync(process.argv[2])

  const passports = file.toString().split('\n\n')

  console.log(passports.length)
  console.log(passports.filter((pp) => PASSPORT_PARSER.check(pp)).length)
})()
