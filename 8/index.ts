import * as fs from 'fs'
import * as z from 'zod'
import * as readline from 'readline'

enum Type {
  acc = 'acc',
  jmp = 'jmp',
  nop = 'nop',
}
const Operation = z.string().transform(
  z.object({
    type: z.nativeEnum(Type),
    val: z.number().int(),
  }),
  (input: string) => {
    const parts = input.split(/\s+/)
    return {
      type: z.nativeEnum(Type).parse(parts[0]),
      val: z
        .string()
        .regex(/(\+|-)[0-9]+/)
        .transform(z.number().int(), (str) => parseInt(str))
        .parse(parts[1]),
    }
  }
)
type Operation = z.infer<typeof Operation>

function executeProgram1(
  program: Operation[],
  line = 0,
  acc = 0,
  executed = new Set<number>()
): number {
  if (executed.has(line)) {
    return acc
  }
  executed.add(line)
  const op = program[line]
  const nextLine = op.type == Type.jmp ? line + op.val : line + 1
  const newAcc = acc + (op.type == Type.acc ? op.val : 0)
  return executeProgram1(program, nextLine, newAcc, executed)
}

function detectLoop(
  program: Operation[],
  line = 0,
  acc = 0,
  executed = new Set<number>(),
  usedFlip = false
): number | false {
  if (executed.has(line)) {
    return false
  }
  if (line === program.length) {
    return acc
  }
  executed.add(line)
  const op = program[line]
  let res
  if (op.type === Type.acc) {
    res = detectLoop(program, line + 1, acc + op.val, executed, usedFlip)
  } else {
    const nextLine = op.type == Type.jmp ? line + op.val : line + 1
    res = detectLoop(program, nextLine, acc, executed, usedFlip)
    if (res) {
      return res
    } else if (!usedFlip) {
      if (op.type == Type.jmp) {
        res = detectLoop(program, line + 1, acc, executed, true)
      } else {
        res = detectLoop(program, line + op.val, acc, executed, true)
      }
      if (res) {
        console.log('flipped line', line)
      }
    }
  }
  executed.delete(line)
  return res
}

;(() => {
  const filename = process.argv[2]

  const fileStream = fs.createReadStream(filename)

  const rl = readline.createInterface({ input: fileStream })

  const program: Operation[] = []
  rl.on('line', (line) => program.push(Operation.parse(line)))
  rl.on('close', () => console.log('acc: ', detectLoop(program)))
})()
