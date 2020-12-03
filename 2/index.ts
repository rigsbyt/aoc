import * as fs from 'fs'
import readline from 'readline'

type Policy = {
  min: number
  max: number
  letter: string
  password: string
}

function check(props: Policy) {
  const count = props.password.split('').filter((char) => char == props.letter)
    .length
  return count >= props.min && count <= props.max
}

function check2(policy: Policy) {
  const first = policy.password[policy.min - 1] == policy.letter
  const second = policy.password[policy.max - 1] == policy.letter
  return (first || second) && (!first || !second)
}

;(() => {
  const filename = process.argv[2]

  const fileStream = fs.createReadStream(filename)

  const rl = readline.createInterface({ input: fileStream })

  rl.on('line', (line) => {
    const match = line.match(/([0-9]+)-([0-9]+)\s+([a-z]):\s+([a-zA-Z]+)/)
    if (match && match.length > 0) {
      if (
        check2({
          min: parseInt(match[1]),
          max: parseInt(match[2]),
          letter: match[3],
          password: match[4],
        })
      ) {
        console.log(line)
      }
    }
  })
})()
