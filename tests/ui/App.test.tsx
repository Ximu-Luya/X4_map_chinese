import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import i18n from '../../src/i18n'
import { App } from '../../src/ui/App'

vi.mock('../../src/map/createMap', () => ({
  createMap: vi.fn(() => ({
    fit: vi.fn(),
    panBy: vi.fn(),
    planRoute: vi.fn(),
    route: vi.fn(),
    selectSector: vi.fn(),
    setKhaak: vi.fn(),
    setLens: vi.fn(),
    setStyle: vi.fn(),
    setTerraform: vi.fn(),
  })),
}))

describe('完整页面', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('zh-CN')
  })

  it('默认渲染中文地图和完整资料区', () => {
    render(<App />)
    expect(screen.getByRole('region', { name: 'X4 交互式宇宙地图' })).toBeInTheDocument()
    expect(screen.getByText('宇宙地图')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'X4: 基石中的免费、废弃及无主舰船' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'X4 地图与免费舰船速查' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '中文' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('英文资源可以完整渲染', async () => {
    await i18n.changeLanguage('en-US')
    render(<App />)
    expect(screen.getByText('UNIVERSE MAP')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search sector...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true')
  })
})
