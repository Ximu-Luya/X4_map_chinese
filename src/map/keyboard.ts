import { useEffect, type RefObject } from 'react'

import type { X4MapApi } from '../types/window'

export interface PanDelta {
  x: number
  y: number
}

export function getKeyboardPan(
  key: string,
  shiftKey: boolean,
  baseStep = 64,
): PanDelta | null {
  const step = baseStep * (shiftKey ? 3 : 1)
  switch (key.toLowerCase()) {
    case 'arrowup':
    case 'w':
      return { x: 0, y: -step }
    case 'arrowdown':
    case 's':
      return { x: 0, y: step }
    case 'arrowleft':
    case 'a':
      return { x: -step, y: 0 }
    case 'arrowright':
    case 'd':
      return { x: step, y: 0 }
    default:
      return null
  }
}

export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.isContentEditable ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  )
}

export function useMapKeyboard(
  rootRef: RefObject<HTMLElement | null>,
  apiRef: RefObject<X4MapApi | null>,
) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target) || event.altKey || event.ctrlKey || event.metaKey) return
      const delta = getKeyboardPan(event.key, event.shiftKey)
      if (!delta) return
      event.preventDefault()
      apiRef.current?.panBy(delta.x, delta.y)
    }

    root.addEventListener('keydown', handleKeyDown)
    return () => root.removeEventListener('keydown', handleKeyDown)
  }, [apiRef, rootRef])
}
