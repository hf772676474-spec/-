import { literatureData, populationData, siteData } from '../data'
import type { ActivityPlan, EnvironmentParameter, MatchExplanation, Recommendation, Site, Survey } from '../types'

const value = (site: Site, ...keys: string[]) => {
  for (const key of keys) {
    const current = site[key]
    if (current !== undefined && current !== null && String(current).trim()) return String(current)
  }
  return ''
}

const unknown = (text: string) => !text || /待测|待核|未知|未核实/.test(text)
const notApplicable = (text: string) => /不适用/.test(text)

const siteIdentity = (site: Site) => ({
  id: value(site, 'ID', '场地ID'),
  name: value(site, '分区或路段', '场地名称', '区域名称'),
  parent: value(site, '园区', '所属场地', '位置'),
  type: value(site, '类型', '性质'),
  fact: value(site, '官方或公开资料事实', '已知信息', '空间或路线资料'),
  task: value(site, '建议研究任务', '适用方向', '候选人群'),
  access: value(site, '开放许可状态', '合规条件', '现行进入状态'),
  density: value(site, '林分密度'),
  canopy: value(site, '郁闭度', '郁闭/开敞'),
  sight: value(site, '林下视距'),
  sound: value(site, '声景/LAeq', '声景LAeq'),
  slope: value(site, '坡度'),
  distance: value(site, '距离', '路线长度'),
  source: value(site, '出处URL', '资料链接', '来源URL'),
})

const desiredEnvironment = (input: Survey, populationFeatures: string) => ({
  density: input.goal === 'attention' ? '可比较疏朗林分，但不设通用密度阈值' : '不预设最佳林分密度，需现场测量后比较',
  canopy: input.goal === 'education' ? '兼顾遮阴与可观察空间；郁闭度和感知开敞度分别记录' : '按个人遮阴与开敞偏好匹配，不预设最佳郁闭度',
  understory: input.mobility === 'limited' ? '视线清晰、风险点可辨，并完成客观安全核验' : '路径可辨、视线较清晰，主观安全与客观风险分别核验',
  soundscape: input.goal === 'stress' ? '自然声可感、人工干扰较低；不得用“有水体”替代声学测量' : '记录自然声与人工干扰，不设统一最佳分贝值',
  activity: input.mobility === 'limited' ? '连续无障碍、平整路面、休息设施和可安全返程' : input.mobility === 'light' ? '低负担、少爬升、可休息并可随时折返' : `体力可承受、路线清晰并与可用时间匹配；${populationFeatures}`,
})

const statusOf = (text: string): EnvironmentParameter['actualStatus'] => {
  if (notApplicable(text)) return '不适用'
  if (unknown(text)) return '待核实'
  return '已确认'
}

function environmentParameters(site: Site, input: Survey, populationFeatures: string): EnvironmentParameter[] {
  const s = siteIdentity(site)
  const desired = desiredEnvironment(input, populationFeatures)
  const soundContext = /溪流|瀑布/.test(s.fact) && unknown(s.sound)
    ? `${s.sound || '待测'}；公开资料仅确认有溪流/瀑布，不代表已确认声学品质`
    : s.sound || '未记录'
  const activityActual = [`距离：${s.distance || '未记录'}`, `坡度：${s.slope || '未记录'}`, `准入：${s.access || '未记录'}`].join('；')
  const activityStatus: EnvironmentParameter['actualStatus'] = [s.distance, s.slope, s.access].every((item) => !unknown(item)) ? '已确认' : [s.distance, s.slope, s.access].some((item) => !unknown(item)) ? '部分确认' : '待核实'

  return [
    { key: 'density', label: '林分密度', desired: desired.density, actual: s.density || '待测', actualStatus: statusOf(s.density), visual: { levels: ['相对疏朗', '中等密度', '相对密集'], suggestedIndex: input.goal === 'attention' ? 0 : null, actualIndex: null } },
    { key: 'canopy', label: '郁闭度与空间开敞度', desired: desired.canopy, actual: s.canopy || '待测；感知空间开敞度未采集', actualStatus: statusOf(s.canopy), visual: { levels: ['较开敞', '过渡空间', '较围合'], suggestedIndex: input.goal === 'education' ? 1 : null, actualIndex: null } },
    { key: 'understory', label: '林下空间', desired: desired.understory, actual: `${s.sight || '林下视距待测'}；安全感与客观风险未完成现场核验`, actualStatus: unknown(s.sight) ? '待核实' : '部分确认', visual: { levels: ['视线受阻', '一般可辨', '较为通达'], suggestedIndex: 2, actualIndex: null } },
    { key: 'soundscape', label: '自然声景', desired: desired.soundscape, actual: soundContext, actualStatus: unknown(s.sound) ? '待核实' : '已确认', visual: { levels: ['人工声显著', '自然与人工混合', '自然声显著'], suggestedIndex: input.goal === 'stress' ? 2 : null, actualIndex: null } },
    { key: 'activity', label: '活动负荷', desired: desired.activity, actual: activityActual, actualStatus: activityStatus, visual: { levels: ['低负荷', '中等负荷', '较高负荷'], suggestedIndex: input.mobility === 'normal' ? 1 : 0, actualIndex: null } },
  ]
}

