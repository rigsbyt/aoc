import * as fs from 'fs'
import * as z from 'zod'

const Color = z.string()
type Color = z.infer<typeof Color>

const Contents = z.array(
  z
    .object({
      count: z.string().transform(z.number(), parseInt),
      color: Color,
    })
    .nonstrict()
)
type Contents = z.infer<typeof Contents>

function setContains(invMap: Map<Color, Color[]>, color: Color): Set<Color> {
  console.log(color)
  return new Set<Color>(
    (invMap.get(color) || [])
      .map((color) => setContains(invMap, color))
      .reduce((prev, curr) => {
        curr.forEach((color) => prev.add(color))
        return prev
      }, new Set<Color>())
  ).add(color)
}

function bagContains(map: Map<Color, Contents>, color: Color): number {
  return (
    1 +
    (map.get(color) ?? [])
      .map((content) => content.count * bagContains(map, content.color))
      .reduce((prev, curr) => prev + curr, 0)
  )
}

;(() => {
  const file = fs.readFileSync(process.argv[2]).toString()
  const lines = file.split('\n').filter((str) => str.trim())
  const map = lines.reduce((prev, curr) => {
    const sides = curr.split(/ bags contain /)
    const color = Color.parse(sides[0])
    const contents = Contents.parse(
      sides[1]
        .split(', ')
        .filter((content) => content != 'no other bags.')
        .map(
          (content) =>
            content.match(/(?<count>[0-9]+) (?<color>[a-z ]+) bags?\.?/)?.groups
        )
    )
    prev.set(color, contents)
    return prev
  }, new Map<Color, Contents>())

  const invMap = [...map.entries()].reduce((prev, [container, contents]) => {
    contents.forEach((content) => {
      if (!prev.has(content.color)) {
        prev.set(content.color, [])
      }
      prev.get(content.color)!.push(container)
    })
    return prev
  }, new Map<Color, Color[]>())

  console.log(bagContains(map, 'shiny gold') - 1)
})()
