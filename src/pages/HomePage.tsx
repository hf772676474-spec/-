import { ArrowRight, BookOpenCheck, Database, MapPinned, ShieldCheck, Sparkles } from '../components/Icons'
import { Link } from 'react-router-dom'
import { importManifest } from '../data'

const flow = [
  ['01', '识别人群', '从六类使用者与真实需求出发'],
  ['02', '匹配环境', '只使用已录入的环境变量与边界'],
  ['03', '筛选场地', '优先检查准入、安全和体力条件'],
  ['04', '形成建议', '活动设计与研究证据分开陈述'],
  ['05', '追溯来源', '每项证据回到论文编号或公开资料'],
]

export default function HomePage() {
  return (
    <>
      <section className="forest-grid overflow-hidden border-b border-pine-100">
        <div className="page-shell grid min-h-[650px] items-center gap-12 py-20 lg:grid-cols-[1.08fr_.92fr]">
          <div>
            <p className="eyebrow">环境心理学 × 秦岭场地数据</p>
            <h1 className="mt-6 max-w-4xl font-serif text-5xl font-bold leading-[1.08] tracking-tight text-pine-900 sm:text-6xl lg:text-7xl">让每一次走进森林，<br /><span className="text-pine-600">都有依据，也有边界。</span></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">基于三份本地知识库，为六类人群提供森林康养与自然教育候选建议。系统明确标注已知事实、初步设计建议与待核信息。</p>
            <div className="mt-9 flex flex-wrap gap-3"><Link to="/groups" className="btn-primary">开始选择人群 <ArrowRight size={18} /></Link><Link to="/evidence" className="btn-secondary"><BookOpenCheck size={18} />查看文献依据</Link></div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-pine-800"><span className="flex items-center gap-2"><Database size={16} />{importManifest.rawRecordCount} 条原始记录</span><span className="flex items-center gap-2"><ShieldCheck size={16} />未知数据不补值</span><span className="flex items-center gap-2"><MapPinned size={16} />21 条场地与分段</span></div>
          </div>
          <div className="relative hidden min-h-[500px] lg:block" aria-hidden="true">
            <div className="absolute inset-4 rotate-3 rounded-[3rem] bg-pine-100" />
            <div className="absolute inset-0 overflow-hidden rounded-[3rem] border border-white/70 bg-pine-800 p-10 text-white shadow-soft">
              <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[38px] border-pine-700" />
              <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full border-[44px] border-moss/30" />
              <Sparkles className="relative text-pine-300" />
              <p className="relative mt-28 font-serif text-4xl font-bold leading-tight">把“适合”拆成<br />可以核查的条件。</p>
              <div className="relative mt-16 grid grid-cols-2 gap-3 text-sm"><span className="rounded-2xl bg-white/10 p-4">合法准入</span><span className="rounded-2xl bg-white/10 p-4">个人能力</span><span className="rounded-2xl bg-white/10 p-4">环境匹配</span><span className="rounded-2xl bg-white/10 p-4">证据边界</span></div>
            </div>
          </div>
        </div>
      </section>
      <section className="page-shell py-24">
        <p className="eyebrow">推荐链路</p><h2 className="section-title mt-4">五步形成一份可解释的候选建议</h2>
        <div className="mt-12 grid gap-4 md:grid-cols-5">{flow.map(([no, title, text]) => <article key={no} className="rounded-3xl border border-pine-100 bg-white p-5"><span className="font-serif text-3xl font-bold text-pine-200">{no}</span><h3 className="mt-8 font-bold text-pine-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></article>)}</div>
      </section>
    </>
  )
}