function activityPlan(input: Survey): ActivityPlan {
  const available = { short: '30分钟以内', medium: '30–90分钟', long: '90分钟以上' }[input.duration]
  const mobilityMinutes = input.mobility === 'limited' ? '15–25分钟' : input.mobility === 'light' ? '20–35分钟' : input.duration === 'long' ? '45–70分钟' : input.duration === 'medium' ? '30–50分钟' : '15–20分钟'
  const natureTime = input.goal === 'stress'
    ? input.duration === 'short' ? '约15–20分钟' : '约20–30分钟'
    : input.goal === 'attention'
      ? input.duration === 'short' ? '约15–20分钟' : '约30分钟'
      : input.goal === 'education'
        ? '按年龄与课程组织，建议20–40分钟'
        : '按本人耐受分段安排，不设统一时长'
  const goalSteps: Record<Survey['goal'], string[]> = {
    attention: ['5分钟适应环境并确认返程点', '低负担慢行与定点自然观察', '5分钟记录注意状态与主观疲劳'],
    stress: ['5分钟低速进入与环境适应', '慢行或安全座位静坐，记录自然声与人工干扰', '结束前复核体力并原路安全返回'],
    activity: ['5分钟热身与路况确认', '按可交谈强度分段步行，中途设置休息点', '5分钟放松并记录主观用力程度'],
    education: ['明确观察主题与安全边界', '开展植物辨识、自然记录或亲子观察任务', '用照片或笔记完成回顾分享'],
  }
  const steps = input.mobility === 'limited'
    ? ['仅在连续无障碍得到确认后进入', '在入口、馆内或安全休息区开展坐姿观察', '预留陪同、如厕与安全返程时间']
    : goalSteps[input.goal]
  return {
    availableTime: `${available}（用户选择的整体可用时间）`,
    natureContactTime: `${natureTime}（研究参考与初步设计建议）`,
    plannedActivityTime: `${mobilityMinutes}（不含交通与安全核验）`,
    steps,
    note: '以上时长用于原型活动组织，不是已经验证的最佳康养剂量，也不替代个人健康与安全评估。',
  }
}

function confirmedFeatures(site: Site) {
  const s = siteIdentity(site)
  return [
    s.fact,
    !unknown(s.distance) ? `公开资料记录距离：${s.distance}` : '',
    !unknown(s.density) && !notApplicable(s.density) ? `林分密度：${s.density}` : '',
    !unknown(s.canopy) && !notApplicable(s.canopy) ? `郁闭/开敞：${s.canopy}` : '',
    !unknown(s.sound) ? `声景/LAeq：${s.sound}` : '',
  ].filter(Boolean)
}

