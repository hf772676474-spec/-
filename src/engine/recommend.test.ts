import { describe, expect, it } from 'vitest'
import { populationData } from '../data'
import type { Survey } from '../types'
import { recommend } from './recommend'

const profiles: Record<string, Survey> = {
  P01: { populationId: 'P01', goal: 'attention', mobility: 'normal', duration: 'medium', companion: 'solo' },
  P02: { populationId: 'P02', goal: 'stress', mobility: 'normal', duration: 'medium', companion: 'solo' },
  P03: { populationId: 'P03', goal: 'activity', mobility: 'normal', duration: 'medium', companion: 'adult' },
  P04: { populationId: 'P04', goal: 'activity', mobility: 'light', duration: 'medium', companion: 'adult' },
  P05: { populationId: 'P05', goal: 'stress', mobility: 'limited', duration: 'short', companion: 'adult' },
  P06: { populationId: 'P06', goal: 'education', mobility: 'normal', duration: 'medium', companion: 'child' },
}

describe('六类人群推荐审计', () => {
  it('六类人群均生成三条结构完整的候选结果', () => {
    expect(populationData).toHaveLength(6)
    for (const profile of Object.values(profiles)) {
      const results = recommend(profile)
      expect(results).toHaveLength(3)
      for (const result of results) {
        expect(result.environmentParameters).toHaveLength(5)
        expect(result.matchReasons.length).toBeGreaterThan(0)
        expect(result.activityPlan.steps).toHaveLength(3)
        expect(result.explanation.demand).toBeTruthy()
      }
    }
  })

  it('六类典型需求不会得到完全相同的候选场地组合', () => {
    const combinations = Object.values(profiles).map((profile) => recommend(profile).map((item) => item.siteId).join(','))
    expect(new Set(combinations).size).toBe(combinations.length)
  })

  it('每类人群只引用其知识库规则中登记的文献编号', () => {
    for (const [populationId, profile] of Object.entries(profiles)) {
      const population = populationData.find((item) => item.人群ID === populationId)!
      const allowed = new Set(population.证据编号.match(/L\d{2}/g) ?? [])
      for (const result of recommend(profile)) {
        expect(result.literatureIds.length).toBeGreaterThan(0)
        expect(result.literatureIds.every((id) => allowed.has(id))).toBe(true)
      }
    }
  })

  it('未知环境参数不会被标成已确认', () => {
    for (const profile of Object.values(profiles)) {
      for (const result of recommend(profile)) {
        for (const parameter of result.environmentParameters) {
          expect(parameter.visual.levels).toHaveLength(3)
          if (/待测|待核|未知|未记录/.test(parameter.actual)) {
            expect(parameter.actualStatus).not.toBe('已确认')
            expect(parameter.visual.actualIndex).toBeNull()
          }
        }
      }
    }
  })

  it('建议环境特征不会被复制成场地实际属性', () => {
    for (const profile of Object.values(profiles)) {
      for (const result of recommend(profile)) {
        for (const parameter of result.environmentParameters) {
          expect(parameter.actual).not.toBe(parameter.desired)
        }
      }
    }
  })

  it('行动受限人群的安全约束始终生效', () => {
    const results = recommend(profiles.P05)
    expect(results.every((item) => item.status === '仅研究候选')).toBe(true)
    expect(results.every((item) => item.matchLevel === '待核实')).toBe(true)
    expect(results.every((item) => item.verification.some((note) => note.includes('连续无障碍')))).toBe(true)
    expect(results.every((item) => item.activityPlan.steps[0].startsWith('仅在连续无障碍得到确认后'))).toBe(true)
  })

  it('儿童自然教育优先出现明确科普功能场地', () => {
    const [first] = recommend(profiles.P06)
    expect(`${first.siteName}${first.knownEnvironmentFeatures.join('')}`).toMatch(/科普|儿童|植物/)
  })

  it('活动时间同时显示整体时间、自然接触与实际活动时间，并保留非处方声明', () => {
    for (const profile of Object.values(profiles)) {
      const plan = recommend(profile)[0].activityPlan
      expect(plan.availableTime).toContain('用户选择')
      expect(plan.natureContactTime).toMatch(/研究参考|初步设计建议/)
      expect(plan.plannedActivityTime).toContain('不含交通与安全核验')
      expect(plan.note).toContain('不是已经验证的最佳康养剂量')
    }
  })
})
