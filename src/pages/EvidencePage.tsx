import { ExternalLink, FileText } from '../components/Icons'
import EvidenceBadge from '../components/EvidenceBadge'
import { importManifest, literatureData } from '../data'

export default function EvidencePage() {
  return (
    <section className="page-shell py-16 sm:py-24">
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div className="max-w-3xl"><p className="eyebrow">证据溯源</p><h1 className="section-title mt-4">10 篇核心文献，逐条说明能说什么</h1><p className="mt-5 text-lg leading-8 text-slate-600">文献结论只在原研究范围内使用。场地设计建议不会被包装成已验证疗效，现场未知参数也不会由论文替代。</p></div><div className="rounded-3xl bg-pine-100 px-6 py-4 text-sm text-pine-900"><strong className="text-2xl">{importManifest.sheetCount}</strong><br />个工作表已结构化</div></div>
      <div className="mt-10 grid gap-3 rounded-3xl border border-pine-100 bg-white p-5 sm:grid-cols-3"><div><EvidenceBadge kind="文献证据" /><p className="mt-2 text-xs leading-5 text-slate-500">论文中明确报告的研究结果</p></div><div><EvidenceBadge kind="初步设计建议" /><p className="mt-2 text-xs leading-5 text-slate-500">由需求与已知场地功能形成的原型建议</p></div><div><EvidenceBadge kind="待核实信息" /><p className="mt-2 text-xs leading-5 text-slate-500">现场测量、开放许可或安全信息仍缺失</p></div></div>
      <div className="mt-10 grid gap-5 lg:grid-cols-2">{literatureData.map((paper) => <article key={paper.编号} className="card flex flex-col"><div className="flex items-start justify-between gap-5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-pine-50 font-serif font-bold text-pine-800">{paper.编号}</span><span className="tag">证据等级 {paper.初步等级}</span></div><h2 className="mt-6 text-lg font-bold leading-7 text-pine-900">{paper.论文题目}</h2><div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500"><span>{paper.年份}</span><span>·</span><span>{paper.设计}</span><span>·</span><span>{paper.样本}</span></div><p className="mt-5 text-sm leading-7 text-slate-600">{paper.主要结果}</p><div className="mt-5 rounded-2xl bg-rose-50 p-4 text-xs leading-6 text-rose-900"><strong>使用边界：</strong>{paper.限制条件}</div><div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5 text-sm"><span className="flex items-center gap-2 text-slate-500"><FileText size={15} />{paper.可用定量值}</span><a href={paper['DOI/链接']} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-pine-700">原文 <ExternalLink size={14} /></a></div></article>)}</div>
    </section>
  )
}

