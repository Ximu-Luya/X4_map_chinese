import { universeData } from '../../src/data'
import { resolveInitialLocale } from '../../src/i18n'
import enUS from '../../src/locales/en-US.json'
import zhCN from '../../src/locales/zh-CN.json'

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [prefix]
  return Object.entries(value).flatMap(([key, child]) =>
    flattenKeys(child, prefix ? `${prefix}.${key}` : key),
  )
}

describe('本地化资源', () => {
  it('中英文具有完全相同的键集合', () => {
    expect(flattenKeys(zhCN).sort()).toEqual(flattenKeys(enUS).sort())
  })

  it('覆盖全部星区和阵营', () => {
    universeData.sectors.forEach((sector) => {
      expect(zhCN.sectors).toHaveProperty(sector.name)
      expect(enUS.sectors).toHaveProperty(sector.name)
    })
    Object.keys(universeData.factions).forEach((code) => {
      expect(zhCN.factions).toHaveProperty(code)
      expect(enUS.factions).toHaveProperty(code)
    })
  })

  it('没有显式配置时默认使用简体中文', () => {
    window.localStorage.clear()
    expect(resolveInitialLocale()).toBe('zh-CN')
  })
})
