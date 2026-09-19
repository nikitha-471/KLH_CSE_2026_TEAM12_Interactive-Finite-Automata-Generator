/**
 * graphLayout.js
 * --------------
 * A tiny, dependency-free layout algorithm for React Flow.
 *
 * We don't need a heavy graph-layout library for this project: automata
 * graphs are small, so a simple breadth-first "level" layout (distance from
 * the start state = column, position within that column = row) looks clean
 * and is completely deterministic for any regular expression the user types.
 */

const COLUMN_WIDTH = 190
const ROW_HEIGHT = 110

export function computeLayout(stateIds, transitions, startId) {
  const adjacency = {}
  stateIds.forEach((id) => {
    adjacency[id] = []
  })
  transitions.forEach((t) => {
    if (adjacency[t.from]) adjacency[t.from].push(t.to)
  })

  // BFS from the start state to assign each state a "level" (column index)
  const level = {}
  level[startId] = 0
  const queue = [startId]
  while (queue.length > 0) {
    const current = queue.shift()
    for (const next of adjacency[current] || []) {
      if (!(next in level)) {
        level[next] = level[current] + 1
        queue.push(next)
      }
    }
  }

  // Any state not reached by BFS (shouldn't normally happen) still gets placed
  let maxLevel = 0
  stateIds.forEach((id) => {
    if (!(id in level)) level[id] = 0
    maxLevel = Math.max(maxLevel, level[id])
  })

  const countPerLevel = {}
  const positions = {}
  stateIds.forEach((id) => {
    const lvl = level[id]
    const rowIndex = countPerLevel[lvl] || 0
    countPerLevel[lvl] = rowIndex + 1
    positions[id] = {
      x: lvl * COLUMN_WIDTH + 60,
      y: rowIndex * ROW_HEIGHT + 60,
    }
  })

  return positions
}
