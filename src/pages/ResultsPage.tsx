import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight, CheckCircle2, CircleHelp, ExternalLink, Eye, MapPin, Route, Target, Timer, TreePine, Waves } from '../components/Icons'
import EvidenceBadge from '../components/EvidenceBadge'
import { recommend, relatedLiterature } from '../engine/recommend'
import { useApp } from '../state/AppContext'
import type { EnvironmentParameter, MatchLevel } from '../types'

const parameterIcons: Record<EnvironmentParameter['key'], LucideIcon> = {
  density: TreePine,
  canopy: Eye,
  understory: CheckCircle2,
  soundscape: Waves,
  activity: Route,
}

const levelStyle: Record<MatchLevel, string> = {
  较高: 'border-pine-300 bg-pine-50 text-pine-800',
  中等: 'border-amber-200 bg-amber-50 text-amber-800',
  待核实: 'border-rose-200 bg-rose-50 text-rose-800',
}

const statusStyle: Record<EnvironmentParameter['actualStatus'], string> = {
  已确认: 'bg-pine-100 text-pine-800',
  部分确认: 'bg-amber-100 text-amber-800',
  待核实: 'bg-rose-100 text-rose-800',
  不适用: 'bg-slate-100 text-slate-600',
}

function ParameterCard({ parameter }: { parameter: EnvironmentParameter }) {
  const Icon = parameterIcons[parameter.key]
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h4 className="flex items-center gap-2 text-sm font-bold text-pine-900"><Icon size={17} className="text-pine-600" />{parameter.label}</h4>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyle[parameter.actualStatus]}`}>{parameter.actualStatus}</span>
      </div>
      <div className="mt-5" aria-label={`${parameter.label}原型分级示意`}>
        <div className="grid grid-cols-3 gap-1.5">{parameter.visual.levels.map((level, levelIndex) => <div key={level} className={`rounded-lg border px-2 py-2 text-center text-[12px] font-semibold leading-5 ${parameter.visual.suggestedIndex === levelIndex ? 'border-pine-700 bg-pine-700 text-white' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>{level}</div>)}</div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[12px] leading-5"><span className="font-semibold text-pine-700">深绿色表示原型建议方向</span><span className="text-slate-500">实际位置：{parameter.visual.actualIndex === null ? '待测' : parameter.visual.levels[parameter.visual.actualIndex]}</span></div>
      </div>
      <div className="mt-5 grid gap-3 text-sm leading-7 sm:grid-cols-2">
        <div className="rounded-xl bg-pine-50 p-4"><strong className="block text-pine-800">建议环境特征</strong><p className="mt-1 text-slate-700">{parameter.desired}</p></div>
        <div className="rounded-xl bg-sand p-4"><strong className="block text-pine-800">实际场地属性</strong><p className="mt-1 text-slate-700">{parameter.actual}</p></div>
      </div>
      {parameter.actualStatus === '待核实' && <p className="mt-3 rounded-lg border border-dashed border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800">待核实参数：目前没有可支持分级的实测数据。</p>}
    </div>
  )
}

