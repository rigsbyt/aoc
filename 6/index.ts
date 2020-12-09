import * as fs from 'fs'

function any(group: string) {
  return group
    .split('')
    .reduce(
      (prev, curr) => (curr < 'a' || curr > 'z' ? prev : prev.add(curr)),
      new Set<string>()
    ).size
}

function all(group: string) {
  const res = group
    .split('\n')
    .filter((str) => str.trim().length > 0)
    .map((member) => member.split(''))
    .map((questions) =>
      questions.reduce(
        (prev, curr) => (curr < 'a' || curr > 'z' ? prev : prev.add(curr)),
        new Set<string>()
      )
    )
    .reduce(
      (prev: Set<string> | null, curr) =>
        prev == null ? curr : new Set([...prev].filter((x) => curr.has(x))),
      null
    )!.size
  console.log(group, ': ', res)
  return res
}

;(() => {
  const file = fs.readFileSync(process.argv[2])

  const groups = file
    .toString()
    .split('\n\n')
    .filter((str) => str.trim().length > 0)

  console.log(groups.map(all).reduce((prev, curr) => prev + curr, 0))
})()
