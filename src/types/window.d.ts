import type { MapStyle } from '../data'

export interface X4MapApi {
  selectSector: (id: number, center?: boolean) => void
  fit: (padding?: number) => void
  setStyle: (style: MapStyle) => void
  setLens: (enabled: boolean) => void
  setKhaak: (enabled: boolean) => void
  setTerraform: (enabled: boolean) => void
  planRoute: (startId: number, destinationId: number) => number[] | null
  route: (fromName: string, toName: string) => number[] | null
}

declare global {
  interface Window {
    X4Map?: X4MapApi
  }
}
