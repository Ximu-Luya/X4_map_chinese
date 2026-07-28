export type Point = [number, number]
export type SectorId = number
export type ShipClass = 'S' | 'M' | 'L'
export type EdgeType = 'gate' | 'hw'
export type MapStyle = 'hex' | 'constellation' | 'territory'
export type StationCode = 'SY' | 'WH' | 'EQ' | 'TR' | 'HQ' | 'PB'
export type ResourceCode =
  | 'ore'
  | 'silicon'
  | 'ice'
  | 'nividium'
  | 'hydrogen'
  | 'helium'
  | 'methane'
  | 'rawscrap'
  | 'rawkhaakscrap'

export interface Faction {
  name: string
  short: string
  color: string
}

export interface Sector {
  id: SectorId
  name: string
  x: number
  y: number
  f: string
  hex: Point[]
  r: number
}

export interface UniverseEdge {
  a: SectorId
  b: SectorId
  type: EdgeType
  ga?: Point
  gb?: Point
}

export interface Cluster {
  name: string
  x: number
  y: number
  f: string
  n: number
}

export interface UniverseData {
  factions: Record<string, Faction>
  sectors: Sector[]
  edges: UniverseEdge[]
  clusters: Cluster[]
}

export interface DerelictShip {
  slug: string
  name: string
  cls: ShipClass
  role: string
  sector: string
  coords: string
  off: Point
  find: string
  claim: string
  danger: boolean
  prize?: boolean
}

export interface TimelineShip {
  slug: string
  tl: string
  name: string
  cls: ShipClass
  role: string
  sector: string
  off: Point
  req: string
  find: string
  claim: string
  danger?: boolean
  dangerNote?: string
  zoom?: number
}

export interface StationType {
  name: string
  sub: string
  color: string
}

export type StationPosition = [StationCode, number, number]
export type SectorResources = Partial<Record<ResourceCode, number>>

export interface NormalizedSector extends Sector {
  lx: number
  ly: number
  lr: number
  hexLocal: Point[]
}

export interface ViewTransform {
  scale: number
  tx: number
  ty: number
}

export interface LabelCandidate {
  id: string
  x: number
  y: number
  width: number
  height: number
  priority?: number
}
