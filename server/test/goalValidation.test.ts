import { describe, expect, it } from 'vitest'
import { todayInAppZone } from '../src/utils/goalValidation.js'

describe('todayInAppZone', () => {
  it('liczy dzień w czasie polskim, nie UTC', () => {
    // 23:30 UTC 8 listopada to już 00:30 9 listopada w Warszawie (UTC+1)
    expect(todayInAppZone(new Date('2026-11-08T23:30:00Z'))).toBe('2026-11-09')
    expect(todayInAppZone(new Date('2026-11-08T12:00:00Z'))).toBe('2026-11-08')
  })
})
