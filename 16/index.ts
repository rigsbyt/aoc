import * as fs from 'fs'
import * as z from 'zod'

const Rule = z.object({
  name: z.string(),
  range1Lo: z.string().transform(z.number(), parseInt),
  range1Hi: z.string().transform(z.number(), parseInt),
  range2Lo: z.string().transform(z.number(), parseInt),
  range2Hi: z.string().transform(z.number(), parseInt),
})
type Rule = z.infer<typeof Rule>

const parseRule = (val: string) =>
  Rule.parse(
    val.match(
      /(?<name>[a-z ]+): (?<range1Lo>[0-9]+)-(?<range1Hi>[0-9]+) or (?<range2Lo>[0-9]+)-(?<range2Hi>[0-9]+)/
    )!.groups
  )

function possiblyValid(rules: Rule[], val: number) {
  return rules.some(
    (rule) =>
      (val >= rule.range1Lo && val <= rule.range1Hi) ||
      (val >= rule.range2Lo && val <= rule.range2Hi)
  )
}

function one(rules: Rule[], nearbyTickets: number[][]): number {
  console.log(rules)
  console.log(nearbyTickets)
  return nearbyTickets.reduce(
    (prev, curr) =>
      prev +
      curr.reduce(
        (prev, curr) => prev + (possiblyValid(rules, curr) ? 0 : curr),
        0
      ),
    0
  )
}

function two(
  rules: Rule[],
  myTicket: number[],
  nearbyTickets: number[][]
): number {
  const validTickets = nearbyTickets.filter((ticket) =>
    ticket.every((val) => possiblyValid(rules, val))
  )
  const possibleRuleIdxs = rules.map(
    (rule) =>
      new Set(
        Array.from(Array(rules.length).keys()).filter((idx) =>
          [myTicket, ...validTickets].every((nearbyTicket) =>
            possiblyValid([rule], nearbyTicket[idx])
          )
        )
      )
  )

  let recentSingles: number[] = possibleRuleIdxs
    .filter((rule) => rule.size === 1)
    .map((rule) => rule.values().next().value)
  while (possibleRuleIdxs.some((rule) => rule.size > 1)) {
    let nextSingles: number[] = []
    possibleRuleIdxs
      .filter((rule) => rule.size > 1)
      .forEach((rule) => {
        recentSingles.forEach((single) => rule.delete(single))
        if (rule.size === 1) {
          nextSingles.push(rule.values().next().value)
        }
      })
    if (nextSingles.length === 0) {
      throw new Error('Aww need to be smarter')
    }
    recentSingles = nextSingles
  }

  const ruleIdxs = possibleRuleIdxs.map((set) => set.values().next().value)

  const departureFields = myTicket.filter((val, idx) =>
    rules[ruleIdxs.indexOf(idx)].name.startsWith('departure')
  )

  if (departureFields.length !== 6) {
    throw new Error('wrong count of departure fields')
  }

  return departureFields.reduce((prev, curr) => prev * curr, 1)
}

;(() => {
  const file = fs.readFileSync(process.argv[2]).toString()

  const sections = file.split('\n\n')

  const rules = sections[0].split('\n').map((line) => parseRule(line))
  const myTicket = sections[1]
    .split('\n')[1]
    .split(',')
    .map((val) => parseInt(val))
  const nearbyTickets = sections[2]
    .split('\n')
    .filter((line) => line.trim())
    .slice(1)
    .map((line) => line.split(',').map((val) => parseInt(val)))

  // console.log(one(rules, nearbyTickets))
  console.log(two(rules, myTicket, nearbyTickets))
})()
