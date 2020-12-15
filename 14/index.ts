import * as fs from 'fs'
import * as z from 'zod'

const MASK_REGEX = /mask\s+=\s+((X|0|1){36})/
const ASSIGN_REGEX = /mem\[(?<location>[0-9]+)\]\s+=\s+(?<value>[0-9]+)/

const Mask = z
  .string()
  .regex(MASK_REGEX)
  .transform(z.string(), (val) => val.match(MASK_REGEX)![1])

const WriteCommand = z.object({
  location: z.string().transform(z.number(), parseInt),
  value: z.string().transform(z.number(), parseInt),
})
type WriteCommand = z.infer<typeof WriteCommand>

function one(program: string[]) {
  function applyMask(mask: string, value: string) {
    return value
      .split('')
      .map((char, idx) => (mask[idx] == 'X' ? char : mask[idx]))
      .join('')
  }

  let mask = ''

  const res = program.reduce((prev: Map<number, number>, curr: string) => {
    const maskRes = Mask.safeParse(curr)
    if (maskRes.success) {
      mask = maskRes.data
    } else {
      const command = WriteCommand.parse(curr.match(ASSIGN_REGEX)!.groups)
      const valueStr = command.value.toString(2).padStart(36, '0')
      const masked = applyMask(mask, valueStr)
      const newVal = parseInt(masked, 2)
      console.log(mask)
      console.log(command)
      console.log(newVal)
      prev.set(command.location, newVal)
    }
    return prev
  }, new Map<number, number>())

  const sum = [...res.values()].reduce((prev, curr) => prev + curr, 0)
  console.log(sum)
}

function strSplice(value: string, idx: number, repl: string) {
  const arr = value.split('')
  arr.splice(idx, 1, repl)
  return arr.join('')
}

function two(program: string[]) {
  function applyMask(mask: string, value: string) {
    let values = [value]
    mask.split('').forEach((char, idx) => {
      if (char == '1') {
        values = values.map((value) => strSplice(value, idx, '1'))
      } else if (char == 'X') {
        const newValues: string[] = []
        values.forEach((value) => {
          newValues.push(strSplice(value, idx, '0'))
          newValues.push(strSplice(value, idx, '1'))
        })
        values = newValues
      }
    })
    return values
  }

  let mask = ''

  const res = program.reduce((prev: Map<number, number>, curr: string) => {
    const maskRes = Mask.safeParse(curr)
    if (maskRes.success) {
      mask = maskRes.data
    } else {
      const command = WriteCommand.parse(curr.match(ASSIGN_REGEX)!.groups)
      const oldAddressStr = command.location.toString(2).padStart(36, '0')
      const addresses = applyMask(mask, oldAddressStr)
      addresses.forEach((address) =>
        prev.set(parseInt(address, 2), command.value)
      )
    }
    return prev
  }, new Map<number, number>())

  const sum = [...res.values()].reduce((prev, curr) => prev + curr, 0)
  console.log(sum)
}

;(() => {
  const file = fs.readFileSync(process.argv[2]).toString()

  const program = file.split('\n').filter((line) => line.trim())

  // one(program)
  two(program)
})()
