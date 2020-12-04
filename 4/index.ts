import * as fs from 'fs'
import * as z from 'zod'

const reqFields = {
  byr: z
    .string()
    .refine((str) => z.number().min(1920).max(2002).check(parseInt(str))),
  iyr: z
    .string()
    .refine((str) => z.number().min(2010).max(2020).check(parseInt(str))),
  eyr: z
    .string()
    .refine((str) => z.number().min(2020).max(2030).check(parseInt(str))),
  hgt: z.string().refine((str) => {
    const match = str.match(/([0-9]+)((cm|in))/)
    if (!match) {
      return false
    }
    const numParser =
      match[2] === 'cm'
        ? z.number().min(150).max(193).check(parseInt(str))
        : z.number().min(59).max(76).check(parseInt(str))
    return z
      .string()
      .refine((str) => numParser)
      .check(match[1])
  }),
  hcl: z.string().regex(/#[0-9a-f]{6}/),
  ecl: z.enum(['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']),
  pid: z
    .string()
    .length(9)
    .refine((str) =>
      z
        .string()
        .refine((str) => z.number().min(0).max(999999999).check(parseInt(str)))
        .check(str)
    ),
}

;(() => {
  const file = fs.readFileSync(process.argv[2])

  const passports = file.toString().split('\n\n')

  const validOrNot = passports.map((pp) => {
    const fields = pp.split(/\s+/)

    const fieldMap: { [key: string]: string } = fields.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.split(':')[0]]: curr.split(':')[1],
      }),
      {}
    )

    return Object.entries(reqFields).every(
      ([reqField, parser]) =>
        reqField in fieldMap && parser.check(fieldMap[reqField])
    )
  })

  console.log(validOrNot.length)

  const valid = validOrNot.filter((val) => val)

  console.log(valid.length)
})()
