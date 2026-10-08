import { ArrowRight, Check } from '../components/Icons'
import { useNavigate } from 'react-router-dom'
import { populationData } from '../data'
import { useApp } from '../state/AppContext'
import type { Survey } from '../types'

const fields: { key: keyof Survey; title: string; options: [string, string][] }[] = [
  { key: 'goal', title: '这次最希望获得什么？', options: [['attention', '恢复注意与学习状态'], ['stress', '减压与情绪放松'], ['activity', '轻度活动与身心舒展'], ['education', '亲子自然教育']] },
  { key: 'mobility', title: '目前的步行与行动能力？', options: [['normal', '可正常步行'], ['light', '希望低负担、少爬升'], ['limited', '行动受限或需要连续无障碍']] },
  { key: 'duration', title: '期望活动时长？', options: [['short', '30分钟以内'], ['medium', '30–90分钟'], ['long', '90分钟以上']] },
  { key: 'companion', title: '出行方式？', options: [['solo', '独自或同龄朋友'], ['adult', '与成年家人同行'], ['child', '有儿童同行']] },
]

export default function SurveyPage() {
  const navigate = useNavigate()
  const { survey, setSurvey } = useApp()
  const population = populationData.find((item) => item.人群ID === survey.populationId)
  const update = (key: keyof Survey, value: string) => setSurvey({ ...survey, [key]: value })
  return (
    <section className="page-shell py-16 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start"><p className="eyebrow">第二步 · 需求调查</p><h1 className="section-title mt-4">补充真实需求</h1><div className="mt-8 rounded-3xl bg-pine-900 p-6 text-white"><p className="text-xs font-bold uppercase tracking-widest text-pine-300">当前人群</p><h2 className="mt-3 text-2xl font-bold">{population?.用户类型}</h2><p className="mt-3 text-sm leading-7 text-pine-100">{population?.限制}</p></div><p className="mt-5 text-sm leading-7 text-slate-500">系统先检查准入与安全，再进行环境偏好匹配。未知坡度、郁闭度或林分密度不会被补成数值。</p></aside>
        <div className="space-y-8">{fields.map((field, fieldIndex) => <fieldset key={field.key} className="card"><legend className="px-2 text-lg font-bold text-pine-900"><span className="mr-3 text-pine-300">0{fieldIndex + 1}</span>{field.title}</legend><div className="mt-5 grid gap-3 sm:grid-cols-2">{field.options.map(([value, label]) => { const selected = survey[field.key] === value; return <button type="button" key={value} onClick={() => update(field.key, value)} className={`flex items-center justify-between rounded-2xl border p-4 text-left text-sm font-semibold transition ${selected ? 'border-pine-700 bg-pine-50 text-pine-900' : 'border-slate-200 bg-white text-slate-600 hover:border-pine-300'}`}><span>{label}</span>{selected && <span className="grid h-6 w-6 place-items-center rounded-full bg-pine-700 text-white"><Check size={14} /></span>}</button>})}</div></fieldset>)}<button className="btn-primary w-full sm:w-auto" onClick={() => navigate('/results')}>生成本地推荐 <ArrowRight size={18} /></button></div>
      </div>
    </section>
  )
}