export function recommend(input: Survey): Recommendation[] {
  const population = populationData.find((item) => item.人群ID === input.populationId) ?? populationData[0]
  const evidenceIds = population.证据编号.match(/L\d{2}/g) ?? []
  const desired = desiredEnvironment(input, population.建议环境特征)

  return siteData
    .filter((site) => site.记录类型 === '具体分段')
    .map((site) => {
      const s = siteIdentity(site)
      let score = 10
      const reasons: string[] = []
      const reasonKeywords: string[] = []
      const verification: string[] = []
      const educationFit = /教育|科普|植物|辨识|观察|专类园/.test(`${s.fact}${s.task}${s.type}`)
      const walkingFit = /步行|森林步行|入园|徒步/.test(`${s.task}${s.type}`)
      const soundFunctionFit = /声景|溪流|瀑布/.test(`${s.fact}${s.task}`)
      const lowLoadFit = /室内|入园步行段/.test(s.type) || /0\.4km/.test(s.distance)
      const botanicalFit = /植物|树木|针叶|银杏|海棠|芳香/.test(`${s.fact}${s.type}`)

      if (input.goal === 'education' && educationFit) { score += 36; reasonKeywords.push('科普与观察'); reasons.push('场地公开功能包含科普、植物观察或自然教育内容') }
      if (input.goal === 'activity' && walkingFit) { score += 30; reasonKeywords.push('步行功能'); reasons.push('场地功能包含步行或徒步活动') }
      if (input.goal === 'stress' && soundFunctionFit) { score += 28; reasonKeywords.push('自然声场景'); reasons.push('公开资料记录溪流、瀑布或自然声景研究任务，但声学品质仍待测') }
      if (input.goal === 'attention' && botanicalFit) { score += 25; reasonKeywords.push('植物观察'); reasons.push('场地具有植物观察或自然辨识功能，可承载定点注意任务') }
      if (input.companion === 'child' && educationFit) { score += 20; reasonKeywords.push('亲子任务'); reasons.push('公开功能与儿童或亲子观察任务相符') }
      if (input.populationId === 'P06' && /儿童|科普/.test(`${s.task}${s.fact}`)) { score += 24; reasonKeywords.push('儿童科普'); reasons.push('公开资料明确包含儿童自然教育或科普主题') }
      if (input.populationId === 'P04' && lowLoadFit) { score += 22; reasonKeywords.push('低负担优先核查'); reasons.push('公开路线或场馆类型更适合优先核查低负担活动') }
      if (input.populationId === 'P05' && /室内/.test(s.type)) { score += 32; reasonKeywords.push('室内候选'); reasons.push('室内科普功能可作为低负担研究候选，但馆内连续无障碍仍待核') }
      if (input.populationId === 'P05' && lowLoadFit) { score += 42; reasonKeywords.push('无障碍待核'); reasons.push('公开资料显示为室内场馆或较短入口段，仅优先用于无障碍可行性核查，不代表已经适合通行') }
      if (input.mobility === 'light' && /山地徒步/.test(s.type)) score -= 25
      if (input.mobility === 'limited') score -= /室内/.test(s.type) ? 8 : 38
      if (input.duration === 'short' && /3\.7km|2\.2km|2\.0km/.test(s.distance)) score -= 24
      if (input.duration === 'long' && /0\.4km/.test(s.distance)) score -= 5

      if (unknown(s.access)) verification.push(`开放与准入：${s.access || '未记录'}`)
      if (unknown(s.density)) verification.push('林分密度待实测，不用于判断场地具有某种林分特征')
      if (unknown(s.canopy)) verification.push('郁闭度与空间开敞度待实测，不用于环境匹配结论')
      if (unknown(s.sight)) verification.push('林下视距、安全感和客观风险待现场核验')
      if (unknown(s.sound)) verification.push('自然声与人工噪声待测，有溪流不等于声景质量已确认')
      if (unknown(s.slope)) verification.push('步道坡度、台阶及连续爬升待核')
      if (unknown(s.distance)) verification.push('路线距离待核')
      if (input.mobility === 'limited') verification.unshift('连续无障碍、卫生间、休息设施与安全返程尚未完成全路段核实')

      const restricted = /未经核实禁止|保护区/.test(`${s.access}${s.parent}`)
      const parameters = environmentParameters(site, input, population.建议环境特征)
      const confirmed = confirmedFeatures(site)
      const hasFunctionMatch = reasons.length > 0
      const safetyBlocked = restricted || input.mobility === 'limited'
      const matchLevel = safetyBlocked ? '待核实' : score >= 40 && hasFunctionMatch ? '较高' : '中等'
      const plannedActivity = activityPlan(input)
      const explanation: MatchExplanation = {
        demand: `${population.用户类型}：${population.主要目标}`,
        requiredEnvironment: [desired.understory, desired.soundscape, desired.activity].join('；'),
        confirmedSiteAttribute: confirmed.length ? confirmed.join('；') : '尚无可支持精确环境匹配的实测属性',
        activity: plannedActivity.steps[1] ?? plannedActivity.steps[0],
        basis: parameters.every((item) => item.actualStatus === '待核实' || item.actualStatus === '不适用') ? '待核实功能匹配' : parameters.some((item) => item.actualStatus === '已确认' || item.actualStatus === '部分确认') ? '部分属性匹配' : '已知功能匹配',
      }

      return {
        siteId: s.id,
        siteName: s.name,
        parent: s.parent,
        score: Math.max(0, score),
        matchLevel,
        status: safetyBlocked ? '仅研究候选' : '初步候选',
        knownEnvironmentFeatures: confirmed,
        reasonKeywords: reasonKeywords.length ? [...new Set(reasonKeywords)] : ['研究候选'],
        matchReasons: reasons.length ? reasons : ['场地仅作为秦岭数据库中的研究候选，尚缺直接功能匹配证据'],
        environmentParameters: parameters,
        activityPlan: plannedActivity,
        explanation,
        knownFacts: [s.fact, s.distance && `公开距离信息：${s.distance}`, s.source && `来源：${s.source}`].filter(Boolean),
        designSuggestions: plannedActivity.steps,
        verification: [...new Set(verification)],
        literatureIds: evidenceIds,
      } satisfies Recommendation
    })
    .sort((a, b) => b.score - a.score || a.siteId.localeCompare(b.siteId))
    .slice(0, 3)
}

export function relatedLiterature(ids: string[]) {
  return literatureData.filter((item) => ids.includes(item.编号))
}
