import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const originDirectory = path.resolve('origin')
const manifest = await readFile(path.join(originDirectory, 'SHA256SUMS'), 'utf8')
const failures = []

for (const line of manifest.split('\n').filter(Boolean)) {
  const [expected, relativePath] = line.trim().split(/\s{2,}/)
  const absolutePath = path.resolve(originDirectory, relativePath)
  if (!absolutePath.startsWith(`${originDirectory}${path.sep}`)) {
    failures.push(`${relativePath}: 路径超出 origin 目录`)
    continue
  }
  try {
    const content = await readFile(absolutePath)
    const actual = createHash('sha256').update(content).digest('hex')
    if (actual !== expected) failures.push(`${relativePath}: ${actual} != ${expected}`)
  } catch (error) {
    failures.push(`${relativePath}: ${error.message}`)
  }
}

if (failures.length) {
  console.error(`原始归档校验失败：\n${failures.join('\n')}`)
  process.exitCode = 1
} else {
  console.log('原始归档 SHA-256 校验通过。')
}
