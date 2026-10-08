import { ArrowRight, Brain, Footprints, GraduationCap, HeartPulse, PersonStanding, Smile } from '../components/Icons'
import { useNavigate } from 'react-router-dom'
import { populationData } from '../data'
import { useApp } from '../state/AppContext'

const icons = [Brain, Smile, PersonStanding, HeartPulse, Footprints, GraduationCap]

export default function GroupsPage() {
  const navigate = useNavigate()
  const { survey, setSurvey } = useApp()
  const choose = (populationId: string) => {
    setSurvey({ ...survey, populationId, goal: populationId === 'P06' ? 'education' : populationId === 'P01' ? 'attention' : 'stress' })
    navigate('/survey')
  }
  return (
    <section className="page-shell py-16 sm:py-24">
      <div className="max-w-3xl"><p className="eyebrow">第一步 · 人群识别</p><h1 className="section-title mt-4">你更接近哪类使用者？</h1><p className="mt-5 text-lg leading-8 text-slate-600">人群只用于建立初始规则，不代替健康评估。选择最接近的一类，下一步仍会询问体力和活动目标。</p></div>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{populationData.map((item, index) => { const Icon = icons[index]; return <button key={item.人群ID} onClick={() => choose(item.人群ID)} className="group card text-left transition hover:-translate-y-1 hover:border-pine-300"><div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-pine-50 text-pine-700"><Icon /></span><span className="text-xs font-bold text-pine-400">{item.人群ID}</span></div><h2 className="mt-8 text-xl font-bold text-pine-900">{item.用户类型}</h2><p className="mt-3 text-sm leading-7 text-slate-600">目标：{item.主要目标}</p><div className="mt-5 border-t border-pine-50 pt-5"><p className="text-xs leading-6 text-slate-500">{item.建议环境特征}</p></div><span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-pine-700">选择并继续 <ArrowRight size={16} className="transition group-hover:translate-x-1" /></span></button>})}</div>
    </section>
  )
}

