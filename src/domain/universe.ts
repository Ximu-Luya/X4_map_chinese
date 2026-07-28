import type {
  LabelCandidate,
  NormalizedSector,
  Point,
  SectorId,
  UniverseData,
  ViewTransform,
} from '../data'

export interface Neighbour {
  id: SectorId
  type: 'gate' | 'hw'
}

export interface NormalizedUniverse {
  sectors: NormalizedSector[]
  worldWidth: number
  worldHeight: number
  scaleFactor: number
}

export function normalizeUniverse(
  universe: UniverseData,
  scaleFactor = 0.01,
): NormalizedUniverse {
  const xs = universe.sectors.map((sector) => sector.x)
  const ys = universe.sectors.map((sector) => sector.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  return {
    sectors: universe.sectors.map((sector) => ({
      ...sector,
      lx: (sector.x - minX) * scaleFactor,
      ly: (sector.y - minY) * scaleFactor,
      lr: sector.r * scaleFactor,
      hexLocal: sector.hex.map(
        ([x, y]) => [x * scaleFactor, y * scaleFactor] satisfies Point,
      ),
    })),
    worldWidth: (maxX - minX) * scaleFactor,
    worldHeight: (maxY - minY) * scaleFactor,
    scaleFactor,
  }
}

export function buildNeighbours(universe: UniverseData): Neighbour[][] {
  const neighbours = universe.sectors.map(() => [] as Neighbour[])
  for (const edge of universe.edges) {
    neighbours[edge.a].push({ id: edge.b, type: edge.type })
    neighbours[edge.b].push({ id: edge.a, type: edge.type })
  }
  return neighbours
}

export function findShortestPath(
  neighbours: readonly Neighbour[][],
  start: SectorId,
  destination: SectorId,
): SectorId[] | null {
  if (start === destination) return [start]
  if (!neighbours[start] || !neighbours[destination]) return null

  const previous = new Array<number>(neighbours.length).fill(-1)
  const seen = new Array<boolean>(neighbours.length).fill(false)
  const queue: number[] = [start]
  let cursor = 0
  seen[start] = true

  while (cursor < queue.length) {
    const current = queue[cursor++]
    if (current === destination) break
    for (const neighbour of neighbours[current]) {
      if (seen[neighbour.id]) continue
      seen[neighbour.id] = true
      previous[neighbour.id] = current
      queue.push(neighbour.id)
    }
  }

  if (!seen[destination]) return null
  const path: number[] = []
  for (let current = destination; current !== -1; current = previous[current]) {
    path.unshift(current)
  }
  return path
}

export function computeDistances(
  neighbours: readonly Neighbour[][],
  sources: readonly SectorId[],
): number[] {
  const distances = new Array<number>(neighbours.length).fill(Number.POSITIVE_INFINITY)
  const queue: number[] = []
  let cursor = 0

  for (const source of sources) {
    if (!neighbours[source] || distances[source] === 0) continue
    distances[source] = 0
    queue.push(source)
  }

  while (cursor < queue.length) {
    const current = queue[cursor++]
    for (const neighbour of neighbours[current]) {
      if (distances[neighbour.id] <= distances[current] + 1) continue
      distances[neighbour.id] = distances[current] + 1
      queue.push(neighbour.id)
    }
  }
  return distances
}

export function computeKhaakGateDistances(
  universe: UniverseData,
  hiveSectorIds: readonly SectorId[],
): number[] {
  const parent = universe.sectors.map((_, index) => index)
  const find = (value: number): number => {
    let current = value
    while (parent[current] !== current) {
      parent[current] = parent[parent[current]]
      current = parent[current]
    }
    return current
  }
  const union = (left: number, right: number) => {
    const leftRoot = find(left)
    const rightRoot = find(right)
    if (leftRoot !== rightRoot) parent[rightRoot] = leftRoot
  }

  universe.edges.forEach((edge) => {
    if (edge.type === 'hw') union(edge.a, edge.b)
  })

  const groupNeighbours = new Map<number, Set<number>>()
  universe.edges.forEach((edge) => {
    if (edge.type !== 'gate') return
    const left = find(edge.a)
    const right = find(edge.b)
    if (left === right) return
    if (!groupNeighbours.has(left)) groupNeighbours.set(left, new Set())
    if (!groupNeighbours.has(right)) groupNeighbours.set(right, new Set())
    groupNeighbours.get(left)!.add(right)
    groupNeighbours.get(right)!.add(left)
  })

  const groupDistances = new Map<number, number>()
  const queue: number[] = []
  let cursor = 0
  hiveSectorIds.forEach((sectorId) => {
    const group = find(sectorId)
    if (groupDistances.has(group)) return
    groupDistances.set(group, 0)
    queue.push(group)
  })

  while (cursor < queue.length) {
    const current = queue[cursor++]
    const distance = groupDistances.get(current)!
    for (const neighbour of groupNeighbours.get(current) ?? []) {
      if ((groupDistances.get(neighbour) ?? Number.POSITIVE_INFINITY) <= distance + 1) continue
      groupDistances.set(neighbour, distance + 1)
      queue.push(neighbour)
    }
  }

  return universe.sectors.map(
    (_, index) => groupDistances.get(find(index)) ?? Number.POSITIVE_INFINITY,
  )
}

export function fitWorld(
  viewportWidth: number,
  viewportHeight: number,
  worldWidth: number,
  worldHeight: number,
  padding = 0.08,
): ViewTransform {
  const scale = Math.min(viewportWidth / worldWidth, viewportHeight / worldHeight) * (1 - padding)
  return {
    scale,
    tx: (viewportWidth - worldWidth * scale) / 2,
    ty: (viewportHeight - worldHeight * scale) / 2,
  }
}

export function zoomAt(
  transform: ViewTransform,
  x: number,
  y: number,
  factor: number,
  minScale = 0.18,
  maxScale = 8,
): ViewTransform {
  const scale = Math.min(maxScale, Math.max(minScale, transform.scale * factor))
  const ratio = scale / transform.scale
  return {
    scale,
    tx: x - (x - transform.tx) * ratio,
    ty: y - (y - transform.ty) * ratio,
  }
}

export function declutterLabels(candidates: readonly LabelCandidate[]): Set<string> {
  const visible = new Set<string>()
  const boxes: Array<{ left: number; top: number; right: number; bottom: number }> = []
  const ordered = [...candidates].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))

  for (const candidate of ordered) {
    const box = {
      left: candidate.x - candidate.width / 2,
      right: candidate.x + candidate.width / 2,
      top: candidate.y - candidate.height / 2,
      bottom: candidate.y + candidate.height / 2,
    }
    const overlaps = boxes.some(
      (other) =>
        box.left < other.right &&
        box.right > other.left &&
        box.top < other.bottom &&
        box.bottom > other.top,
    )
    if (overlaps) continue
    boxes.push(box)
    visible.add(candidate.id)
  }
  return visible
}
