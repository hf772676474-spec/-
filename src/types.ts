export type Population = {
  人群ID: string
  用户类型: string
  主要目标: string
  建议环境特征: string
  环境自变量: string
  时长建议: string
  证据编号: string
  限制: string
}

export type Literature = {
  编号: string
  年份: string
  论文题目: string
  设计: string
  样本: string
  主要结果: string
  可用定量值: string
  适用人群: string
  初步等级: string
  限制条件: string
  'DOI/链接': string
}

export type Site = Record<string, string | number | null | { file: string; sheet: string; row: number }> & {
  记录类型: '具体分段' | '场地候选' | '具体区域'
}

export type Survey = {
  populationId: string
  goal: 'attention' | 'stress' | 'activity' | 'education'
  mobility: 'normal' | 'light' | 'limited'
  duration: 'short' | 'medium' | 'long'
  companion: 'solo' | 'adult' | 'child'
}

export type EvidenceKind = '文献证据' | '初步设计建议' | '待核实信息'

export type MatchLevel = '较高' | '中等' | '待核实'

export type EnvironmentParameter = {
  key: 'density' | 'canopy' | 'understory' | 'soundscape' | 'activity'
  label: string
  desired: string
  actual: string
  actualStatus: '已确认' | '部分确认' | '待核实' | '不适用'
  visual: {
    levels: [string, string, string]
    suggestedIndex: 0 | 1 | 2 | null
    actualIndex: 0 | 1 | 2 | null
  }
}

export type ActivityPlan = {
  availableTime: string
  natureContactTime: string
  plannedActivityTime: string
  steps: string[]
  note: string
}

export type MatchExplanation = {
  demand: string
  requiredEnvironment: string
  confirmedSiteAttribute: string
  activity: string
  basis: '已知功能匹配' | '部分属性匹配' | '待核实功能匹配'
}

export type Recommendation = {
  siteId: string
  siteName: string
  parent: string
  score: number
  matchLevel: MatchLevel
  status: '初步候选' | '仅研究候选'
  knownEnvironmentFeatures: string[]
  reasonKeywords: string[]
  matchReasons: string[]
  environmentParameters: EnvironmentParameter[]
  activityPlan: ActivityPlan
  explanation: MatchExplanation
  knownFacts: string[]
  designSuggestions: string[]
  verification: string[]
  literatureIds: string[]
}