export default function ResultsPage() {
  const { survey } = useApp()
  const results = recommend(survey)
  return (
    <section className="page-shell py-16 sm:py-24">
      <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl"><p className="eyebrow">第三步 · 个性化推荐</p><h1 className="section-title mt-4">当前条件下的候选场地</h1><p className="mt-5 leading-8 text-slate-600">“功能匹配程度”只描述场地公开功能与用户目标的契合情况，不是疗效评分。环境属性只有在知识库明确记录时才会标为已确认。</p></div>
        <Link to="/survey" className="btn-secondary">调整需求</Link>
      </div>
      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"><AlertTriangle className="mt-0.5 shrink-0" size={18} /><p>推荐不是医疗处方或实时导览。当前场地普遍缺少实测林分、郁闭度、坡度和连续无障碍数据，出发前必须核实开放、天气、交通、路段安全与个人体力。</p></div>

      <div className="mt-10 space-y-10">{results.map((result, index) => {
        const papers = relatedLiterature(result.literatureIds)
        return (
          <article key={result.siteId} className="overflow-hidden rounded-[2rem] border border-pine-100 bg-white shadow-soft">
            <header className="grid bg-pine-900 text-white lg:grid-cols-[.72fr_1.28fr]">
              <div className="p-7 sm:p-9"><span className="text-xs font-bold tracking-[.2em] text-pine-300">候选 0{index + 1}</span><h2 className="mt-4 font-serif text-3xl font-bold">{result.siteName}</h2><p className="mt-3 flex items-start gap-2 text-sm leading-6 text-pine-100"><MapPin size={16} className="mt-1 shrink-0" />{result.parent}</p></div>
              <div className="border-t border-white/10 p-7 sm:p-9 lg:border-l lg:border-t-0"><div className="flex flex-wrap gap-2"><span className={`rounded-full border px-3 py-1 text-sm font-bold ${levelStyle[result.matchLevel]}`}>功能匹配程度：{result.matchLevel}</span><span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold">{result.status}</span></div><h3 className="mt-5 text-sm font-bold text-pine-200">主要推荐理由</h3><div className="mt-3 flex flex-wrap gap-2">{result.reasonKeywords.map((keyword) => <span key={keyword} className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-white">{keyword}</span>)}</div></div>
            </header>

            <div className="space-y-9 p-6 sm:p-9">
              <section>
                <div className="flex items-center gap-3"><Target className="text-pine-700" size={20} /><h3 className="text-xl font-bold text-pine-900">为什么推荐这里</h3><span className="tag">{result.explanation.basis}</span></div>
                <div className="mt-4 flex flex-wrap gap-2">{result.reasonKeywords.map((keyword) => <span key={keyword} className="tag">{keyword}</span>)}</div>
                <details className="mt-5 rounded-2xl border border-pine-100 bg-pine-50/50 p-4 open:bg-white">
                  <summary className="cursor-pointer text-sm font-bold text-pine-800">展开查看完整推荐逻辑</summary>
                  <div className="mt-5 grid gap-3 lg:grid-cols-4">{[['用户需求', result.explanation.demand], ['所需环境特征', result.explanation.requiredEnvironment], ['已确认场地属性', result.explanation.confirmedSiteAttribute], ['可开展活动', result.explanation.activity]].map(([title, text], step) => <div key={title} className="relative rounded-2xl border border-pine-100 bg-pine-50/60 p-4"><span className="text-xs font-bold tracking-wider text-pine-500">0{step + 1} · {title}</span><p className="mt-2 text-[15px] leading-7 text-slate-700">{text}</p>{step < 3 && <ArrowRight className="absolute -right-5 top-1/2 z-10 hidden text-pine-300 lg:block" size={18} />}</div>)}</div>
                  <ul className="mt-4 space-y-2 border-t border-pine-100 pt-4 text-[15px] leading-7 text-slate-700">{result.matchReasons.map((reason) => <li key={reason} className="flex gap-2"><CheckCircle2 size={17} className="mt-1.5 shrink-0 text-pine-600" />{reason}</li>)}</ul>
                </details>
                {result.explanation.basis !== '已知功能匹配' && <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-900"><CircleHelp size={17} className="mt-1.5 shrink-0" />本候选主要基于已知场地功能与公开事实进行初步匹配，并非基于完整实测环境参数的精确匹配。</p>}
              </section>

              <section className="border-t border-slate-100 pt-8"><div className="flex items-center justify-between gap-4"><div><p className="eyebrow">五类森林环境参数</p><h3 className="mt-2 text-xl font-bold text-pine-900">建议特征、实际属性与待核参数</h3><p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">分级仅用于原型界面说明和现场采集规划，不代表科研确认的最佳阈值，也不用于把用户偏好反推为场地事实。</p></div></div><div className="mt-5 grid gap-4 lg:grid-cols-2">{result.environmentParameters.map((parameter) => <ParameterCard key={parameter.key} parameter={parameter} />)}</div></section>

              <section className="border-t border-slate-100 pt-8"><div className="flex items-center gap-3"><Timer className="text-pine-700" size={20} /><h3 className="text-xl font-bold text-pine-900">差异化活动安排</h3></div><div className="mt-5 grid gap-3 md:grid-cols-3"><div className="rounded-2xl bg-pine-900 p-4 text-white"><span className="text-xs text-pine-300">整体可用出行时间</span><p className="mt-2 font-bold">{result.activityPlan.availableTime}</p></div><div className="rounded-2xl bg-pine-100 p-4 text-pine-900"><span className="text-xs text-pine-700">建议自然接触时间</span><p className="mt-2 font-bold">{result.activityPlan.natureContactTime}</p></div><div className="rounded-2xl bg-sand p-4 text-pine-900"><span className="text-xs text-pine-700">实际建议活动时间</span><p className="mt-2 font-bold">{result.activityPlan.plannedActivityTime}</p></div></div><ol className="mt-5 grid gap-3 md:grid-cols-3">{result.activityPlan.steps.map((step, stepIndex) => <li key={step} className="rounded-2xl border border-pine-100 p-4 text-sm leading-6 text-slate-600"><strong className="mr-2 text-pine-700">{stepIndex + 1}.</strong>{step}</li>)}</ol><p className="mt-4 text-xs leading-6 text-slate-500">{result.activityPlan.note}</p></section>

              <section className="grid gap-6 border-t border-slate-100 pt-8 lg:grid-cols-2"><div><EvidenceBadge kind="文献证据" /><div className="mt-4 space-y-3">{papers.length ? papers.map((paper) => <details key={paper.编号} id={`paper-${result.siteId}-${paper.编号}`} className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 open:bg-white"><summary className="cursor-pointer text-sm font-bold leading-6 text-pine-900"><span className="mr-2 inline-flex rounded-lg bg-blue-100 px-2 py-1 text-blue-800">{paper.编号}</span>{paper.论文题目}</summary><div className="mt-4 border-t border-blue-100 pt-4 text-sm leading-7"><p className="text-slate-700"><strong>完整题录：</strong>{paper.年份} · {paper.设计} · {paper.样本}</p><p className="mt-2 text-slate-700"><strong>研究结论：</strong>{paper.主要结果}</p><p className="mt-2 text-slate-600"><strong>证据限制：</strong>{paper.限制条件}</p><a href={paper['DOI/链接']} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-10 items-center gap-1 font-bold text-pine-700">DOI / 原文链接 <ExternalLink size={14} /></a></div></details>) : <p className="text-sm text-slate-500">暂无可直接关联的文献编号。</p>}</div></div><div><EvidenceBadge kind="待核实信息" /><ul className="mt-4 space-y-2">{result.verification.map((item) => <li key={item} className="rounded-xl bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-900">{item}</li>)}</ul></div></section>

              <details className="rounded-2xl bg-sand p-4"><summary className="cursor-pointer text-sm font-bold text-pine-900">查看公开资料中的已知场地特征与来源</summary><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">{result.knownFacts.map((item) => item.startsWith('来源：') ? <li key={item}><a href={item.replace('来源：', '')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-pine-700">公开资料来源 <ExternalLink size={13} /></a></li> : <li key={item}>{item}</li>)}</ul></details>
            </div>
          </article>
        )
      })}</div>
      <div className="mt-10 text-center"><Link to="/evidence" className="btn-primary">查看全部文献与边界 <ArrowRight size={18} /></Link></div>
    </section>
  )
}
