import * as fs from 'fs'
import readline from 'readline'

const slopesToCheck = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2],
]

;(() => {
  const filename = process.argv[2]

  const fileStream = fs.createReadStream(filename)

  const rl = readline.createInterface({ input: fileStream })

  const results = new Array<number>(slopesToCheck.length).fill(0)

  let lineNum = 0
  rl.on('line', (line) => {
    slopesToCheck
      .map(([xSlope, ySlope]) => {
        if (lineNum % ySlope !== 0) {
          return false
        }
        const y = (lineNum / ySlope) * xSlope
        const char = line[y % line.length]
        return char == '#'
      })
      .forEach((res, idx) => (results[idx] += +res))
    lineNum++
  })

  rl.on('close', () => {
    console.log(results)
    console.log(results.reduce((prev, curr) => curr * prev, 1))
  })
})()
