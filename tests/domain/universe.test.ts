import {
  derelictShips,
  highways,
  khaakHives,
  sectorResources,
  stationPositions,
  stationSectors,
  terraformSectors,
  timelineShips,
  universeData,
} from '../../src/data'
import {
  buildNeighbours,
  computeKhaakGateDistances,
  declutterLabels,
  findShortestPath,
  fitWorld,
  normalizeUniverse,
  validateUniverseData,
  zoomAt,
} from '../../src/domain'

describe('地图数据', () => {
  it('保持原始数据规模和引用完整性', () => {
    expect(Object.keys(universeData.factions)).toHaveLength(18)
    expect(universeData.sectors).toHaveLength(152)
    expect(universeData.edges).toHaveLength(179)
    expect(derelictShips).toHaveLength(6)
    expect(timelineShips).toHaveLength(9)
    expect(khaakHives).toHaveLength(10)
    expect(terraformSectors).toHaveLength(12)
    expect(Object.keys(sectorResources)).toHaveLength(108)
    expect(Object.keys(stationSectors)).toHaveLength(74)
    expect(
      validateUniverseData({
        universe: universeData,
        derelicts: derelictShips,
        timelineShips,
        khaakHives,
        terraformSectors,
        resources: sectorResources,
        stationSectors,
        stationPositions,
        highways,
      }),
    ).toEqual([])
  })

  it("保留已知路线和 Kha'ak 安全星区结论", () => {
    const neighbours = buildNeighbours(universeData)
    const byName = new Map(universeData.sectors.map((sector) => [sector.name, sector.id]))
    const route = findShortestPath(
      neighbours,
      byName.get('Argon Prime')!,
      byName.get('Earth')!,
    )
    expect(route).toHaveLength(9)

    const hiveIds = khaakHives.map((name) => byName.get(name)!)
    const distances = computeKhaakGateDistances(universeData, hiveIds)
    expect(distances.filter((distance) => distance > 3)).toHaveLength(36)
  })
})

describe('地图领域函数', () => {
  it('归一化坐标并计算视图', () => {
    const normalized = normalizeUniverse(universeData)
    expect(normalized.sectors).toHaveLength(152)
    expect(normalized.worldWidth).toBeGreaterThan(0)
    expect(normalized.worldHeight).toBeGreaterThan(0)

    const fitted = fitWorld(1440, 800, normalized.worldWidth, normalized.worldHeight)
    expect(fitted.scale).toBeGreaterThan(0.18)
    expect(zoomAt(fitted, 720, 400, 100).scale).toBe(8)
    expect(zoomAt(fitted, 720, 400, 0.0001).scale).toBe(0.18)
  })

  it('按优先级移除重叠标签', () => {
    const visible = declutterLabels([
      { id: 'low', x: 10, y: 10, width: 20, height: 10, priority: 0 },
      { id: 'high', x: 10, y: 10, width: 20, height: 10, priority: 10 },
      { id: 'separate', x: 100, y: 100, width: 20, height: 10 },
    ])
    expect([...visible]).toEqual(['high', 'separate'])
  })
})
