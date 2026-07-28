import type {
  DerelictShip,
  Point,
  SectorResources,
  StationCode,
  StationPosition,
  TimelineShip,
  UniverseData,
} from '../data'

interface ValidationData {
  universe: UniverseData
  derelicts: readonly DerelictShip[]
  timelineShips: readonly TimelineShip[]
  khaakHives: readonly string[]
  terraformSectors: readonly string[]
  resources: Record<string, SectorResources>
  stationSectors: Record<string, StationCode[]>
  stationPositions: Record<string, StationPosition[]>
  highways: Record<string, Point[]>
}

export function validateUniverseData(data: ValidationData): string[] {
  const errors: string[] = []
  const { universe } = data
  const sectorNames = new Set(universe.sectors.map((sector) => sector.name))
  const ids = new Set(universe.sectors.map((sector) => sector.id))

  if (sectorNames.size !== universe.sectors.length) errors.push('星区英文名称存在重复')
  if (ids.size !== universe.sectors.length) errors.push('星区 ID 存在重复')

  universe.sectors.forEach((sector, index) => {
    if (sector.id !== index) errors.push(`星区 ID 与数组索引不一致：${sector.name}`)
    if (!universe.factions[sector.f]) errors.push(`星区阵营不存在：${sector.name} -> ${sector.f}`)
  })

  universe.edges.forEach((edge, index) => {
    if (!universe.sectors[edge.a] || !universe.sectors[edge.b]) {
      errors.push(`连接端点不存在：edge ${index}`)
    }
  })

  const assertSector = (source: string, sector: string) => {
    if (!sectorNames.has(sector)) errors.push(`${source} 引用了不存在的星区：${sector}`)
  }
  data.derelicts.forEach((ship) => assertSector(`废弃舰船 ${ship.slug}`, ship.sector))
  data.timelineShips.forEach((ship) => assertSector(`时间线舰船 ${ship.slug}`, ship.sector))
  data.khaakHives.forEach((sector) => assertSector("Kha'ak 巢穴", sector))
  data.terraformSectors.forEach((sector) => assertSector('地球化星区', sector))

  for (const [source, record] of [
    ['资源', data.resources],
    ['空间站', data.stationSectors],
    ['空间站坐标', data.stationPositions],
    ['本地高速公路', data.highways],
  ] as const) {
    Object.keys(record).forEach((sector) => assertSector(source, sector))
  }
  return errors
}
