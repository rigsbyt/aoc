const input = `..#....#
##.#..##
.###....
#....#.#
#.######
##.#....
#.......
.#......`

type Grid = boolean[][][][]

function newGrid(xLen: number, yLen: number, zLen: number, wLen: number): Grid {
  const w = new Array<boolean>(wLen).fill(false)
  const z = new Array(zLen).fill(w)
  const y = new Array(yLen).fill(z)
  return new Array(xLen).fill(y)
}

function flatten(grid: Grid): boolean[] {
  return Array.prototype.concat.apply(
    [],
    Array.prototype.concat.apply([], Array.prototype.concat.apply([], grid))
  )
}

function countNeighbors(
  grid: Grid,
  x: number,
  y: number,
  z: number,
  w: number
): number {
  const res = grid
    .slice(Math.max(0, w - 1), Math.min(grid.length, w + 2))
    .map((_3dGrid) =>
      _3dGrid
        .slice(Math.max(0, z - 1), Math.min(_3dGrid.length, z + 2))
        .map((_2dGrid) =>
          _2dGrid
            .slice(Math.max(0, y - 1), Math.min(_2dGrid.length, y + 2))
            .map((_1dGrid) =>
              _1dGrid.slice(Math.max(0, x - 1), Math.min(_1dGrid.length, x + 2))
            )
        )
    )

  // console.log(res)

  return (
    flatten(res).filter((b) => b).length -
    (grid[w]?.[z]?.[y]?.[x] === true ? 1 : 0)
  )
}

;(() => {
  let grid: Grid = [
    [
      input
        .split('\n')
        .map((line) => line.split('').map((char) => char == '#')),
    ],
  ]

  for (let i = 0; i < 6; i++) {
    // console.log(grid)
    const next = newGrid(
      grid.length + 2,
      grid[0].length + 2,
      grid[0][0].length + 2,
      grid[0][0][0].length + 2
    )
    grid = next.map((w, wIdx) =>
      w.map((z, zIdx) =>
        z.map((y, yIdx) =>
          y.map((x, xIdx) => {
            const count = countNeighbors(
              grid,
              xIdx - 1,
              yIdx - 1,
              zIdx - 1,
              wIdx - 1
            )
            // console.log('(', x, ', ', y, ', ', z, ')', ': ', count)
            return (
              count === 3 ||
              (grid[wIdx - 1]?.[zIdx - 1]?.[yIdx - 1]?.[xIdx - 1] === true &&
                count === 2)
            )
          })
        )
      )
    )
  }
  // console.log(grid)

  console.log(flatten(grid).filter((b) => b).length)
})()
