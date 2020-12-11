import * as fs from 'fs'

function flatten(grid: string[][]) {
  return Array.prototype.concat.apply([], grid)
}

function neighbors(row: number, col: number, grid: string[][]): string[] {
  const window = grid
    .slice(Math.max(row - 1, 0), row + 2)
    .map((row) => row.slice(Math.max(col - 1, 0), col + 2))
  window[Math.min(row, 1)].splice(Math.min(col, 1), 1)
  return flatten(window)
}

function sights(row: number, col: number, grid: string[][]): string[] {
  const directions = [
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
  ]
  return directions.map((direction) => {
    let yPos = row + direction[0]
    let xPos = col + direction[1]

    while (
      yPos >= 0 &&
      yPos < grid.length &&
      xPos >= 0 &&
      xPos < grid[yPos].length
    ) {
      if (grid[yPos][xPos] != '.') {
        return grid[yPos][xPos]
      }
      yPos += direction[0]
      xPos += direction[1]
    }
    return '.'
  })
}

let flipped = true

function transform1(item: string, row: number, col: number, grid: string[][]) {
  if (item == 'L') {
    if (!neighbors(row, col, grid).some((item) => item == '#')) {
      flipped = true
      return '#'
    } else {
      return 'L'
    }
  } else if (item == '#') {
    if (neighbors(row, col, grid).filter((item) => item == '#').length >= 4) {
      flipped = true
      return 'L'
    } else {
      return '#'
    }
  }
  return item
}

function transform2(item: string, row: number, col: number, grid: string[][]) {
  if (item == 'L') {
    if (!sights(row, col, grid).some((item) => item == '#')) {
      flipped = true
      return '#'
    } else {
      return 'L'
    }
  } else if (item == '#') {
    if (sights(row, col, grid).filter((item) => item == '#').length >= 5) {
      flipped = true
      return 'L'
    } else {
      return '#'
    }
  }
  return item
}

function runStep(grid: string[][]): string[][] {
  flipped = false
  return grid.map((row, rowIdx) =>
    row.map((status, colIdx) => transform2(status, rowIdx, colIdx, grid))
  )
}

;(() => {
  const file = fs.readFileSync(process.argv[2]).toString()
  const lines = file.split('\n').filter((line) => line.trim())

  let grid = lines.map((line) => line.split(''))
  while (flipped) {
    grid = runStep(grid)
    grid.forEach((row) => console.log(row.join('')))
    console.log()
  }
  console.log(flatten(grid).filter((item) => item == '#').length)
})()
